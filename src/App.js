import React, { useState } from 'react';
import './App.css';

// Environment variable se API URL uthana, agar nahi mile to localhost use karna
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const SAMPLE_TEXT = "Artificial intelligence (AI) is transforming the world at an unprecedented pace. From healthcare to finance, AI is being used to automate tasks, analyze vast amounts of data, and provide insights that were previously impossible to uncover. However, the rapid advancement of AI also brings challenges, such as ethical concerns, data privacy issues, and the potential displacement of jobs. It is crucial for policymakers and technologists to work together to ensure that AI is developed and deployed responsibly.";

function App() {
  const [text, setText] = useState('');
  const [length, setLength] = useState('medium');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSummarize = async (e) => {
    e.preventDefault(); // Page refresh hone se rokna

    if (!text.trim()) {
      setError('Please paste or type some text first.');
      return;
    }

    setError('');
    setLoading(true);
    setSummary('');
    setCopied(false);

    // 30 Second Timeout Setup
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(`${API_URL}/api/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, length }),
        signal: controller.signal
      });

      let data;
      try {
        data = await response.json();
      } catch (err) {
        throw new Error('Invalid response from server.');
      }

      if (response.ok) {
        setSummary(data.summary);
      } else {
        setError(data.error || 'Failed to generate summary.');
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError('Unable to connect to the server. Please check your internet and try again.');
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy text. Please select and copy manually.');
    }
  };

  const handleClear = () => {
    setText('');
    setSummary('');
    setError('');
  };

  const loadSample = () => {
    setText(SAMPLE_TEXT);
    setError('');
    setSummary('');
  };

  return (
    <div className="main-wrapper">
      <div className="container">
        <header className="header">
          <div className="badge">⚡ AI-Powered Tool</div>
          <h1>Smart AI Article Summarizer</h1>
          <p>Transform long articles, blogs, and text into key bullet points instantly.</p>
        </header>

        <main className="main-card">
          {/* Form tag ka use kiya taake Enter key kaam kare */}
          <form onSubmit={handleSummarize}>
            <div className="input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <label htmlFor="summary-text" style={{ margin: 0 }}>Paste your text or article here:</label>
                
                {/* Yahan btn-link class use ki hai */}
                <button type="button" onClick={loadSample} className="btn-link">
                  Try an Example
                </button>
              </div>
              
              <textarea
                id="summary-text"
                rows="8"
                maxLength="10000"
                placeholder="Paste article content or long paragraphs here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              ></textarea>
              
              {/* Character Counter */}
              <div style={{ textAlign: 'right', fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
                {text.length} / 10000 characters
              </div>
            </div>

            <div className="controls">
              <div className="length-selector">
                <label htmlFor="length-select">Select Summary Length:</label>
                <select id="length-select" value={length} onChange={(e) => setLength(e.target.value)}>
                  <option value="short">Short (2 - 3 Concise Bullet Points)</option>
                  <option value="medium">Medium (4 - 5 Key Bullet Points)</option>
                  <option value="long">Detailed (Comprehensive Summary)</option>
                </select>
              </div>

              <button type="submit" className="btn-summarize" disabled={loading}>
                {loading ? <span>🔄 Summarizing...</span> : <span>🚀 Summarize Now</span>}
              </button>
            </div>
          </form>

          {/* Error Message with Aria-live for screen readers */}
          <div aria-live="polite">
            {error && <div className="error-card">⚠️ {error}</div>}
          </div>

          {summary && (
            <div className="summary-card">
              <div className="summary-header">
                <h3>📌 Generated Key Points</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  
                  {/* Yahan btn-clear class use ki hai */}
                  <button type="button" className="btn-clear" onClick={handleClear}>
                    Clear
                  </button>
                  
                  <button type="button" className="btn-copy" onClick={handleCopy}>
                    {copied ? '✅ Copied!' : '📋 Copy Summary'}
                  </button>
                </div>
              </div>
              <div className="summary-body">
                <pre>{summary}</pre>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;