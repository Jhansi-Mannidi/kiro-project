import { useState } from 'react';
import FilePanel from './components/FilePanel';
import CodePanel from './components/CodePanel';
import RightPanel from './components/RightPanel';
import TopBar from './components/TopBar';
import './index.css';

const STATUS = { IDLE: 'idle', LOADING: 'loading', DONE: 'done', ERROR: 'error' };

// ✅ ADD THIS (YOUR BACKEND URL)
const API_BASE = "https://kiro-project-eswo.onrender.com";

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
      const response = await fetch(`${API_BASE}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const text = await response.text();
        setStatus(STATUS.ERROR);
        addLog(`Server error (${response.status}): ${text.slice(0, 200)}`, 'error');
        return;
      }

      // Read SSE stream to keep connection alive during long generation
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr) continue;
          try {
            const data = JSON.parse(jsonStr);
            if (data.message) {
              addLog(data.message, data.level || 'info');
            } else if (data.success === true) {
              setStatus(STATUS.DONE);
              setOutputPath(data.outputPath);
              addLog('Generation complete!', 'success');
              data.tasks?.forEach(tk => addLog(`  ✓ ${tk.agentType}: ${tk.description?.slice(0, 55)}...`, 'success'));
              await loadFiles(data.outputPath);
              await autoDeploy(data.outputPath, '');
            } else if (data.success === false) {
              setStatus(STATUS.ERROR);
              addLog(data.error || 'Unknown error', 'error');
            }
          } catch { /* ignore parse errors on heartbeat lines */ }
        }
      }
    } catch (err) {
      setStatus(STATUS.ERROR);
      addLog(err.message, 'error');
    }
  }

  async function loadFiles(op) {
    try {
      const res = await fetch(`${API_BASE}/api/files?path=${encodeURIComponent(op)}`);
      const data = await res.json();

      if (data.files?.length) {
        setFiles(data.files);
        setSelectedFile(data.files[0]);
      }
    } catch {
      addLog('Could not load files', 'warn');
    }
  }

  async function autoDeploy(op, domain) {
    setDeployStatus('deploying');
    addLog(`🐳 Deploying...`, 'info');

    try {
      const res = await fetch(`${API_BASE}/api/deploy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outputPath: op, domain }),
      });

      const text = await res.text();
      let data;

      try { data = JSON.parse(text); } catch {
        data = { success: false, error: text };
      }

      if (data.success) {
        setDeployUrl(data.url);
        setDeployLocalUrl(data.localUrl || data.url);
        setDeployStatus('done');

        addLog(`🚀 Deployed: ${data.url}`, 'success');
      } else {
        setDeployStatus('error');
        addLog(`Deploy failed: ${data.error}`, 'warn');
      }

    } catch (err) {
      setDeployStatus('error');
      addLog(`Deploy error: ${err.message}`, 'warn');
    }
  }

  async function handleRunTests() {
    if (!outputPath) return;

    setTestStatus('running');
    setTests([]);

    addLog('Running tests...', 'info');

    try {
      const res = await fetch(`${API_BASE}/api/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outputPath, prompt }),
      });

      const data = await res.json();

      setTests(data.tests || []);
      setTestStatus('done');

      addLog('Tests complete', 'success');

    } catch (err) {
      setTestStatus('done');
      addLog(err.message, 'error');
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <TopBar
        prompt={prompt}
        setPrompt={setPrompt}
        status={status}
        onGenerate={handleGenerate}
        theme={theme}
        setTheme={setTheme}
        t={t}
      />

      <div style={{ display: 'flex', flex: 1 }}>
        <FilePanel files={files} selectedFile={selectedFile} setSelectedFile={setSelectedFile} status={status} logs={logs} t={t} />
        <CodePanel selectedFile={selectedFile} t={t} />
        <RightPanel status={status} outputPath={outputPath} tests={tests} testStatus={testStatus} onRunTests={handleRunTests} t={t} isDark={isDark} deployUrl={deployUrl} deployLocalUrl={deployLocalUrl} deployStatus={deployStatus} />
      </div>
    </div>
  );
}

export const dark = {
  bg: '#09090b', surface: '#18181b', text: '#fafafa'
};

export const light = {
  bg: '#ffffff', surface: '#f4f4f5', text: '#09090b'
};