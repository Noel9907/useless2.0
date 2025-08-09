"use client";

import { useState, useRef, useEffect } from "react";

// Terminal Component
const Terminal = ({ output, isVisible, onToggle }) => {
  const terminalRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current && isVisible) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-10 left-0 right-0 h-48 bg-gray-900/95 backdrop-blur-lg border-t border-gray-700 text-white z-40">
      <div className="flex items-center justify-between p-2 bg-gray-800/90 border-b border-gray-600">
        <span className="text-sm font-mono">🖥️ കമാൻഡ് ജനാല</span>
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
      <div
        ref={terminalRef}
        className="h-full p-4 overflow-auto font-mono text-sm bg-black/50"
      >
        <pre className="whitespace-pre-wrap text-green-400">
          {output ||
            "ടെർമിനൽ തയ്യാറാണ്. കോഡ് പ്രവർത്തിപ്പിക്കാൻ ▶️ ബട്ടൺ അമർത്തുക..."}
        </pre>
      </div>
    </div>
  );
};

const Window = ({
  id,
  title,
  children,
  position,
  onClose,
  onMouseDown,
  onFocus,
  isActive,
}) => {
  return (
    <div
      onMouseDown={onFocus}
      className={`absolute w-[900px] h-[600px] flex flex-col bg-gray-800/90 backdrop-blur-lg rounded-lg shadow-2xl overflow-hidden transition-shadow duration-200 ${
        isActive
          ? "shadow-blue-500/50 border border-blue-500"
          : "border border-gray-700"
      }`}
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
          <svg
            className="w-2 h-2 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div className="flex-grow p-1 overflow-auto">{children}</div>
    </div>
  );
};

