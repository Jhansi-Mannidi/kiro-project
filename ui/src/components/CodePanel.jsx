function getLang(p) {
  if (!p) return '';
  if (p.endsWith('.js') || p.endsWith('.jsx')) return 'javascript';
  if (p.endsWith('.ts') || p.endsWith('.tsx')) return 'typescript';
  if (p.endsWith('.json')) return 'json';
  if (p.endsWith('.sql')) return 'sql';
  if (p.endsWith('.yml') || p.endsWith('.yaml')) return 'yaml';
  if (p.endsWith('.html')) return 'html';
  if (p.endsWith('.css')) return 'css';
  if (p.includes('Dockerfile')) return 'dockerfile';
  return 'text';
}

export default function CodePanel({ selectedFile, t }) {
  function copy() {
    if (selectedFile?.content) navigator.clipboard.writeText(selectedFile.content);
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: `1px solid ${t.border}`, overflow: 'hidden', minWidth: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', background: t.surface, borderBottom: `1px solid ${t.border}`, flexShrink: 0, minHeight: 38 }}>
        {selectedFile ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
              <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: t.input, color: t.accent, fontWeight: 700, flexShrink: 0 }}>{getLang(selectedFile.path).toUpperCase()}</span>
              <span style={{ fontSize: 12, color: t.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedFile.path}</span>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <span style={{ fontSize: 10, color: t.dim }}>{selectedFile.content?.split('\n').length} lines</span>
              <button onClick={copy} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, border: `1px solid ${t.border}`, background: t.input, color: t.text, cursor: 'pointer', fontFamily: 'inherit' }}>
                Copy
              </button>
            </div>
          </>
        ) : (
          <span style={{ fontSize: 12, color: t.muted }}>📝 Code Editor</span>
        )}
      </div>

      {/* Code */}
      {selectedFile ? (
        <div style={{ flex: 1, overflow: 'auto', background: t.codeBg }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', fontFamily: '"Fira Code","Cascadia Code",monospace', fontSize: 12 }}>
            <tbody>
              {selectedFile.content?.split('\n').map((line, i) => (
                <tr key={i} style={{ lineHeight: 1.7 }}>
                  <td style={{ padding: '0 12px 0 16px', color: t.dim, userSelect: 'none', textAlign: 'right', minWidth: 40, borderRight: `1px solid ${t.border}`, fontSize: 11 }}>
                    {i + 1}
                  </td>
                  <td style={{ padding: '0 16px', color: t.text, whiteSpace: 'pre', overflow: 'visible' }}>
                    {line || ' '}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.muted, flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 48, opacity: 0.15 }}>{'</>'}</div>
          <div style={{ fontSize: 13 }}>Select a file to view its code</div>
        </div>
      )}
    </div>
  );
}
