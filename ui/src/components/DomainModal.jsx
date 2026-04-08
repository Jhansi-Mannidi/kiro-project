import { useState } from 'react';

export default function DomainModal({ t, onConfirm, onSkip }) {
  const [appName, setAppName] = useState('');

  function handleConfirm() {
    onConfirm(appName.trim());
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16,
        padding: 32, width: 440, boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
      }}>
        <div style={{ fontSize: 32, textAlign: 'center', marginBottom: 12 }}>🚀</div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: t.text, textAlign: 'center', margin: '0 0 6px' }}>
          Ready to Deploy!
        </h2>
        <p style={{ fontSize: 13, color: t.muted, textAlign: 'center', margin: '0 0 24px', lineHeight: 1.6 }}>
          Give your app a name (optional), then deploy it locally with Docker.
        </p>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: t.muted, display: 'block', marginBottom: 6 }}>
            APP NAME (optional)
          </label>
          <input
            autoFocus
            value={appName}
            onChange={e => setAppName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleConfirm()}
            placeholder="e.g. My Blog App"
            style={{
              width: '100%', padding: '10px 14px',
              background: t.input, border: `1px solid ${t.border}`,
              borderRadius: 8, color: t.text, fontSize: 14,
              outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ background: t.codeBg, borderRadius: 8, padding: '12px 14px', marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: t.muted, marginBottom: 6, fontWeight: 600 }}>YOUR APP WILL BE AVAILABLE AT</div>
          <div style={{ fontSize: 14, color: t.accent, fontFamily: '"Fira Code", monospace', fontWeight: 700 }}>
            http://localhost:8080
          </div>
          <div style={{ fontSize: 11, color: t.muted, marginTop: 4 }}>
            Port is assigned automatically to avoid conflicts
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onSkip} style={{
            flex: 1, padding: '10px', background: 'transparent',
            border: `1px solid ${t.border}`, borderRadius: 8,
            color: t.muted, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            Cancel
          </button>
          <button onClick={handleConfirm} style={{
            flex: 2, padding: '10px', background: t.accent,
            border: 'none', borderRadius: 8,
            color: t.bg, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            🚀 Deploy Now
          </button>
        </div>
      </div>
    </div>
  );
}
