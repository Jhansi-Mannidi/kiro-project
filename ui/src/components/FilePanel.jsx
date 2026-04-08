import { useState } from 'react';

// Build a tree structure from flat file list
function buildTree(files) {
  const root = {};
  for (const file of files) {
    const parts = file.path.replace(/\\/g, '/').split('/');
    let node = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i === parts.length - 1) {
        node[part] = { __file: true, ...file };
      } else {
        if (!node[part]) node[part] = {};
        node = node[part];
      }
    }
  }
  return root;
}

function getFileIcon(name) {
  if (name.endsWith('.jsx') || name.endsWith('.tsx')) return { icon: '⚛', color: '#61dafb' };
  if (name.endsWith('.ts') || name.endsWith('.js')) return { icon: '⬡', color: '#f7df1e' };
  if (name.endsWith('.json')) return { icon: '{}', color: '#f97316' };
  if (name.endsWith('.sql')) return { icon: '🗄', color: '#4ade80' };
  if (name.endsWith('.css')) return { icon: '🎨', color: '#a78bfa' };
  if (name.endsWith('.html')) return { icon: '🌐', color: '#60a5fa' };
  if (name.endsWith('.yml') || name.endsWith('.yaml')) return { icon: '⚙', color: '#94a3b8' };
  if (name.includes('Dockerfile')) return { icon: '🐳', color: '#0ea5e9' };
  if (name.endsWith('.md')) return { icon: '📝', color: '#94a3b8' };
  if (name.startsWith('.env')) return { icon: '🔑', color: '#fbbf24' };
  return { icon: '📄', color: '#94a3b8' };
}

function getFolderIcon(name) {
  const map = {
    src: '#60a5fa', components: '#a78bfa', pages: '#f472b6',
    routes: '#4ade80', controllers: '#fb923c', models: '#f87171',
    database: '#4ade80', backend: '#fb923c', frontend: '#60a5fa',
    node_modules: '#6b7280', dist: '#6b7280', '.git': '#6b7280',
  };
  return map[name] || '#fbbf24';
}

function TreeNode({ name, node, depth, selectedFile, onSelect, t, defaultOpen }) {
  const isFile = node.__file === true;
  const [open, setOpen] = useState(defaultOpen || depth < 2);

  if (isFile) {
    const { icon, color } = getFileIcon(name);
    const isSelected = selectedFile?.path === node.path;
    return (
      <div
        onClick={() => onSelect(node)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: `3px 8px 3px ${16 + depth * 12}px`,
          cursor: 'pointer', borderRadius: 4,
          background: isSelected ? t.selected : 'transparent',
          color: isSelected ? t.accent : t.text,
          fontSize: 12, userSelect: 'none',
        }}
      >
        <span style={{ fontSize: 11, color, flexShrink: 0, width: 14, textAlign: 'center' }}>{icon}</span>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
      </div>
    );
  }

  // Folder
  const children = Object.entries(node).sort(([aName, aNode], [bName, bNode]) => {
    const aIsFile = aNode.__file === true;
    const bIsFile = bNode.__file === true;
    if (aIsFile !== bIsFile) return aIsFile ? 1 : -1;
    return aName.localeCompare(bName);
  });

  const folderColor = getFolderIcon(name);

  return (
    <div>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: `3px 8px 3px ${16 + depth * 12}px`,
          cursor: 'pointer', fontSize: 12, color: t.text,
          userSelect: 'none',
        }}
      >
        <span style={{ fontSize: 9, color: t.muted, width: 10, flexShrink: 0 }}>
          {open ? '▾' : '▸'}
        </span>
        <span style={{ fontSize: 13, flexShrink: 0 }}>
          {open ? '📂' : '📁'}
        </span>
        <span style={{ color: folderColor, fontWeight: 500 }}>{name}</span>
      </div>
      {open && children.map(([childName, childNode]) => (
        <TreeNode
          key={childName}
          name={childName}
          node={childNode}
          depth={depth + 1}
          selectedFile={selectedFile}
          onSelect={onSelect}
          t={t}
          defaultOpen={depth < 1}
        />
      ))}
    </div>
  );
}

function logColor(level, t) {
  if (level === 'error') return '#f87171';
  if (level === 'success') return t.green;
  if (level === 'warn') return t.yellow;
  return t.muted;
}