const TextEditor = ({ fileId, filename, initialCode, onRun, onSave }) => {
  const [code, setCode] = useState(initialCode || "");

  useEffect(() => {
    setCode(initialCode || "");
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
      <p>
        ഇതൊരു ഡെമോ ക്രമീകരണ വിൻഡോ ആണ്. ഇവിടെ നിങ്ങൾക്ക് നിങ്ങളുടെ ഓപ്പറേറ്റിംഗ്
        സിസ്റ്റത്തിന്റെ ക്രമീകരണങ്ങൾ മാറ്റാൻ കഴിയും.
      </p>
    </div>
  );
};

// New Learning Window Component
const LearningWindow = () => {
  const [activeTab, setActiveTab] = useState("basics");

  const syntaxExamples = {
    basics: {
      title: "അടിസ്ഥാന വാക്യഘടന",
      content: `
# മലയാളം പ്രോഗ്രാമിംഗ് ഭാഷ - അടിസ്ഥാനങ്ങൾ

## വേരിയബിൾ അസൈൻമെന്റ് (Variable Assignment)
പേര് = "രാമൻ"
വയസ്സ് = "25"
സ്ഥലം = "കേരളം"
സന്ദേശം = "ഹലോ വേൾഡ്!"

## ഔട്ട്പുട്ട് പ്രിന്റിംഗ് (Output Printing)
പറയു "ഹലോ മലയാളം!"
പറയു പേര്
പറയു സന്ദേശം

## വേരിയബിൾ ഇന്റർപോളേഷൻ (Variable Interpolation)
പേര് = "സീത"
പറയു "എന്റെ പേര് {പേര്} ആണ്"
പറയു "ഞാൻ {സ്ഥലം} ൽ നിന്നാണ്"

## ചായ ബ്രേക്ക് (Tea Break)
ചായകട
പറയു "ചായ കുടിച്ചു കഴിഞ്ഞു!"

## ലളിതമായ പ്രോഗ്രാം
പേര് = "കൃഷ്ണൻ"
പറയു "നമസ്കാരം!"
പറയു "എന്റെ പേര് {പേര്} ആണ്"
ചായകട
പറയു "നന്ദി!"
    `,
    },
    datatypes: {
      title: "ഡാറ്റാ ടൈപ്പുകൾ",
      content: `
# ഡാറ്റാ ടൈപ്പുകൾ (Data Types)

## സ്ട്രിംഗുകൾ (Strings)
# എല്ലാ വാല്യൂകളും സ്ട്രിംഗ് ആയി സ്റ്റോർ ചെയ്യപ്പെടുന്നു
പേര് = "മലയാളം"
വാചകം = "ഇത് ഒരു വാചകമാണ്"
സംഖ്യ = "42"
ദശാംശം = "3.14"

## സ്ട്രിംഗ് ഉദാഹരണങ്ങൾ
പുസ്തകം = "രാമായണം"
രചയിതാവ് = "വാൽമീകി"
പറയു "പുസ്തകം: {പുസ്തകം}"
പറയു "രചയിതാവ്: {രചയിതാവ്}"

## നമ്പറുകൾ (സ്ട്രിംഗ് ആയി)
എണ്ണം = "10"
വില = "500"
പറയു "എണ്ണം: {എണ്ണം}"
പറയു "വില: {വില} രൂപ"

## ബൂളിയൻ വാല്യൂകൾ (സ്ട്രിംഗ് ആയി)
സത്യം = "ശരി"
അസത്യം = "തെറ്റ്"
പറയു "ഇത് {സത്യം} ആണ്"
പറയു "അത് {അസത്യം} ആണ്"

## മിശ്രിത ഉദാഹരണം
പേര് = "രാധ"
പ്രായം = "28"
ജോലി = "ടീച്ചർ"
പറയു "പേര്: {പേര്}"
പറയു "പ്രായം: {പ്രായം} വയസ്സ്"
പറയു "ജോലി: {ജോലി}"
    `,
    },
    operators: {
      title: "ലൂപ്പുകളും നിയന്ത്രണവും",
      content: `
# ലൂപ്പുകളും നിയന്ത്രണ ഘടനകളും

## ലളിതമായ ലൂപ്പ് (Simple Loop)
വരിക്കു 3
പറയു "ഹലോ!"
അവസാനം

## വേരിയബിൾ ഉപയോഗിച്ച് ലൂപ്പ്
സന്ദേശം = "നമസ്കാരം"
വരിക്കു 5
പറയു സന്ദേശം
അവസാനം

## എണ്ണൽ ലൂപ്പ്
വരിക്കു 10
പറയു "എണ്ണം"
അവസാനം

## ലൂപ്പിൽ വ്യത്യസ്ത സന്ദേശങ്ങൾ
വരിക്കു 3
പറയു "ആദ്യം"
പറയു "രണ്ടാമത്"
പറയു "മൂന്നാമത്"
അവസാനം

## ലൂപ്പിനുള്ളിൽ വേരിയബിൾ ഇന്റർപോളേഷൻ
പേര് = "അജയൻ"
വരിക്കു 4
പറയു "ഹലോ {പേര്}!"
ചായകട
അവസാനം

## നെസ്റ്റഡ് ലൂപ്പ് (ഒന്നിനുള്ളിൽ മറ്റൊന്ന്)
വരിക്കു 2
പറയു "പുറത്തെ ലൂപ്പ്"
വരിക്കു 3
പറയു "അകത്തെ ലൂപ്പ്"
അവസാനം
അവസാനം

## ലൂപ്പിനൊപ്പം ചായ ബ്രേക്ക്
വരിക്കു 5
പറയു "പ്രവർത്തിക്കുന്നു..."
ചായകട
പറയു "തുടരുന്നു..."
അവസാനം
    `,
    },
    control: {
      title: "വിപുലമായ ലൂപ്പ് ഉദാഹരണങ്ങൾ",
      content: `
# വിപുലമായ ലൂപ്പ് പാറ്റേണുകൾ

## കൗണ്ടിംഗ് പാറ്റേൺ
എണ്ണം = "1"
വരിക്കു 5
പറയു "എണ്ണം: {എണ്ണം}"
അവസാനം

## ടൈം ടേബിൾ പാറ്റേൺ
സംഖ്യ = "5"
വരിക്കു 10
പറയു "{സംഖ്യ} ന്റെ ഗുണിതം"
അവസാനം

## ആവർത്തന പാറ്റേൺ
വാക്ക് = "മലയാളം"
വരിക്കു 7
പറയു വാക്ക്
പറയു "സുന്ദരമായ ഭാഷ"
അവസാനം

## പ്രോഗ്രസ് ഇൻഡിക്കേറ്റർ
വരിക്കു 8
പറയു "ലോഡിംഗ്..."
ചായകട
പറയു "പൂർത്തിയായി!"
അവസാനം

## മൾട്ടിപ്പിൾ വേരിയബിൾ ലൂപ്പ്
പേര് = "രമേശ്"
സ്ഥലം = "തിരുവനന്തപുരം"
വരിക്കു 3
പറയു "പേര്: {പേര്}"
പറയു "സ്ഥലം: {സ്ഥലം}"
പറയു "---"
അവസാനം

## ലൂപ്പ് വിത്ത് ബ്രേക്കുകൾ
വരിക്കു 6
പറയു "ആരംഭം"
ചായകട
പറയു "മധ്യം"
ചായകട
പറയു "അവസാനം"
അവസാനം
    `,
    },
    functions: {
      title: "പ്രായോഗിക പാറ്റേണുകൾ",
      content: `
# പ്രായോഗിക പ്രോഗ്രാമിംഗ് പാറ്റേണുകൾ

## ഗ്രീറ്റിംഗ് പാറ്റേൺ
പേര് = "സുരേഷ്"
സമയം = "രാവിലെ"
പറയു "{സമയം} {പേര്} ചേട്ടാ!"
പറയു "എങ്ങനെയുണ്ട്?"

## ഇൻഫർമേഷൻ ഡിസ്പ്ലേ
പേര് = "പ്രിയ"
പ്രായം = "25"
ജോലി = "ഡോക്ടർ"
സ്ഥലം = "കൊച്ചി"

പറയു "=== വ്യക്തിഗത വിവരങ്ങൾ ==="
പറയു "പേര്: {പേര്}"
പറയു "പ്രായം: {പ്രായം}"
പറയു "ജോലി: {ജോലി}"
പറയു "സ്ഥലം: {സ്ഥലം}"
പറയു "========================"

## മെനു സിസ്റ്റം
പറയു "=== മലയാളം റെസ്റ്റോറന്റ് ==="
പറയു "1. സാധാരണ മീൽസ് - 50 രൂപ"
പറയു "2. സ്പെഷ്യൽ മീൽസ് - 80 രൂപ"
പറയു "3. ബിരിയാണി - 120 രൂപ"
പറയു "========================"

## കൗണ്ട്ഡൗൺ പാറ്റേൺ
പറയു "കൗണ്ട്ഡൗൺ ആരംഭിക്കുന്നു..."
വരിക്കു 5
പറയു "കാത്തിരിക്കുക..."
ചായകട
അവസാനം
പറയു "പൂർത്തിയായി!"

## ലിസ്റ്റ് ജനറേഷൻ
പറയു "=== ഫലങ്ങൾ ==="
വരിക്കു 5
പറയു "• ഇനം"
അവസാനം
പറയു "=== അവസാനം ==="
    `,
    },
    advanced: {
      title: "സങ്കീർണ്ണമായ പ്രോഗ്രാമുകൾ",
      content: `
# സങ്കീർണ്ണമായ പ്രോഗ്രാം ഉദാഹരണങ്ങൾ

## സ്റ്റുഡന്റ് റിപ്പോർട്ട് കാർഡ്
വിദ്യാർത്ഥി = "അനിൽ കുമാർ"
ക്ലാസ് = "10-A"
സ്കൂൾ = "സർക്കാർ ഹൈസ്കൂൾ"

പറയു "================================"
പറയു "       റിപ്പോർട്ട് കാർഡ്"
പറയു "================================"
പറയു "വിദ്യാർത്ഥി: {വിദ്യാർത്ഥി}"
പറയു "ക്ലാസ്: {ക്ലാസ്}"
പറയു "സ്കൂൾ: {സ്കൂൾ}"
പറയു "--------------------------------"

വിഷയങ്ങൾ = "മലയാളം"
വരിക്കു 5
പറയു "വിഷയം: {വിഷയങ്ങൾ} - A ഗ്രേഡ്"
അവസാനം

പറയു "--------------------------------"
പറയു "മൊത്തം ഫലം: വിജയം"
പറയു "================================"

## ഷോപ്പിംഗ് ബിൽ
കടയുടെപേര് = "കേരള സ്റ്റോർ"
ഉപഭോക്താവ് = "രാജേഷ്"

പറയു "================================"
പറയു "         {കടയുടെപേര്}"
പറയു "================================"
പറയു "ഉപഭോക്താവ്: {ഉപഭോക്താവ്}"
പറയു "--------------------------------"

വരിക്കു 4
പറയു "സാധനം - 100 രൂപ"
അവസാനം

പറയു "--------------------------------"
പറയു "മൊത്തം: 400 രൂപ"
പറയു "നന്ദി!"
പറയു "================================"

## ടൈം ടേബിൾ ജനറേറ്റർ
ക്ലാസ് = "8-B"
പറയു "=== {ക്ലാസ്} ടൈം ടേബിൾ ==="

വരിക്കു 6
പറയു "പീരിയഡ് - വിഷയം"
ചായകട
അവസാനം

പറയു "=== അവസാനം ==="

## ഇവന്റ് ഇൻവിറ്റേഷൻ
ഇവന്റ് = "ഓണാഘോഷം"
തീയതി = "സെപ്റ്റംബർ 15"
സ്ഥലം = "കമ്മ്യൂണിറ്റി ഹാൾ"
സമയം = "രാവിലെ 10 മണി"

പറയു "🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉"
പറയു "        ക്ഷണപത്രിക"
പറയു "🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉"
പറയു ""
പറയു "പ്രിയ സുഹൃത്തുക്കളേ,"
പറയു ""
പറയു "നിങ്ങളെ {ഇവന്റ്} ലേക്ക്"
പറയു "ക്ഷണിക്കുന്നു"
പറയു ""
പറയു "തീയതി: {തീയതി}"
പറയു "സമയം: {സമയം}"
പറയു "സ്ഥലം: {സ്ഥലം}"
പറയു ""
പറയു "നിങ്ങളുടെ സാന്നിധ്യം"
പറയു "അത്യാവശ്യമാണ്"
പറയു ""
പറയു "🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉"
    `,
    },
    examples: {
      title: "പൂർണ്ണമായ പ്രോഗ്രാമുകൾ",
      content: `
# പൂർണ്ണമായ പ്രോഗ്രാം ഉദാഹരണങ്ങൾ

## 1. ലളിതമായ കാൽക്കുലേറ്റർ
പറയു "=== മലയാളം കാൽക്കുലേറ്റർ ==="
സംഖ്യ1 = "10"
സംഖ്യ2 = "5"
പറയു "ആദ്യ സംഖ്യ: {സംഖ്യ1}"
പറയു "രണ്ടാം സംഖ്യ: {സംഖ്യ2}"
പറയു "കൂട്ടൽ: 15"
പറയു "കുറവ്: 5"
പറയു "ഗുണനം: 50"
പറയു "ഹരണം: 2"

## 2. സ്റ്റുഡന്റ് അറ്റൻഡൻസ് സിസ്റ്റം
പറയു "=== ഹാജർ പട്ടിക ==="
ക്ലാസ് = "9-A"
തീയതി = "2024-01-15"

പറയു "ക്ലാസ്: {ക്ലാസ്}"
പറയു "തീയതി: {തീയതി}"
പറയു "-------------------"

വരിക്കു 5
പറയു "വിദ്യാർത്ഥി - ഹാജർ"
അവസാനം

പറയു "-------------------"
പറയു "മൊത്തം: 5 പേർ ഹാജർ"

## 3. ലൈബ്രറി ബുക്ക് സിസ്റ്റം
പറയു "=== ലൈബ്രറി മാനേജ്മെന്റ് ==="
ലൈബ്രറി = "സിറ്റി ലൈബ്രറി"
പറയു "സ്വാഗതം {ലൈബ്രറി} ലേക്ക്"
പറയു ""

പറയു "ലഭ്യമായ പുസ്തകങ്ങൾ:"
വരിക്കു 4
പറയു "📚 പുസ്തകം - ലഭ്യം"
അവസാനം

പറയു ""
പറയു "പുസ്തകം കടം വാങ്ങാൻ"
പറയു "കൗണ്ടറിൽ വരിക"

## 4. റെസ്റ്റോറന്റ് ഓർഡർ സിസ്റ്റം
റെസ്റ്റോറന്റ് = "കേരള കിച്ചൻ"
ഉപഭോക്താവ് = "മോഹൻ"

പറയു "🍽️ സ്വാഗതം {റെസ്റ്റോറന്റ്} ലേക്ക് 🍽️"
പറയു "ഉപഭോക്താവ്: {ഉപഭോക്താവ്}"
പറയു ""

പറയു "ഇന്നത്തെ സ്പെഷ്യൽ മെനു:"
വരിക്കു 6
പറയു "🍛 വിഭവം - വില"
ചായകട
അവസാനം

പറയു ""
പറയു "ഓർഡർ ചെയ്യാൻ വെയിറ്ററെ വിളിക്കുക"
പറയു "നന്ദി! 🙏"

## 5. ഹോട്ടൽ റൂം ബുക്കിംഗ്
ഹോട്ടൽ = "കേരള പാലസ്"
അതിഥി = "സുനിൽ"
റൂം = "101"

പറയു "🏨 {ഹോട്ടൽ} ൽ സ്വാഗതം 🏨"
പറയു ""
പറയു "അതിഥി: {അതിഥി}"
പറയു "റൂം നമ്പർ: {റൂം}"
പറയു ""

പറയു "റൂം സൗകര്യങ്ങൾ:"
വരിക്കു 5
പറയു "✅ സൗകര്യം ലഭ്യം"
അവസാനം

പറയു ""
പറയു "സുഖകരമായ താമസം ആശംസിക്കുന്നു!"
ചായകട
പറയു "ഏതെങ്കിലും സഹായം വേണമെങ്കിൽ"
പറയു "റിസപ്ഷനിൽ വിളിക്കുക"

## 6. ഫിറ്റ്നസ് ട്രാക്കർ
ഉപയോക്താവ് = "രാജു"
ദിവസം = "തിങ്കൾ"

പറയു "💪 ഫിറ്റ്നസ് ട്രാക്കർ 💪"
പറയു "ഉപയോക്താവ്: {ഉപയോക്താവ്}"
പറയു "ദിവസം: {ദിവസം}"
പറയു ""

പറയു "ഇന്നത്തെ വ്യായാമങ്ങൾ:"
വരിക്കു 4
പറയു "🏃 വ്യായാമം - 30 മിനിറ്റ്"
ചായകട
അവസാനം

പറയു ""
പറയു "നല്ല ആരോഗ്യം ആശംസിക്കുന്നു! 🌟"
    `,
    },
  };

  const tabs = [
    { id: "basics", label: "അടിസ്ഥാനങ്ങൾ", icon: "📚" },
    { id: "datatypes", label: "ഡാറ്റാ ടൈപ്പുകൾ", icon: "🔢" },
    { id: "operators", label: "ഓപ്പറേറ്ററുകൾ", icon: "⚡" },
    { id: "control", label: "നിയന്ത്രണം", icon: "🔄" },
    { id: "functions", label: "ഫംഗ്ഷനുകൾ", icon: "⚙️" },
    { id: "advanced", label: "വിപുലമായത്", icon: "🚀" },
    { id: "examples", label: "ഉദാഹരണങ്ങൾ", icon: "💡" },
  ];

  return (
    <div className="h-full bg-gray-900/90 text-white flex flex-col">
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto bg-gray-800/90 border-b border-gray-600">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:text-white hover:bg-gray-700"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-blue-400">
            {syntaxExamples[activeTab].title}
          </h2>
          <div className="bg-gray-800/50 rounded-lg p-4 font-mono text-sm">
            <pre className="whitespace-pre-wrap text-green-300 leading-relaxed">
              {syntaxExamples[activeTab].content}
            </pre>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800/90 p-2 text-center text-xs text-gray-400 border-t border-gray-600">
        മലയാളം പ്രോഗ്രാമിംഗ് ഭാഷ - പഠന സഹായി | Malayalam Programming Language
        Learning Guide
      </div>
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
  const [dragInfo, setDragInfo] = useState({
    id: null,
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
  });
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameFileName, setRenameFileName] = useState("");
  const [renameFileId, setRenameFileId] = useState(null);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    fileId: null,
    type: null,
  });
  // Terminal state
  const [terminalOutput, setTerminalOutput] = useState("");
  const [isTerminalVisible, setIsTerminalVisible] = useState(false);

  const windowsRef = useRef(windows);
  useEffect(() => {
    windowsRef.current = windows;
  }, [windows]);

  useEffect(() => {
    const newSessionId = crypto.randomUUID();
    setSessionId(newSessionId);
    fetchFiles(newSessionId);
  }, []);

  const fetchFiles = async (currentSessionId) => {
    try {
      const response = await fetch(`https://useless2-0.onrender.com/files?`);
      if (!response.ok) {
        throw new Error("Failed to fetch files from backend");
      }
      const files = await response.json();
      setMlmFiles(
        files.map((file) => ({
          id: file.id,
          name: file.filename,
          code: "",
        }))
      );
    } catch (error) {
      console.error("Error fetching files:", error);
      showInTerminal(
        `Error: ${error.message}\n` +
          "ബാക്കെൻഡിൽ നിന്ന് ഫയലുകൾ ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല."
      );
    }
  };

  const showInTerminal = (output) => {
    setTerminalOutput(output);
    setIsTerminalVisible(true);
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
    setWindows((prevWindows) =>
      prevWindows.map((win) =>
        win.id === id ? { ...win, position: { x: newX, y: newY } } : win
      )
    );
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragInfo({ id: null, startX: 0, startY: 0, initialX: 0, initialY: 0 });
  };

  const bringToFront = (id) => {
    setActiveWindowId(id);
    setWindows((prevWindows) => {
      const windowToMove = prevWindows.find((win) => win.id === id);
      if (!windowToMove) return prevWindows;
      const otherWindows = prevWindows.filter((win) => win.id !== id);
      return [...otherWindows, windowToMove];
    });
  };

  const openEditor = async (file) => {
    const existingWindow = windowsRef.current.find(
      (win) => win.type === "editor" && win.fileId === file.id
    );
    if (existingWindow) {
      bringToFront(existingWindow.id);
      return;
    }

    try {
      const response = await fetch(
        `https://useless2-0.onrender.com/files/${file.id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch file content");
      }
      const fileData = await response.json();

      const newWindow = {
        id: crypto.randomUUID(),
        type: "editor",
        title: fileData.filename,
        content: fileData.content,
        fileId: file.id,
        position: {
          x: 50 + windowsRef.current.length * 20,
          y: 50 + windowsRef.current.length * 20,
        },
      };

      setWindows((prevWindows) => [...prevWindows, newWindow]);
      bringToFront(newWindow.id);
    } catch (error) {
      console.error("Error opening file:", error);
      showInTerminal(`Error: ${error.message}\n` + "ഫയൽ തുറക്കാൻ കഴിഞ്ഞില്ല.");
    }
  };

  const handleNewFile = () => {
    setShowNewFileModal(true);
  };

  const handleSaveNewFile = async () => {
    if (!sessionId) {
      showInTerminal(
        "Error: Session ID not available. Try reloading the page."
      );
      return;
    }
    if (!newFileName) {
      showInTerminal("Error: File name cannot be empty.");
      return;
    }

    const defaultContent = `പേര് = "ഹലോ ലോകം"\nപറയു പേര്\n`;

    try {
      const payload = {
        filename: newFileName,
        content: defaultContent,
        session_id: sessionId,
      };

      const response = await fetch(
        `https://useless2-0.onrender.com/files/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      if (!result.id) {
        throw new Error("API response is missing the file ID.");
      }

      const newFileId = result.id;
      const newFile = {
        id: newFileId,
        name: newFileName,
        code: defaultContent,
      };

      setMlmFiles((prevFiles) => [...prevFiles, newFile]);
      openEditor(newFile);
      setNewFileName("");
      setShowNewFileModal(false);
    } catch (error) {
      console.error("Failed to create new file:", error);
      showInTerminal(
        `Error: ${error.message}\n` + "പുതിയ ഫയൽ ഉണ്ടാക്കാൻ കഴിഞ്ഞില്ല."
      );
    }
  };

  const handleClose = (id) => {
    setWindows((prevWindows) => prevWindows.filter((win) => win.id !== id));
    setActiveWindowId(null);
  };

  const saveFile = async (fileId, filename, newCode) => {
    try {
      const payload = {
        filename: filename,
        content: newCode,
      };

      const response = await fetch(
        `https://useless2-0.onrender.com/files/${fileId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      showInTerminal("ഫയൽ വിജയകരമായി സേവ് ചെയ്തു.");
    } catch (error) {
      console.error("Failed to save file:", error);
      showInTerminal(
        `Error: ${error.message}\n` + "ഫയൽ സേവ് ചെയ്യാൻ കഴിഞ്ഞില്ല."
      );
    }
  };

  const deleteFile = async (fileId) => {
    try {
      const response = await fetch(
        `https://useless2-0.onrender.com/files/${fileId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setMlmFiles((prevFiles) =>
        prevFiles.filter((file) => file.id !== fileId)
      );
      showInTerminal("ഫയൽ വിജയകരമായി ഡിലീറ്റ് ചെയ്തു.");

      setWindows((prevWindows) =>
        prevWindows.filter((win) => win.fileId !== fileId)
      );
    } catch (error) {
      console.error("Failed to delete file:", error);
      showInTerminal(
        `Error: ${error.message}\n` + "ഫയൽ ഡിലീറ്റ് ചെയ്യാൻ കഴിഞ്ഞില്ല."
      );
    }
  };

  const renameFile = async (fileId, newFilename) => {
    try {
      const payload = {
        filename: newFilename,
      };

      const response = await fetch(
        `https://useless2-0.onrender.com/files/${fileId}/rename`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setMlmFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.id === fileId ? { ...file, name: newFilename } : file
        )
      );

      setWindows((prevWindows) =>
        prevWindows.map((win) =>
          win.fileId === fileId ? { ...win, title: newFilename } : win
        )
      );

      showInTerminal("ഫയലിന്റെ പേര് വിജയക��മായി മാറ്റി.");
    } catch (error) {
      console.error("Failed to rename file:", error);
      showInTerminal(
        `Error: ${error.message}\n` + "ഫയലിന്റെ പേര് മാറ്റാൻ കഴിഞ്ഞില്ല."
      );
    }
  };

  const handleRenameFile = () => {
    if (!renameFileName) {
      showInTerminal("Error: File name cannot be empty.");
      return;
    }
    renameFile(renameFileId, renameFileName);
    setShowRenameModal(false);
    setRenameFileName("");
    setRenameFileId(null);
  };

  const refreshDesktop = () => {
    if (sessionId) {
      fetchFiles(sessionId);
      showInTerminal("ഡെസ്ക്ടോപ്പ് പുതുക്കി.");
    }
  };

  const openSettingsWindow = () => {
    const existingWindow = windowsRef.current.find(
      (win) => win.type === "settings"
    );
    if (existingWindow) {
      bringToFront(existingWindow.id);
      return;
    }

    const newWindow = {
      id: crypto.randomUUID(),
      type: "settings",
      title: "ക്രമീകരണങ്ങൾ",
      content: "",
      position: {
        x: 150 + windowsRef.current.length * 20,
        y: 100 + windowsRef.current.length * 20,
      },
    };

    setWindows((prevWindows) => [...prevWindows, newWindow]);
    bringToFront(newWindow.id);
  };

  // New function to open learning window
  const openLearningWindow = () => {
    const existingWindow = windowsRef.current.find(
      (win) => win.type === "learning"
    );
    if (existingWindow) {
      bringToFront(existingWindow.id);
      return;
    }

    const newWindow = {
      id: crypto.randomUUID(),
      type: "learning",
      title: "📚 മലയാളം പ്രോഗ്രാമിംഗ് പഠനം",
      content: "",
      position: {
        x: 100 + windowsRef.current.length * 20,
        y: 80 + windowsRef.current.length * 20,
      },
    };

    setWindows((prevWindows) => [...prevWindows, newWindow]);
    bringToFront(newWindow.id);
  };

  const runCode = async (code) => {
    try {
      setTerminalOutput("കോഡ് പ്രവർത്തിപ്പിക്കുന്നു...\n");
      setIsTerminalVisible(true);

      const payload = { mlm_code: code };
      const apiUrl = `http://127.0.0.1:8000/run`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      showInTerminal(result.output);
    } catch (error) {
      console.error("Failed to run code:", error);
      showInTerminal(
        `Error: ${error.message}\n` +
          "നിങ്ങളുടെ ബാക്കെൻഡ് പ്രവർത്തിക്കുന്നുണ്ടോയെന്ന് ഉറപ്പാക്കുക."
      );
    }
  };

  const handleFileContextMenu = (e, fileId) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      fileId,
      type: "file",
    });
  };

  const handleDesktopContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      fileId: null,
      type: "desktop",
    });
  };

  const handleMenuItemClick = (action) => {
    if (action === "delete") {
      const fileIdToDelete = contextMenu.fileId;
      deleteFile(fileIdToDelete);
    } else if (action === "rename") {
      const fileToRename = mlmFiles.find(
        (file) => file.id === contextMenu.fileId
      );
      if (fileToRename) {
        setRenameFileId(contextMenu.fileId);
        setRenameFileName(fileToRename.name);
        setShowRenameModal(true);
      }
    } else if (action === "refresh") {
      refreshDesktop();
    } else if (action === "newFile") {
      handleNewFile();
    }
    setContextMenu({ visible: false, x: 0, y: 0, fileId: null, type: null });
  };

  return (
    <div
      ref={desktopRef}
      className="relative w-screen h-screen bg-cover bg-center font-inter select-none overflow-hidden"
      style={{
        backgroundImage: `url("https://c4.wallpaperflare.com/wallpaper/586/603/742/minimalism-4k-for-mac-desktop-wallpaper-preview.jpg")`,
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={() =>
        setContextMenu({ visible: false, x: 0, y: 0, fileId: null, type: null })
      }
      onContextMenu={handleDesktopContextMenu}
    >
      <div className="p-2 flex flex-col flex-wrap gap-x-1 gap-y-2 h-full content-start">
        {mlmFiles.map((file) => (
          <div
            key={file.id}
            onClick={() => openEditor(file)}
            onContextMenu={(e) => handleFileContextMenu(e, file.id)}
            className="flex flex-col items-center p-1 rounded-lg hover:bg-gray-800/50 cursor-pointer w-20 text-white"
          >
            <div className="text-2xl">📝</div>
            <span className="text-xs text-center mt-1 truncate w-full">
              {file.name}
            </span>
          </div>
        ))}

        {/* Learning Guide Desktop Icon */}
        <div
          onClick={openLearningWindow}
          className="flex flex-col items-center p-1 rounded-lg hover:bg-gray-800/50 cursor-pointer w-20 text-white"
        >
          <div className="text-2xl">📚</div>
          <span className="text-xs text-center mt-1 truncate w-full">
            പഠന സഹായി
          </span>
        </div>
      </div>

      {contextMenu.visible && (
        <div
          className="absolute bg-gray-900 text-white rounded-md shadow-lg p-1 z-50 min-w-[150px]"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          {contextMenu.type === "file" && (
            <>
              <div
                onClick={() => handleMenuItemClick("rename")}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer rounded-md flex items-center gap-2"
              >
                ✏️ പേര് മാറ്റുക
              </div>
              <div
                onClick={() => handleMenuItemClick("delete")}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer rounded-md flex items-center gap-2"
              >
                ❌ ഡിലീറ്റ് ചെയ്യുക
              </div>
            </>
          )}
          {contextMenu.type === "desktop" && (
            <>
              <div
                onClick={() => handleMenuItemClick("refresh")}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer rounded-md flex items-center gap-2"
              >
                🔄 പുതുക്കുക
              </div>
              <div
                onClick={() => handleMenuItemClick("newFile")}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer rounded-md flex items-center gap-2"
              >
                ➕ പുതിയ ഫയൽ
              </div>
            </>
          )}
        </div>
      )}

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
          {win.type === "editor" && (
            <TextEditor
              fileId={win.fileId}
              filename={win.title}
              initialCode={win.content}
              onRun={runCode}
              onSave={(fileId, filename, code) =>
                saveFile(fileId, filename, code)
              }
            />
          )}
          {win.type === "output" && <OutputWindow output={win.content} />}
          {win.type === "settings" && <SettingsWindow />}
          {win.type === "learning" && <LearningWindow />}
        </Window>
      ))}

      {/* Terminal Component */}
      <Terminal
        output={terminalOutput}
        isVisible={isTerminalVisible}
        onToggle={() => setIsTerminalVisible(!isTerminalVisible)}
      />

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

      {showRenameModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-80 text-white">
            <h3 className="text-lg font-bold mb-4">ഫയലിന്റെ പേര് മാറ്റുക</h3>
            <input
              type="text"
              value={renameFileName}
              onChange={(e) => setRenameFileName(e.target.value)}
              placeholder="പുതിയ പേര്"
              className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowRenameModal(false);
                  setRenameFileName("");
                  setRenameFileId(null);
                }}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition-colors"
              >
                റദ്ദാക്കുക
              </button>
              <button
                onClick={handleRenameFile}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                പേര് മാറ്റുക
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
          <button
            onClick={openLearningWindow}
            className="px-3 py-1 rounded-md hover:bg-gray-700 transition-colors"
          >
            📚 പഠന സഹായി
          </button>
          <button
            onClick={() => setIsTerminalVisible(!isTerminalVisible)}
            className="px-3 py-1 rounded-md hover:bg-gray-700 transition-colors"
          >
            🖥️ കമാൻഡ് ജനാല
          </button>
        </div>
        <div>
          <span className="text-sm">
            {new Date().toLocaleTimeString("ml-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default App;
