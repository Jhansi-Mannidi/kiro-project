import { useState, useRef, useEffect } from 'react';
import FilePanel from './components/FilePanel';
import CodePanel from './components/CodePanel';
import RightPanel from './components/RightPanel';
import TopBar from './components/TopBar';
import './index.css';

const STATUS = { IDLE: 'idle', LOADING: 'loading', DONE: 'done', ERROR: 'error' };

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState(STATUS.IDLE);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [logs, setLogs] = useState([]);
  const [outputPath, setOutputPath] = useState('');
  const [tests, setTests] = useState([]);
  const [testStatus, setTestStatus] = useState('idle');
  const [deployUrl, setDeployUrl] = useState('');
  const [deployLocalUrl, setDeployLocalUrl] = useState('');
  const [deployStatus, setDeployStatus] = useState('idle');
  const isDark = theme === 'dark';
  const t = isDark ? dark : light;

  function addLog(text, level = 'info') {
    setLogs(l => [...l, { time: new Date().toLocaleTimeString(), text, level }]);
  }

  async function handleGenerate() {
    if (!prompt.trim() || status === STATUS.LOADING) return;
    setStatus(STATUS.LOADING);
    setFiles([]); setSelectedFile(null); setLogs([]); setOutputPath(''); setTests([]);
    setDeployUrl(''); setDeployLocalUrl(''); setDeployStatus('idle');
    addLog('Starting generation...', 'info');
    addLog('⏳ This takes 3-8 minutes with Ollama — please wait...', 'warn');
    addLog('Agents: Database → Backend → Frontend → DevOps', 'info');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      let data;
      const text = await res.text();
      try { data = JSON.parse(text); } catch {
        setStatus(STATUS.ERROR);
        addLog(`Server error (${res.status}): ${text.slice(0, 200) || 'Empty response'}`, 'error');
        return;
      }

      if (data.success) {
        setStatus(STATUS.DONE);
        setOutputPath(data.outputPath);
        addLog('Generation complete!', 'success');
        data.tasks?.forEach(tk => addLog(`  ✓ ${tk.agentType}: ${tk.description.slice(0, 55)}...`, 'success'));
        await loadFiles(data.outputPath);
        // Auto-deploy directly without domain modal
        await autoDeploy(data.outputPath, '');
      } else {
        setStatus(STATUS.ERROR);
        addLog(data.error || 'Unknown error', 'error');
      }
    } catch (err) {
      setStatus(STATUS.ERROR);
      addLog(err.message, 'error');
    }
  }

  async function handleDomainConfirm(domain) {
    setShowDomainModal(false);
    await autoDeploy(pendingOutputPath, domain);
  }

  function handleDomainSkip() {
    setShowDomainModal(false);
    autoDeploy(pendingOutputPath, '');
  }

  async function loadFiles(op) {
    try {
      const res = await fetch(`/api/files?path=${encodeURIComponent(op)}`);
      const data = await res.json();
      if (data.files?.length) { setFiles(data.files); setSelectedFile(data.files[0]); }
    } catch { addLog('Could not load files', 'warn'); }
  }

  async function autoDeploy(op, domain) {
    setDeployStatus('deploying');
    addLog(`🐳 Deploying${domain ? ` as ${domain}` : ''}...`, 'info');
    try {
      const res = await fetch('/api/deploy', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outputPath: op, domain }),
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { success: false, error: text }; }
      if (data.success) {
        setDeployUrl(data.url);
        setDeployLocalUrl(data.localUrl || data.url);
        setDeployStatus('done');
        if (data.url !== data.localUrl && data.localUrl) {
          addLog(`🌍 Public URL: ${data.url}`, 'success');
          addLog(`🏠 Local URL: ${data.localUrl}`, 'info');
        } else {
          addLog(`🚀 Deployed! Live at: ${data.url}`, 'success');
        }
      } else {
        setDeployStatus('error');
        addLog(`Deploy failed: ${data.error?.slice(0, 100)}`, 'warn');
      }
    } catch (err) {
      setDeployStatus('error');
      addLog(`Deploy error: ${err.message}`, 'warn');
    }
  }

  async function handleRunTests() {
    if (!outputPath) return;
    setTestStatus('running'); setTests([]);
    addLog('Running test suite...', 'info');
    try {
      const res = await fetch('/api/test', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outputPath, prompt }),
      });
      const data = await res.json();
      setTests(data.tests || []);
      setTestStatus('done');
      const passed = data.tests?.filter(t => t.status === 'pass').length || 0;
      addLog(`Tests complete: ${passed}/${data.tests?.length} passed`, passed === data.tests?.length ? 'success' : 'warn');
    } catch (err) {
      setTestStatus('done');
      addLog('Test run failed: ' + err.message, 'error');
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: t.bg, color: t.text, fontFamily: '"Inter", -apple-system, sans-serif' }}>
      <TopBar prompt={prompt} setPrompt={setPrompt} status={status} onGenerate={handleGenerate} theme={theme} setTheme={setTheme} t={t} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <FilePanel files={files} selectedFile={selectedFile} setSelectedFile={setSelectedFile} status={status} logs={logs} t={t} />
        <CodePanel selectedFile={selectedFile} t={t} />
        <RightPanel status={status} outputPath={outputPath} tests={tests} testStatus={testStatus} onRunTests={handleRunTests} t={t} isDark={isDark} deployUrl={deployUrl} deployLocalUrl={deployLocalUrl} deployStatus={deployStatus} />
      </div>
    </div>
  );
}

export const dark = {
  bg: '#09090b', surface: '#18181b', input: '#27272a', border: '#3f3f46',
  text: '#fafafa', muted: '#71717a', accent: '#ffffff', dim: '#52525b',
  selected: '#27272a', codeBg: '#0c0c0e', green: '#4ade80', red: '#f87171', yellow: '#fbbf24',
};
export const light = {
  bg: '#ffffff', surface: '#f4f4f5', input: '#e4e4e7', border: '#d4d4d8',
  text: '#09090b', muted: '#71717a', accent: '#18181b', dim: '#a1a1aa',
  selected: '#e4e4e7', codeBg: '#f8f8f8', green: '#16a34a', red: '#dc2626', yellow: '#d97706',
};
