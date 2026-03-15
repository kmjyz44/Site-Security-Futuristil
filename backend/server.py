from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, UploadFile, File, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
from jose import JWTError, jwt
import httpx
import base64

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Settings
SECRET_KEY = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# Security
security = HTTPBearer()

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ============ Models ============

class AdminCredentials(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class EmailSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    provider: str  # 'resend' or 'sendgrid'
    api_key: str
    from_email: str
    to_email: str

class EmailSettingsUpdate(BaseModel):
    provider: str
    api_key: str
    from_email: str
    to_email: str

class Section(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    image: str
    icon: Optional[str] = None
    order: int = 0
    visible: bool = True

class SectionCreate(BaseModel):
    title: str
    description: str
    image: str
    icon: Optional[str] = None
    order: int = 0
    visible: bool = True

class SectionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    icon: Optional[str] = None
    order: Optional[int] = None
    visible: Optional[bool] = None

class SiteContent(BaseModel):
    model_config = ConfigDict(extra="ignore")
    hero_title: str = "SecureHome Chicago"
    hero_subtitle: str = "Professional Security Systems & Handyman Services"
    about_text: str = "We provide the best services for your home and business"
    phone: str = "+1 (312) 555-0100"
    email: str = "info@securehome.com"
    address: str = "Chicago, IL"
    facebook: str = ""
    instagram: str = ""
    twitter: str = ""
    linkedin: str = ""
    youtube: str = ""

class SiteContentUpdate(BaseModel):
    hero_title: Optional[str] = None
    hero_subtitle: Optional[str] = None
    about_text: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    facebook: Optional[str] = None
    instagram: Optional[str] = None
    twitter: Optional[str] = None
    linkedin: Optional[str] = None
    youtube: Optional[str] = None

class ContactMessage(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    message: str

class ChatbotSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    enabled: bool = False
    widget_color: str = "#00e1ff"
    welcome_message: str = "Welcome! How can we help you?"
    position: str = "bottom-right"  # bottom-right, bottom-left

class ChatbotSettingsUpdate(BaseModel):
    enabled: Optional[bool] = None
    widget_color: Optional[str] = None
    welcome_message: Optional[str] = None
    position: Optional[str] = None

# ============ Auth Functions ============

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def init_admin():
    """Initialize default admin user if not exists"""
    logging.info("🔐 Checking for admin user...")
    admin = await db.admins.find_one({"username": "admin"})
    if not admin:
        logging.info("🔐 Admin not found, creating default admin...")
        hashed_password = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt())
        await db.admins.insert_one({
            "username": "admin",
            "password": hashed_password.decode('utf-8'),
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        logging.info("🔐 Default admin created: admin/admin123")
    else:
        logging.info("🔐 Admin user exists")

# ============ Email Functions ============

async def send_email_via_resend(api_key: str, from_email: str, to_email: str, subject: str, html: str):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            json={
                "from": from_email,
                "to": [to_email],
                "subject": subject,
                "html": html
            },
            timeout=10.0
        )
        return response.status_code == 200

async def send_email_via_sendgrid(api_key: str, from_email: str, to_email: str, subject: str, html: str):
    logging.info(f"📧 SendGrid: Sending email from {from_email} to {to_email}")
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.sendgrid.com/v3/mail/send",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            json={
                "personalizations": [{"to": [{"email": to_email}]}],
                "from": {"email": from_email},
                "subject": subject,
                "content": [{"type": "text/html", "value": html}]
            },
            timeout=10.0
        )
        logging.info(f"📧 SendGrid Response: {response.status_code} - {response.text}")
        return response.status_code == 202

# ============ Public Routes ============

@api_router.get("/")
async def root():
    return {"message": "SecureHome API"}

@api_router.get("/content", response_model=SiteContent)
async def get_content():
    content = await db.site_content.find_one({}, {"_id": 0})
    if not content:
        default_content = SiteContent()
        await db.site_content.insert_one(default_content.model_dump())
        return default_content
    return SiteContent(**content)

@api_router.get("/sections", response_model=List[Section])
async def get_sections():
    sections = await db.sections.find({"visible": True}, {"_id": 0}).sort("order", 1).to_list(100)
    return [Section(**s) for s in sections]

@api_router.post("/contact")
async def contact_form(
    name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(""),
    message: str = Form(...),
    service: str = Form(""),
    photos: List[UploadFile] = File(None)
):
    # Save uploaded photos
    photo_urls = []
    if photos:
        import os
        upload_dir = "/app/frontend/public/uploads"
        os.makedirs(upload_dir, exist_ok=True)
        
        for photo in photos:
            if photo and photo.filename:
                # Generate unique filename
                file_ext = photo.filename.split('.')[-1]
                unique_filename = f"{uuid.uuid4()}.{file_ext}"
                file_path = os.path.join(upload_dir, unique_filename)
                
                # Save file
                with open(file_path, "wb") as buffer:
                    content = await photo.read()
                    buffer.write(content)
                
                photo_urls.append(f"/uploads/{unique_filename}")
    
    # Save message to DB
    message_dict = {
        'name': name,
        'email': email,
        'phone': phone or 'Not provided',
        'service': service or 'Not specified',
        'message': message,
        'photos': photo_urls,
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'read': False
    }
    await db.messages.insert_one(message_dict)
    
    # Send email
    logging.info("📧 Looking for email settings...")
    email_settings = await db.email_settings.find_one({}, {"_id": 0})
    
    # Use hardcoded defaults if no settings in database
    if not email_settings:
        logging.info("📧 No settings in DB, using hardcoded defaults")
        email_settings = {
            "provider": "sendgrid",
            "api_key": "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",
            "from_email": "cameras@cameras.services",
            "to_email": "kmjyz44sha@gmail.com"
        }
    
    logging.info(f"📧 Email settings found: True")
    logging.info(f"📧 Provider: {email_settings.get('provider')}, From: {email_settings.get('from_email')}, To: {email_settings.get('to_email')}")
    
    subject = f"New message from {name}"
    photos_html = ""
    if photo_urls:
        photos_html = "<p><strong>Attached photos:</strong></p><ul>"
        for url in photo_urls:
            photos_html += f'<li><a href="{url}">{url}</a></li>'
        photos_html += "</ul>"
    
    html = f"""
    <h2>New message from website</h2>
    <p><strong>Name:</strong> {name}</p>
    <p><strong>Email:</strong> {email}</p>
    <p><strong>Phone:</strong> {phone or 'Not provided'}</p>
    <p><strong>Service:</strong> {service or 'Not specified'}</p>
    <p><strong>Message:</strong></p>
    <p>{message}</p>
    {photos_html}
    """
    
    try:
        if email_settings['provider'] == 'resend':
            logging.info("📧 Sending via Resend...")
            result = await send_email_via_resend(
                email_settings['api_key'],
                email_settings['from_email'],
                email_settings['to_email'],
                subject,
                html
            )
            logging.info(f"📧 Resend result: {result}")
        elif email_settings['provider'] == 'sendgrid':
            logging.info("📧 Sending via SendGrid...")
            result = await send_email_via_sendgrid(
                email_settings['api_key'],
                email_settings['from_email'],
                email_settings['to_email'],
                subject,
                html
            )
            logging.info(f"📧 SendGrid result: {result}")
        else:
            logging.warning(f"📧 Unknown provider: {email_settings['provider']}")
    except Exception as e:
        logging.error(f"📧 Email send error: {e}")
    
    return {"success": True, "message": "Message sent"}

@api_router.get("/chatbot-settings", response_model=ChatbotSettings)
async def get_chatbot_settings():
    settings = await db.chatbot_settings.find_one({}, {"_id": 0})
    if not settings:
        default_settings = ChatbotSettings()
        await db.chatbot_settings.insert_one(default_settings.model_dump())
        return default_settings
    return ChatbotSettings(**settings)

# ============ Admin Auth Routes ============

@api_router.post("/admin/login", response_model=Token)
async def admin_login(credentials: AdminCredentials):
    admin = await db.admins.find_one({"username": credentials.username})
    if not admin:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not bcrypt.checkpw(credentials.password.encode('utf-8'), admin['password'].encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": admin['username']})
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.post("/admin/change-password")
async def change_password(
    old_password: str = Form(...),
    new_password: str = Form(...),
    username: str = Depends(verify_token)
):
    admin = await db.admins.find_one({"username": username})
    if not bcrypt.checkpw(old_password.encode('utf-8'), admin['password'].encode('utf-8')):
        raise HTTPException(status_code=400, detail="Invalid old password")
    
    hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
    await db.admins.update_one(
        {"username": username},
        {"$set": {"password": hashed_password.decode('utf-8')}}
    )
    return {"success": True}

# ============ Admin Content Routes ============

@api_router.get("/admin/content", response_model=SiteContent)
async def admin_get_content(username: str = Depends(verify_token)):
    content = await db.site_content.find_one({}, {"_id": 0})
    if not content:
        default_content = SiteContent()
        return default_content
    return SiteContent(**content)

@api_router.put("/admin/content")
async def admin_update_content(
    content: SiteContentUpdate,
    username: str = Depends(verify_token)
):
    update_data = {k: v for k, v in content.model_dump().items() if v is not None}
    if update_data:
        await db.site_content.update_one({}, {"$set": update_data}, upsert=True)
    return {"success": True}

# ============ Admin Sections Routes ============

@api_router.get("/admin/sections", response_model=List[Section])
async def admin_get_sections(username: str = Depends(verify_token)):
    sections = await db.sections.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return [Section(**s) for s in sections]

@api_router.post("/admin/sections", response_model=Section)
async def admin_create_section(
    section: SectionCreate,
    username: str = Depends(verify_token)
):
    section_obj = Section(**section.model_dump())
    await db.sections.insert_one(section_obj.model_dump())
    return section_obj

@api_router.put("/admin/sections/{section_id}")
async def admin_update_section(
    section_id: str,
    section: SectionUpdate,
    username: str = Depends(verify_token)
):
    update_data = {k: v for k, v in section.model_dump().items() if v is not None}
    if update_data:
        result = await db.sections.update_one({"id": section_id}, {"$set": update_data})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Section not found")
    return {"success": True}

@api_router.delete("/admin/sections/{section_id}")
async def admin_delete_section(
    section_id: str,
    username: str = Depends(verify_token)
):
    result = await db.sections.delete_one({"id": section_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Section not found")
    return {"success": True}

# ============ Admin Email Settings Routes ============

@api_router.get("/admin/email-settings", response_model=EmailSettings)
async def admin_get_email_settings(username: str = Depends(verify_token)):
    settings = await db.email_settings.find_one({}, {"_id": 0})
    if not settings:
        return EmailSettings(provider="resend", api_key="", from_email="", to_email="")
    return EmailSettings(**settings)

@api_router.put("/admin/email-settings")
async def admin_update_email_settings(
    settings: EmailSettingsUpdate,
    username: str = Depends(verify_token)
):
    await db.email_settings.update_one(
        {},
        {"$set": settings.model_dump()},
        upsert=True
    )
    return {"success": True}

# ============ Admin Messages Routes ============

@api_router.get("/admin/messages")
async def admin_get_messages(username: str = Depends(verify_token)):
    messages = await db.messages.find({}, {"_id": 0}).sort("timestamp", -1).to_list(100)
    return messages

@api_router.put("/admin/messages/{timestamp}/read")
async def admin_mark_message_read(
    timestamp: str,
    username: str = Depends(verify_token)
):
    await db.messages.update_one(
        {"timestamp": timestamp},
        {"$set": {"read": True}}
    )
    return {"success": True}

# ============ Admin Chatbot Routes ============

@api_router.get("/admin/chatbot-settings", response_model=ChatbotSettings)
async def admin_get_chatbot_settings(username: str = Depends(verify_token)):
    settings = await db.chatbot_settings.find_one({}, {"_id": 0})
    if not settings:
        default_settings = ChatbotSettings()
        return default_settings
    return ChatbotSettings(**settings)

@api_router.put("/admin/chatbot-settings")
async def admin_update_chatbot_settings(
    settings: ChatbotSettingsUpdate,
    username: str = Depends(verify_token)
):
    update_data = {k: v for k, v in settings.model_dump().items() if v is not None}
    if update_data:
        await db.chatbot_settings.update_one({}, {"$set": update_data}, upsert=True)
    return {"success": True}

# ============ App Setup ============

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup():
    await init_admin()
    
    # Initialize email settings if not exist
    email_settings = await db.email_settings.find_one({})
    if not email_settings:
        default_email_settings = {
            "provider": "sendgrid",
            "api_key": "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",
            "from_email": "cameras@cameras.services",
            "to_email": "kmjyz44sha@gmail.com"
        }
        await db.email_settings.insert_one(default_email_settings)
        logging.info("📧 Default email settings initialized")
    
    # Initialize default sections
    count = await db.sections.count_documents({})
    if count == 0:
        default_sections = [
            {"id": str(uuid.uuid4()), "title": "Security Systems", "description": "Professional security system installation", "image": "/images/service-security-system.jpg", "icon": "shield", "order": 1, "visible": True},
            {"id": str(uuid.uuid4()), "title": "Video Surveillance", "description": "High-quality camera systems", "image": "/images/service-cameras.jpg", "icon": "camera", "order": 2, "visible": True},
            {"id": str(uuid.uuid4()), "title": "Electrical Work", "description": "Electrical services of any complexity", "image": "/images/service-electrical.jpg", "icon": "zap", "order": 3, "visible": True},
            {"id": str(uuid.uuid4()), "title": "Smart Home", "description": "Automation and control systems", "image": "/images/service-automation.jpg", "icon": "home", "order": 4, "visible": True},
            {"id": str(uuid.uuid4()), "title": "Lock Systems", "description": "Modern access control systems", "image": "/images/service-locks.jpg", "icon": "lock", "order": 5, "visible": True},
            {"id": str(uuid.uuid4()), "title": "TV Mounting", "description": "Professional TV installation", "image": "/images/service-tv.jpg", "icon": "tv", "order": 6, "visible": True},
        ]
        await db.sections.insert_many(default_sections)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
