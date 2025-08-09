import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const App = () => {
  const [windows, setWindows] = useState([]);
  const [mlmFiles, setMlmFiles] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const desktopRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragInfo, setDragInfo] = useState({ id: null, startX: 0, startY: 0, initialX: 0, initialY: 0 });

  useEffect(() => {
    // Start with a new file on app load
    handleNewFile();
  }, []);

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

  const openEditor = (file) => {
    const existingWindow = windows.find(win => win.type === 'editor' && win.fileId === file.id);
    if (existingWindow) {
      bringToFront(existingWindow.id);
      return;
    }

    const newWindow = {
      id: crypto.randomUUID(),
      type: 'editor',
      title: file.name,
      content: file.code,
      fileId: file.id,
      position: { x: 50 + windows.length * 20, y: 50 + windows.length * 20 },
    };
    setWindows(prevWindows => [...prevWindows, newWindow]);
    bringToFront(newWindow.id);
  };

  const handleNewFile = () => {
    const newFile = {
      id: crypto.randomUUID(),
      name: `പുതിയ ഫയൽ ${mlmFiles.length + 1}.mlm`,
      code: `പേര് = "ഹലോ ലോകം"\nപറയു പേര്\n`,
    };
    setMlmFiles(prevFiles => [...prevFiles, newFile]);
    openEditor(newFile);
  };

  const handleClose = (id) => {
    setWindows(prevWindows => prevWindows.filter(win => win.id !== id));
    setActiveWindowId(null);
  };

  const updateFileCode = (fileId, newCode) => {
    setMlmFiles(prevFiles => prevFiles.map(file =>
      file.id === fileId ? { ...file, code: newCode } : file
    ));
  };

  const openOutputWindow = (output) => {
    const newWindow = {
      id: crypto.randomUUID(),
      type: 'output',
      title: 'ഫലം',
      content: output,
      position: { x: 300 + windows.length * 20, y: 150 + windows.length * 20 },
    };
    setWindows(prevWindows => [...prevWindows, newWindow]);
    bringToFront(newWindow.id);
  };

  return (
    <div
      ref={desktopRef}
      className="relative w-screen h-screen bg-cover bg-center font-inter select-none overflow-hidden"
      style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=2670&auto=format&fit=crop")' }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Desktop Icons */}
      <div className="p-4 flex flex-col space-y-4">
        {mlmFiles.map(file => (
          <div
            key={file.id}
            onClick={() => openEditor(file)}
            className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-800/50 cursor-pointer w-24 text-white"
          >
            <div className="text-3xl">📝</div> {/* Simple emoji icon */}
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

      {/* Render windows */}
      {windows.map((win, index) => (
        <Window
          key={win.id}
          id={win.id}
          title={win.title}
          initialPosition={win.position}
          onClose={handleClose}
          onMouseDown={(e, x, y) => handleMouseDown(e, win.id, x, y)}
          onFocus={() => bringToFront(win.id)}
          isActive={activeWindowId === win.id}
          style={{ zIndex: index + 1 }}
        >
          {win.type === 'editor' && (
            <TextEditor
              initialCode={win.content}
              onRun={(code) => runCode(code, openOutputWindow)}
              onSave={(code) => updateFileCode(win.fileId, code)}
              onUpdateCode={(newCode) => updateFileCode(win.fileId, newCode)}
            />
          )}
          {win.type === 'output' && (
            <OutputWindow output={win.content} />
          )}
        </Window>
      ))}

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gray-900/80 backdrop-blur-md flex items-center justify-between px-4 text-white">
        <div className="flex items-center">
          <button className="px-3 py-1 rounded-md hover:bg-blue-600 transition-colors">
            🚀 സ്റ്റാർട്ട്
          </button>
        </div>
        <div>
          <span className="text-sm">{new Date().toLocaleTimeString('ml-IN', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  );
};

const Window = ({ id, title, children, initialPosition, onClose, onMouseDown, onFocus, isActive }) => {
  const [position, setPosition] = useState(initialPosition);
  const windowRef = useRef(null);

  return (
    <div
      ref={windowRef}
      onMouseDown={onFocus}
      className={`absolute w-[600px] h-[400px] flex flex-col bg-gray-800/90 backdrop-blur-lg rounded-lg shadow-2xl overflow-hidden transition-shadow duration-200 ${isActive ? 'shadow-blue-500/50 border border-blue-500' : 'border border-gray-700'}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        // z-index is managed by the parent App component
      }}
    >
      {/* Title bar */}
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

      {/* Content area */}
      <div className="flex-grow p-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

const TextEditor = ({ initialCode, onRun, onUpdateCode }) => {
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
          onUpdateCode(e.target.value);
        }}
        className="flex-grow w-full h-full bg-gray-900/90 text-white p-4 font-mono text-sm resize-none focus:outline-none rounded-b-lg"
      />
      <div className="bg-gray-900/80 p-2 rounded-b-lg flex justify-end gap-2">
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

const runCode = async (code, openOutputWindow) => {
  // Simple loading message
  openOutputWindow("കോഡ് റൺ ചെയ്യുന്നു...");

  try {
    const payload = { mlm_code: code };
    const apiUrl = `http://127.0.0.1:8000/run`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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

export default App;
