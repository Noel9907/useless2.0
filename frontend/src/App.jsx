// ===========================================
// src/App.jsx
// ===========================================

import React, { useState, useRef, useEffect } from 'react';

// Window, TextEditor, OutputWindow, and SettingsWindow are now defined within this file.
// In a real project, they would be in their own files and imported.
// For this single-file solution, they are defined here to avoid the "Multiple exports" error.

const Window = ({ id, title, children, position, onClose, onMouseDown, onFocus, isActive }) => {
  return (
    <div
      onMouseDown={onFocus}
      className={`absolute w-[600px] h-[400px] flex flex-col bg-gray-800/90 backdrop-blur-lg rounded-lg shadow-2xl overflow-hidden transition-shadow duration-200 ${isActive ? 'shadow-blue-500/50 border border-blue-500' : 'border border-gray-700'}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div
        className="flex items-center justify-between p-2 bg-gray-900/80 text-white rounded-t-lg cursor-move"
        onMouseDown={(e) => onMouseDown(e, position.x, position.y)}
      >
        <span className="truncate ml-2 text-sm">{title}</span>
        <button
          onClick={() => onClose(id)}
          className="bg-red-500 hover:bg-red-600 w-4 h-4 rounded-full flex items-center justify-center"
        >
          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <div className="flex-grow p-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

const TextEditor = ({ fileId, filename, initialCode, onRun, onSave }) => {
  const [code, setCode] = useState(initialCode);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  return (
    <div className="flex flex-col h-full">
      <textarea
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
        }}
        className="flex-grow w-full h-full bg-gray-900/90 text-white p-4 font-mono text-sm resize-none focus:outline-none rounded-b-lg"
      />
      <div className="bg-gray-900/80 p-2 rounded-b-lg flex justify-end gap-2">
        <button
          onClick={() => onSave(fileId, filename, code)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          💾 സേവ് ചെയ്യുക
        </button>
        <button
          onClick={() => onRun(code)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          ▶️ പ്രവർത്തിപ്പിക്കുക
        </button>
      </div>
    </div>
  );
};

const OutputWindow = ({ output }) => {
  return (
    <div className="h-full bg-gray-900/90 p-4 rounded-b-lg overflow-auto">
      <pre className="text-white font-mono whitespace-pre-wrap text-sm">
        {output}
      </pre>
    </div>
  );
};

const SettingsWindow = () => {
  return (
    <div className="p-4 text-white">
      <h2 className="text-xl font-bold mb-4">ക്രമീകരണങ്ങൾ</h2>
      <p>ഇതൊരു ഡെമോ ക്രമീകരണ വിൻഡോ ആണ്. ഇവിടെ നിങ്ങൾക്ക് നിങ്ങളുടെ ഓപ്പറേറ്റിംഗ് സിസ്റ്റത്തിന്റെ ക്രമീകരണങ്ങൾ മാറ്റാൻ കഴിയും.</p>
    </div>
  );
};


const App = () => {
  const [windows, setWindows] = useState([]);
  const [mlmFiles, setMlmFiles] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const desktopRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragInfo, setDragInfo] = useState({ id: null, startX: 0, startY: 0, initialX: 0, initialY: 0 });
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  const windowsRef = useRef(windows);
  useEffect(() => {
    windowsRef.current = windows;
  }, [windows]);

  useEffect(() => {
    const newSessionId = crypto.randomUUID();
    setSessionId(newSessionId);
    
    // Fetch files for the new session on initial load
    fetchFiles(newSessionId);
  }, []);

  const fetchFiles = async (currentSessionId) => {
    try {
      const response = await fetch(`http://localhost:8000/files?session_id=${currentSessionId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch files from backend');
      }
      const files = await response.json();
      setMlmFiles(files.map(file => ({
        id: file.id,
        name: file.filename,
        code: '',
      })));
    } catch (error) {
      console.error('Error fetching files:', error);
      openOutputWindow(`Error: ${error.message}\n` + 'ബാക്കെൻഡിൽ നിന്ന് ഫയലുകൾ ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല.');
    }
  };

  const handleMouseDown = (e, id, initialX, initialY) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragInfo({
      id,
      startX: e.clientX,
      startY: e.clientY,
      initialX,
      initialY,
    });
    bringToFront(id);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const { id, startX, startY, initialX, initialY } = dragInfo;
    const newX = initialX + (e.clientX - startX);
    const newY = initialY + (e.clientY - startY);
    setWindows(prevWindows => prevWindows.map(win =>
      win.id === id ? { ...win, position: { x: newX, y: newY } } : win
    ));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragInfo({ id: null, startX: 0, startY: 0, initialX: 0, initialY: 0 });
  };

  const bringToFront = (id) => {
    setActiveWindowId(id);
    setWindows(prevWindows => {
      const windowToMove = prevWindows.find(win => win.id === id);
      if (!windowToMove) return prevWindows;
      const otherWindows = prevWindows.filter(win => win.id !== id);
      return [...otherWindows, windowToMove];
    });
  };

  const openEditor = async (file) => {
    const existingWindow = windowsRef.current.find(win => win.type === 'editor' && win.fileId === file.id);
    if (existingWindow) {
      bringToFront(existingWindow.id);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/files/${file.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch file content');
      }
      const fileData = await response.json();
      
      const newWindow = {
        id: crypto.randomUUID(),
        type: 'editor',
        title: fileData.filename,
        content: fileData.content,
        fileId: file.id,
        position: { x: 50 + windowsRef.current.length * 20, y: 50 + windowsRef.current.length * 20 },
      };
      setWindows(prevWindows => [...prevWindows, newWindow]);
      bringToFront(newWindow.id);

    } catch (error) {
      console.error('Error opening file:', error);
      openOutputWindow(`Error: ${error.message}\n` + 'ഫയൽ തുറക്കാൻ കഴിഞ്ഞില്ല.');
    }
  };

  const handleNewFile = () => {
    setShowNewFileModal(true);
  };

  const handleSaveNewFile = async () => {
    if (!sessionId) {
      openOutputWindow('Error: Session ID not available. Try reloading the page.');
      return;
    }
    
    if (!newFileName) {
      openOutputWindow('Error: File name cannot be empty.');
      return;
    }

    const defaultContent = `പേര് = "ഹലോ ലോകം"\nപറയു പേര്\n`;

    try {
      const payload = {
        filename: newFileName,
        content: defaultContent,
        session_id: sessionId,
      };

      const response = await fetch(`http://localhost:8000/files/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      if (!result.id) {
        throw new Error('API response is missing the file ID.');
      }
      const newFileId = result.id;
      const newFile = {
        id: newFileId,
        name: newFileName,
        code: defaultContent,
      };

      setMlmFiles(prevFiles => [...prevFiles, newFile]);
      openEditor(newFile);
      setNewFileName('');
      setShowNewFileModal(false);

    } catch (error) {
      console.error('Failed to create new file:', error);
      openOutputWindow(`Error: ${error.message}\n` + 'പുതിയ ഫയൽ ഉണ്ടാക്കാൻ കഴിഞ്ഞില്ല.');
    }
  };

  const handleClose = (id) => {
    setWindows(prevWindows => prevWindows.filter(win => win.id !== id));
    setActiveWindowId(null);
  };

  const saveFile = async (fileId, filename, newCode) => {
    try {
      const payload = {
        filename: filename,
        content: newCode,
      };
      
      const response = await fetch(`http://localhost:8000/files/${fileId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      openOutputWindow("ഫയൽ വിജയകരമായി സേവ് ചെയ്തു.");
    } catch (error) {
      console.error('Failed to save file:', error);
      openOutputWindow(`Error: ${error.message}\n` + 'ഫയൽ സേവ് ചെയ്യാൻ കഴിഞ്ഞില്ല.');
    }
  };

  const openOutputWindow = (output) => {
    const newWindow = {
      id: crypto.randomUUID(),
      type: 'output',
      title: 'ഫലം',
      content: output,
      position: { x: 300 + windowsRef.current.length * 20, y: 150 + windowsRef.current.length * 20 },
    };
    setWindows(prevWindows => [...prevWindows, newWindow]);
    bringToFront(newWindow.id);
  };

  const openSettingsWindow = () => {
    const existingWindow = windowsRef.current.find(win => win.type === 'settings');
    if (existingWindow) {
      bringToFront(existingWindow.id);
      return;
    }
    const newWindow = {
      id: crypto.randomUUID(),
      type: 'settings',
      title: 'ക്രമീകരണങ്ങൾ',
      content: '',
      position: { x: 150 + windowsRef.current.length * 20, y: 100 + windowsRef.current.length * 20 },
    };
    setWindows(prevWindows => [...prevWindows, newWindow]);
    bringToFront(newWindow.id);
  };

  const runCode = async (code, openOutputWindow) => {
    try {
      const payload = { mlm_code: code };
      const apiUrl = `http://127.0.0.1:8000/run`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      openOutputWindow(result.output);
    } catch (error) {
      console.error('Failed to run code:', error);
      openOutputWindow(`Error: ${error.message}\n` + 'നിങ്ങളുടെ ബാക്കെൻഡ് പ്രവർത്തിക്കുന്നുണ്ടോയെന്ന് ഉറപ്പാക്കുക.');
    }
  };


  return (
    <div
      ref={desktopRef}
      className="relative w-screen h-screen bg-cover bg-center font-inter select-none overflow-hidden"
      style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=2670&auto=format&fit=crop")' }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="p-4 flex flex-wrap-reverse gap-4">
        {mlmFiles.map(file => (
          <div
            key={file.id}
            onClick={() => openEditor(file)}
            className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-800/50 cursor-pointer w-24 text-white"
          >
            <div className="text-3xl">📝</div>
            <span className="text-sm text-center mt-1 truncate">{file.name}</span>
          </div>
        ))}
        <div
            onClick={handleNewFile}
            className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-800/50 cursor-pointer w-24 text-white"
        >
            <div className="text-3xl">➕</div>
            <span className="text-sm text-center mt-1">പുതിയ ഫയൽ</span>
        </div>
      </div>
      {windows.map((win, index) => (
        <Window
          key={win.id}
          id={win.id}
          title={win.title}
          position={win.position}
          onClose={handleClose}
          onMouseDown={(e, x, y) => handleMouseDown(e, win.id, x, y)}
          onFocus={() => bringToFront(win.id)}
          isActive={activeWindowId === win.id}
          style={{ zIndex: index + 1 }}
        >
          {win.type === 'editor' && (
            <TextEditor
              fileId={win.fileId}
              filename={win.title}
              initialCode={win.content}
              onRun={(code) => runCode(code, openOutputWindow)}
              onSave={(fileId, filename, code) => saveFile(fileId, filename, code)}
            />
          )}
          {win.type === 'output' && (
            <OutputWindow output={win.content} />
          )}
          {win.type === 'settings' && (
            <SettingsWindow />
          )}
        </Window>
      ))}
      {showNewFileModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-80 text-white">
            <h3 className="text-lg font-bold mb-4">പുതിയ ഫയൽ</h3>
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="ഫയലിന്റെ പേര്"
              className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowNewFileModal(false)}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition-colors"
              >
                റദ്ദാക്കുക
              </button>
              <button
                onClick={handleSaveNewFile}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                സേവ് ചെയ്യുക
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gray-900/80 backdrop-blur-md flex items-center justify-between px-4 text-white">
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 rounded-md hover:bg-blue-600 transition-colors">
            🚀 സ്റ്റാർട്ട്
          </button>
          <button
            onClick={openSettingsWindow}
            className="px-3 py-1 rounded-md hover:bg-gray-700 transition-colors"
          >
            ⚙️ ക്രമീകരണങ്ങൾ
          </button>
        </div>
        <div>
          <span className="text-sm">{new Date().toLocaleTimeString('ml-IN', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  );
};

export default App;
