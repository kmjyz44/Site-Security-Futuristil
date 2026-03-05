import { useEffect, useState } from 'react';

export default function OriginalSite() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'hsl(220, 25%, 5%)',
          color: '#00e1ff',
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '20px'
        }}>
          Loading...
        </div>
      )}
      <iframe
        src="/original.html"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          margin: 0,
          padding: 0,
          display: loading ? 'none' : 'block'
        }}
        title="SecureHome Chicago"
      />
    </div>
  );
}