export default function FilePanel({ files, selectedFile, setSelectedFile, status, logs, t }) {
  const [tab, setTab] = useState('files');
  const [search, setSearch] = useState('');

  const tree = buildTree(files);
  const filteredFiles = search
    ? files.filter(f => f.path.toLowerCase().includes(search.toLowerCase()))
    : null;

  return (
    <div style={{ width: 260, display: 'flex', flexDirection: 'column', borderRight: `1px solid ${t.border}`, background: t.bg, flexShrink: 0 }}>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${t.border}`, background: t.surface, flexShrink: 0 }}>
        {['files', 'logs'].map(tb => (
          <button key={tb} onClick={() => setTab(tb)} style={{
            flex: 1, padding: '9px 0', border: 'none', background: 'transparent',
            color: tab === tb ? t.accent : t.muted,
            borderBottom: tab === tb ? `2px solid ${t.accent}` : '2px solid transparent',
            fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            textTransform: 'uppercase', letterSpacing: '0.5px',
          }}>
            {tb === 'files' ? `FILES${files.length ? ` (${files.length})` : ''}` : `LOGS${status === 'loading' ? ' ●' : ''}`}
          </button>
        ))}
      </div>

      {tab === 'files' ? (
        <>
          {/* Search */}
          {files.length > 0 && (
            <div style={{ padding: '6px 8px', borderBottom: `1px solid ${t.border}`, flexShrink: 0 }}>
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search files..."
                style={{
                  width: '100%', padding: '4px 8px', borderRadius: 4,
                  border: `1px solid ${t.border}`, background: t.input,
                  color: t.text, fontSize: 11, outline: 'none',
                  fontFamily: 'inherit', boxSizing: 'border-box',
                }}
              />
            </div>
          )}

          <div style={{ flex: 1, overflowY: 'auto', paddingTop: 4 }}>
            {status === 'idle' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: t.muted, fontSize: 12, textAlign: 'center', padding: 20, gap: 8 }}>
                <div style={{ fontSize: 36, opacity: 0.3 }}>📂</div>
                <div>Files appear here after generation</div>
              </div>
            )}
            {status === 'loading' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: t.muted, fontSize: 12, gap: 12 }}>
                <div style={{ width: 28, height: 28, border: `3px solid ${t.border}`, borderTop: `3px solid ${t.accent}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <div>Generating...</div>
              </div>
            )}

            {/* Search results — flat list */}
            {search && filteredFiles && filteredFiles.map(f => {
              const { icon, color } = getFileIcon(f.path.split('/').pop());
              const isSelected = selectedFile?.path === f.path;
              return (
                <div key={f.path} onClick={() => setSelectedFile(f)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '4px 12px', cursor: 'pointer', fontSize: 11,
                    background: isSelected ? t.selected : 'transparent',
                    color: isSelected ? t.accent : t.text,
                  }}>
                  <span style={{ color, fontSize: 11 }}>{icon}</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.path}</span>
                </div>
              );
            })}

            {/* Tree view */}
            {!search && files.length > 0 && Object.entries(tree)
              .sort(([aName, aNode], [bName, bNode]) => {
                const aIsFile = aNode.__file === true;
                const bIsFile = bNode.__file === true;
                if (aIsFile !== bIsFile) return aIsFile ? 1 : -1;
                return aName.localeCompare(bName);
              })
              .map(([name, node]) => (
                <TreeNode
                  key={name}
                  name={name}
                  node={node}
                  depth={0}
                  selectedFile={selectedFile}
                  onSelect={setSelectedFile}
                  t={t}
                  defaultOpen={true}
                />
              ))
            }
          </div>
        </>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', padding: 12, fontFamily: '"Fira Code", monospace', fontSize: 11 }}>
          {logs.length === 0 && (
            <div style={{ color: t.muted, textAlign: 'center', marginTop: 40 }}>No logs yet</div>
          )}
          {logs.map((log, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4, lineHeight: 1.5, color: logColor(log.level, t) }}>
              <span style={{ color: t.dim, flexShrink: 0, fontSize: 10 }}>{log.time}</span>
              <span style={{ wordBreak: 'break-all', fontSize: 11 }}>{log.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
