import { useState } from 'react';

export default function RightPanel({ status, outputPath, tests, testStatus, onRunTests, t, isDark, deployUrl, deployLocalUrl, deployStatus }) {
  const [tab, setTab] = useState('preview');

  const passed = tests.filter(t => t.status === 'pass').length;
  const failed = tests.filter(t => t.status === 'fail').length;
  const skipped = tests.filter(t => t.status === 'skip').length;

  return (
    <div style={{ width: 340, display: 'flex', flexDirection: 'column', background: t.bg, flexShrink: 0 }}>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${t.border}`, background: t.surface, flexShrink: 0 }}>
        {['preview', 'tests', 'run'].map(tb => (
          <button key={tb} onClick={() => setTab(tb)} style={{
            flex: 1, padding: '9px 0', border: 'none', background: 'transparent',
            color: tab === tb ? t.accent : t.muted,
            borderBottom: tab === tb ? `2px solid ${t.accent}` : '2px solid transparent',
            fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.5px',
          }}>
            {tb === 'preview' ? '🌐 Preview' : tb === 'tests' ? `🧪 Tests${tests.length ? ` (${tests.length})` : ''}` : '▶ Run'}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* ── PREVIEW TAB ── */}
        {tab === 'preview' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {status === 'idle' && (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                <div style={{ textAlign: 'center', color: t.muted }}>
                  <div style={{ fontSize: 56, opacity: 0.2, marginBottom: 16 }}>⚡</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 8 }}>Ready to Generate</div>
                  <div style={{ fontSize: 12, lineHeight: 1.7, maxWidth: 240 }}>Enter a prompt and click Generate to build your full-stack app</div>
                  <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                    {['⚛ React', '🟢 Node.js', '🐘 PostgreSQL', '🐳 Docker'].map(f => (
                      <span key={f} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, border: `1px solid ${t.border}`, color: t.muted }}>{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {status === 'loading' && (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                <div style={{ textAlign: 'center', color: t.muted }}>
                  <div style={{ width: 52, height: 52, border: `4px solid ${t.border}`, borderTop: `4px solid ${t.accent}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 20px' }} />
                  <div style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 8 }}>Generating App</div>
                  <div style={{ fontSize: 11, lineHeight: 2 }}>
                    {['Planner', 'Database', 'Backend', 'Frontend', 'DevOps'].map(a => (
                      <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.accent, display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                        {a} Agent
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {status === 'done' && (
              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                {deployStatus === 'deploying' && (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: t.muted }}>
                    <div style={{ width: 40, height: 40, border: `3px solid ${t.border}`, borderTop: `3px solid ${t.accent}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: 16 }} />
                    <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>Deploying with Docker...</div>
                    <div style={{ fontSize: 12, marginTop: 6 }}>Building containers, this takes 1-2 min</div>
                  </div>
                )}

                {deployStatus === 'done' && deployUrl && (
                  <>
                    {/* URL bar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '8px 10px', background: t.surface, borderBottom: `1px solid ${t.border}`, flexShrink: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 11, color: t.green }}>●</span>
                        <span style={{ fontSize: 11, color: t.muted, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {deployLocalUrl || deployUrl}
                        </span>
                        <a href={deployLocalUrl || deployUrl} target="_blank" rel="noreferrer"
                          style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, border: `1px solid ${t.border}`, background: t.input, color: t.text, textDecoration: 'none', flexShrink: 0 }}>
                          ↗ Local
                        </a>
                      </div>
                      {deployUrl !== deployLocalUrl && deployUrl && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 11, color: '#f97316' }}>🌍</span>
                          <span style={{ fontSize: 11, color: '#f97316', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{deployUrl}</span>
                          <a href={deployUrl} target="_blank" rel="noreferrer"
                            style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, border: '1px solid #f97316', background: 'rgba(249,115,22,0.1)', color: '#f97316', textDecoration: 'none', flexShrink: 0 }}>
                            ↗ Public
                          </a>
                        </div>
                      )}
                    </div>
                    {/* Iframe preview — use local URL to avoid ngrok CORS issues */}
                    <iframe
                      src={deployLocalUrl || deployUrl}
                      style={{ flex: 1, border: 'none', width: '100%', background: '#fff' }}
                      title="Deployed App Preview"
                    />
                  </>
                )}

                {deployStatus === 'error' && (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: t.muted, padding: 24 }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 8 }}>Auto-deploy failed</div>
                    <div style={{ fontSize: 12, marginBottom: 20, textAlign: 'center' }}>Run manually in terminal:</div>
                    <pre style={{ background: t.codeBg, borderRadius: 6, padding: '8px 12px', fontSize: 11, color: t.accent, fontFamily: '"Fira Code", monospace', margin: 0 }}>
{`cd ${outputPath}
docker compose up --build`}
                    </pre>
                    <button onClick={() => setTab('tests')} style={{ marginTop: 16, padding: '8px 16px', background: t.accent, color: t.bg, border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                      🧪 Run Tests
                    </button>
                  </div>
                )}

                {deployStatus === 'idle' && (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.muted }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 52, marginBottom: 12 }}>✅</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: t.text }}>App Generated!</div>
                      <div style={{ fontSize: 12, marginTop: 6 }}>Deploying...</div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {status === 'error' && (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                <div style={{ textAlign: 'center', color: t.muted }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>❌</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#f87171', marginBottom: 8 }}>Generation Failed</div>
                  <div style={{ fontSize: 12 }}>Check the Logs tab for details</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TESTS TAB ── */}
        {tab === 'tests' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
            {/* Summary bar */}
            {tests.length > 0 && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <div style={{ flex: 1, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: t.green }}>{passed}</div>
                  <div style={{ fontSize: 10, color: t.muted, fontWeight: 600 }}>PASSED</div>
                </div>
                <div style={{ flex: 1, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: t.red }}>{failed}</div>
                  <div style={{ fontSize: 10, color: t.muted, fontWeight: 600 }}>FAILED</div>
                </div>
                <div style={{ flex: 1, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: t.yellow }}>{skipped}</div>
                  <div style={{ fontSize: 10, color: t.muted, fontWeight: 600 }}>SKIPPED</div>
                </div>
              </div>
            )}

            {/* Run button */}
            <button
              onClick={onRunTests}
              disabled={testStatus === 'running' || status !== 'done'}
              style={{
                width: '100%', padding: '10px', marginBottom: 16,
                background: testStatus === 'running' ? t.dim : status !== 'done' ? t.input : t.accent,
                color: status !== 'done' ? t.muted : t.bg,
                border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13,
                cursor: status !== 'done' || testStatus === 'running' ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {testStatus === 'running' ? '⏳ Running Tests...' : '🧪 Run Test Suite'}
            </button>

            {testStatus === 'idle' && tests.length === 0 && (
              <div style={{ textAlign: 'center', color: t.muted, padding: 20 }}>
                <div style={{ fontSize: 36, opacity: 0.2, marginBottom: 10 }}>🧪</div>
                <div style={{ fontSize: 12 }}>
                  {status === 'done' ? 'Click "Run Test Suite" to test your generated app' : 'Generate an app first, then run tests'}
                </div>
              </div>
            )}

            {testStatus === 'running' && (
              <div style={{ textAlign: 'center', color: t.muted, padding: 20 }}>
                <div style={{ width: 32, height: 32, border: `3px solid ${t.border}`, borderTop: `3px solid ${t.accent}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                <div style={{ fontSize: 12 }}>Running tests against generated code...</div>
              </div>
            )}

            {/* Test results */}
            {tests.map((test, i) => (
              <div key={i} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, padding: '10px 12px', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ fontSize: 14, flexShrink: 0 }}>
                    {test.status === 'pass' ? '✅' : test.status === 'fail' ? '❌' : '⏭'}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: t.text, marginBottom: 2 }}>{test.name}</div>
                    <div style={{ fontSize: 10, color: t.muted, marginBottom: test.error ? 6 : 0 }}>{test.description}</div>
                    {test.error && (
                      <pre style={{ fontSize: 10, color: t.red, background: t.codeBg, borderRadius: 4, padding: '4px 8px', margin: 0, overflowX: 'auto', fontFamily: '"Fira Code", monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {test.error}
                      </pre>
                    )}
                  </div>
                  <span style={{
                    fontSize: 9, padding: '2px 6px', borderRadius: 10, fontWeight: 700, flexShrink: 0,
                    background: test.status === 'pass' ? 'rgba(74,222,128,0.15)' : test.status === 'fail' ? 'rgba(248,113,113,0.15)' : 'rgba(251,191,36,0.15)',
                    color: test.status === 'pass' ? t.green : test.status === 'fail' ? t.red : t.yellow,
                  }}>
                    {test.status?.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── RUN TAB ── */}
        {tab === 'run' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 14 }}>How to run your app</div>
            {[
              { n: '1', title: 'Fix Docker credentials', cmd: `echo '{"auths":{}}' > ~/.docker/config.json` },
              { n: '2', title: 'Go to output directory', cmd: `cd ${outputPath || './output'}` },
              { n: '3', title: 'Build & start all services', cmd: 'docker compose up --build' },
              { n: '4', title: 'Open in browser', cmd: 'http://localhost' },
            ].map(item => (
              <div key={item.n} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, padding: '12px', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: t.accent, color: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{item.n}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: t.text }}>{item.title}</span>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <pre style={{ flex: 1, background: t.codeBg, borderRadius: 5, padding: '6px 10px', fontSize: 11, color: t.accent, margin: 0, fontFamily: '"Fira Code", monospace', overflowX: 'auto' }}>{item.cmd}</pre>
                  <button onClick={() => navigator.clipboard.writeText(item.cmd)}
                    style={{ fontSize: 10, padding: '4px 8px', borderRadius: 4, border: `1px solid ${t.border}`, background: t.input, color: t.muted, cursor: 'pointer', flexShrink: 0, fontFamily: 'inherit' }}>
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
