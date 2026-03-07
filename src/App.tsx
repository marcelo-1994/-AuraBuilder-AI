import React, { useState } from 'react';
import { 
  MessageSquare, 
  Code2, 
  Play, 
  Settings, 
  Sparkles, 
  Send, 
  GitBranch,
  Terminal,
  Layers,
  Wand2,
  LayoutTemplate
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateAppCode } from './services/geminiService';

type Tab = 'preview' | 'code' | 'architecture';

export default function App() {
  console.log('App rendering');
  const [activeTab, setActiveTab] = useState<Tab>('preview');
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am AuraBuilder. What kind of application would you like to create today?' }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [appDescription, setAppDescription] = useState<string>('');

  const [showVibeSettings, setShowVibeSettings] = useState(false);
  const [selectedVibe, setSelectedVibe] = useState('modern');

  const vibes = [
    { id: 'modern', name: 'Modern & Clean', desc: 'Minimalist, lots of whitespace, sans-serif.' },
    { id: 'brutalist', name: 'Brutalist', desc: 'Bold typography, high contrast, raw edges.' },
    { id: 'glassmorphism', name: 'Glassmorphism', desc: 'Translucent panels, colorful blurred backgrounds.' },
    { id: 'retro', name: 'Retro 90s', desc: 'Pixel fonts, thick borders, bright colors.' }
  ];

  const handleSend = async () => {
    if (!prompt.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: prompt }]);
    setPrompt('');
    setIsGenerating(true);
    
    try {
      console.log('Attempting to generate app...');
      const result = await generateAppCode(prompt, selectedVibe);
      setGeneratedCode(result.code);
      setAppDescription(result.description);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `I've generated the app for you! ${result.description}` 
      }]);
    } catch (error) {
      console.error('Generation error details:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: `Sorry, I encountered an error generating the app: ${error instanceof Error ? error.message : 'Unknown error'}` }]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] text-gray-300 font-sans overflow-hidden">
      {/* Left Panel: Chat & Controls */}
      <div className="w-[400px] flex flex-col border-r border-white/10 bg-[#111111] z-10 shadow-2xl">
        {/* Header */}
        <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold tracking-tight text-lg">AuraBuilder</span>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          {messages.map((msg, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx} 
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-indigo-600' : 'bg-white/10'
              }`}>
                {msg.role === 'user' ? <Terminal className="w-4 h-4 text-white" /> : <Wand2 className="w-4 h-4 text-white" />}
              </div>
              <div className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-sm' 
                  : 'bg-white/5 text-gray-300 rounded-tl-sm border border-white/5'
              }`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
          {isGenerating && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex gap-4"
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <Wand2 className="w-4 h-4 text-white animate-pulse" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white/5 text-gray-400 text-sm rounded-tl-sm border border-white/5 flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                Generating...
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-[#111111]">
          <div className="relative flex items-end gap-2 bg-[#0a0a0a] rounded-xl border border-white/10 p-2 focus-within:border-indigo-500/50 transition-colors">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Describe your app..."
              className="w-full bg-transparent text-white text-sm resize-none outline-none max-h-32 min-h-[44px] py-3 px-2"
              rows={1}
            />
            <button 
              onClick={handleSend}
              disabled={!prompt.trim() || isGenerating}
              className="w-10 h-10 shrink-0 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/5 disabled:text-gray-600 text-white flex items-center justify-center transition-colors mb-0.5"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-between mt-3 px-1">
            <div className="flex gap-2">
              <button 
                onClick={() => setShowVibeSettings(true)}
                className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1 transition-colors"
              >
                <Settings className="w-3 h-3" /> Vibe Settings
              </button>
            </div>
            <span className="text-[10px] text-gray-600 uppercase tracking-wider font-mono">Aura Engine v1.0</span>
          </div>
        </div>
      </div>

      {/* Vibe Settings Modal */}
      <AnimatePresence>
        {showVibeSettings && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowVibeSettings(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">Vibe Settings</h2>
                  <p className="text-sm text-gray-400 mt-1">Choose the aesthetic for your generated app.</p>
                </div>
                <button 
                  onClick={() => setShowVibeSettings(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 space-y-3">
                {vibes.map(vibe => (
                  <button
                    key={vibe.id}
                    onClick={() => setSelectedVibe(vibe.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedVibe === vibe.id 
                        ? 'bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.1)]' 
                        : 'bg-white/5 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-medium ${selectedVibe === vibe.id ? 'text-indigo-400' : 'text-gray-200'}`}>
                        {vibe.name}
                      </span>
                      {selectedVibe === vibe.id && (
                        <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{vibe.desc}</p>
                  </button>
                ))}
              </div>
              <div className="p-4 border-t border-white/10 bg-[#0a0a0a] flex justify-end">
                <button 
                  onClick={() => setShowVibeSettings(false)}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Apply Vibe
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right Panel: Workspace */}
      <div className="flex-1 flex flex-col bg-[#050505] relative">
        {/* Top Navigation */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md z-10">
          <div className="flex bg-[#111111] p-1 rounded-lg border border-white/5">
            <button 
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'preview' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Play className="w-4 h-4" /> Preview
            </button>
            <button 
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'code' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Code2 className="w-4 h-4" /> Code
            </button>
            <button 
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'architecture' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <GitBranch className="w-4 h-4" /> Architecture
            </button>
          </div>
          
          <div className="flex items-center gap-3">
             <button className="px-3 py-1.5 text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors flex items-center gap-2">
               <Layers className="w-4 h-4" /> Versions
             </button>
             <button className="px-4 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors font-medium">
               Deploy App
             </button>
          </div>
        </div>

        {/* Workspace Content */}
        <div className="flex-1 relative overflow-hidden p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'preview' && (
              <motion.div 
                key="preview"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-6 bg-white rounded-xl shadow-2xl overflow-hidden flex items-center justify-center border border-white/20"
              >
                <div className="text-center text-gray-400">
                  <LayoutTemplate className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="font-medium text-gray-600">Preview will appear here</p>
                  <p className="text-sm mt-1">Describe your app to start generating</p>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'code' && (
              <motion.div 
                key="code"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-6 bg-[#0d0d0d] rounded-xl shadow-2xl overflow-hidden border border-white/10 flex flex-row"
              >
                 {/* File Explorer Sidebar */}
                 <div className="w-48 border-r border-white/10 bg-[#111111] flex flex-col">
                   <div className="p-3 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-white/10">
                     Files
                   </div>
                   <div className="flex-1 overflow-y-auto p-2 space-y-1">
                     <div className="px-2 py-1.5 text-sm text-gray-300 hover:bg-white/5 rounded cursor-pointer flex items-center gap-2">
                       <span className="text-blue-400">TS</span> main.tsx
                     </div>
                     <div className="px-2 py-1.5 text-sm text-indigo-400 bg-indigo-500/10 rounded cursor-pointer flex items-center gap-2">
                       <span className="text-blue-400">TS</span> App.tsx
                     </div>
                     <div className="px-2 py-1.5 text-sm text-gray-300 hover:bg-white/5 rounded cursor-pointer flex items-center gap-2">
                       <span className="text-sky-400">CSS</span> index.css
                     </div>
                   </div>
                 </div>
                 
                 {/* Code Editor Area */}
                 <div className="flex-1 flex flex-col">
                   <div className="h-10 border-b border-white/10 flex items-center px-4 bg-[#111111]">
                     <div className="flex gap-2">
                       <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                       <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                       <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                     </div>
                     <div className="mx-auto text-xs text-gray-500 font-mono">App.tsx</div>
                   </div>
                   <div className="flex-1 p-4 font-mono text-sm text-gray-400 overflow-auto">
                     <pre><code>{generatedCode || '// Code will be generated here\nimport React from \'react\';\n\nexport default function App() {\n  return (\n    <div className="min-h-screen bg-white">\n      <h1>Hello World</h1>\n    </div>\n  );\n}'}</code></pre>
                   </div>
                 </div>
              </motion.div>
            )}

            {activeTab === 'architecture' && (
              <motion.div 
                key="architecture"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-6 bg-[#111111] rounded-xl shadow-2xl overflow-hidden border border-white/10 p-8"
              >
                <div className="h-full w-full border border-dashed border-white/10 rounded-lg flex items-center justify-center relative">
                  {/* Mock Architecture Nodes */}
                  <div className="absolute top-1/4 left-1/4 p-4 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl w-48">
                    <div className="text-xs text-indigo-400 font-mono mb-1">Entry</div>
                    <div className="font-medium text-white">main.tsx</div>
                  </div>
                  
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 bg-[#1a1a1a] border border-indigo-500/30 rounded-xl shadow-xl shadow-indigo-500/10 w-48">
                    <div className="text-xs text-indigo-400 font-mono mb-1">Component</div>
                    <div className="font-medium text-white">App.tsx</div>
                  </div>
                  
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                    <path d="M 300 200 C 400 200, 400 350, 500 350" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                  </svg>
                  
                  <div className="absolute bottom-8 right-8 text-right">
                    <h3 className="text-white font-medium">Architecture Map</h3>
                    <p className="text-sm text-gray-500 mt-1 max-w-xs">
                      {appDescription || 'Visualize the component tree and data flow of your generated application.'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
