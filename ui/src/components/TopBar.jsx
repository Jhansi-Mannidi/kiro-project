const EXAMPLES = [
  'Build a todo app with user auth',
  'Create a blog with posts and comments',
  'Build an e-commerce product listing',
  'Create a calculator with history',
];

export default function TopBar({ prompt, setPrompt, status, onGenerate, theme, setTheme, t }) {
  const isLoading = status === 'loading';
  return (
    <div style={{ background: t.surface, borderBottom: `1px solid ${t.border}`, padding: '10px 20px', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <span style={{ fontSize: 15, fontWeight: 800, color: t.accent, letterSpacing: '-0.5px', whiteSpace: 'nowrap' }}>⚡ AI App Generator</span>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: t.input, border: `1px solid ${t.border}`, borderRadius: 10, padding: '7px 12px' }}>
          <span style={{ color: t.muted }}>✦</span>
          <textarea
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: t.text, fontSize: 13, resize: 'none', fontFamily: 'inherit', lineHeight: 1.4 }}
            placeholder="Describe the app you want to build... (Enter to generate)"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), onGenerate())}
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={onGenerate}
            disabled={isLoading || !prompt.trim()}
            style={{ padding: '6px 16px', background: isLoading ? t.dim : t.accent, color: t.bg, border: 'none', borderRadius: 7, fontWeight: 700, fontSize: 12, cursor: isLoading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', opacity: !prompt.trim() ? 0.4 : 1 }}
          >
            {isLoading ? '⏳ Generating...' : '🚀 Generate'}
          </button>
        </div>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text, cursor: 'pointer', fontSize: 15 }}
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {EXAMPLES.map(ex => (
          <button key={ex} onClick={() => setPrompt(ex)}
            style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, border: `1px solid ${t.border}`, background: 'transparent', color: t.muted, cursor: 'pointer', fontFamily: 'inherit' }}>
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
