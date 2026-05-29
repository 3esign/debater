"use client";

import { useState } from "react";
import { useDebaterStore } from "../lib/store";
import { Key, Eye, EyeOff, ShieldAlert, Cpu, Check, HelpCircle } from "lucide-react";

interface KeysModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeysModal({ isOpen, onClose }: KeysModalProps) {
  const store = useDebaterStore();
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({
    gemini: store.apiKeys.gemini || "",
    groq: store.apiKeys.groq || "",
    openai: store.apiKeys.openai || "",
    openrouter: store.apiKeys.openrouter || "",
    ollamaUrl: store.apiKeys.ollamaUrl || "http://localhost:11434",
  });
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const toggleVisibility = (field: string) => {
    setShowKeys((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    store.setApiKeys({
      gemini: formData.gemini,
      groq: formData.groq,
      openai: formData.openai,
      openrouter: formData.openrouter,
      ollamaUrl: formData.ollamaUrl,
    });
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-xl bg-cyber-panel border border-cyber-border rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-cyber-dark/80 border-b border-cyber-border">
          <div className="flex items-center gap-2.5 text-cyber-purple">
            <Key className="w-5 h-5 animate-pulse" />
            <span className="font-mono text-sm tracking-wider uppercase font-bold text-slate-100">
              Universal API Keys Manager
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-200 font-mono text-sm"
          >
            ✕ CLOSE
          </button>
        </div>

        {/* Security Reassurance Panel */}
        <div className="p-4 bg-emerald-500/5 border-b border-cyber-border flex gap-3 items-start">
          <div className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <span className="text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider block mb-0.5">
              100% Client-Side Sandbox Guarantee
            </span>
            <p className="text-slate-400 text-[11px] font-sans leading-relaxed">
              Your API keys are stored exclusively in your browser's local sandbox (`localStorage`). They are never uploaded, sent to any backend servers, or relayed through proxies. Direct client fetches are executed directly from your viewport.
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          
          {/* Google Gemini */}
          <div>
            <label className="flex justify-between text-xs font-mono text-slate-300 font-medium mb-1.5">
              <span>Google Gemini Key</span>
              <span className="text-purple-400 font-bold">[Recommended - Free Tier]</span>
            </label>
            <div className="relative">
              <input
                type={showKeys.gemini ? "text" : "password"}
                value={formData.gemini}
                onChange={(e) => setFormData({ ...formData, gemini: e.target.value })}
                placeholder="AIzaSy..."
                className="w-full bg-cyber-dark border border-cyber-border focus:border-cyber-purple outline-none rounded px-3 py-2 text-xs font-mono text-slate-200 transition-colors"
              />
              <button
                type="button"
                onClick={() => toggleVisibility("gemini")}
                className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
              >
                {showKeys.gemini ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* OpenRouter Key */}
          <div>
            <label className="flex justify-between text-xs font-mono text-slate-300 font-medium mb-1.5">
              <span>OpenRouter API Key</span>
              <span className="text-cyber-blue font-bold">[Active - DeepSeek / Llama 3]</span>
            </label>
            <div className="relative">
              <input
                type={showKeys.openrouter ? "text" : "password"}
                value={formData.openrouter}
                onChange={(e) => setFormData({ ...formData, openrouter: e.target.value })}
                placeholder="sk-or-v1-..."
                className="w-full bg-cyber-dark border border-cyber-border focus:border-cyber-blue outline-none rounded px-3 py-2 text-xs font-mono text-slate-200 transition-colors"
              />
              <button
                type="button"
                onClick={() => toggleVisibility("openrouter")}
                className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
              >
                {showKeys.openrouter ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Groq Key - Stubbed */}
          <div className="opacity-40 select-none">
            <label className="flex justify-between text-xs font-mono text-slate-500 font-medium mb-1.5">
              <span>Groq API Key (Disabled)</span>
              <span className="text-slate-600 font-bold">[Coming Soon]</span>
            </label>
            <div className="relative">
              <input
                type="password"
                disabled
                placeholder="Disabled for prototype stability"
                className="w-full bg-[#0a0a0f] border border-cyber-border/40 outline-none rounded px-3 py-2 text-xs font-mono text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* OpenAI Key - Stubbed */}
          <div className="opacity-40 select-none">
            <label className="flex justify-between text-xs font-mono text-slate-500 font-medium mb-1.5">
              <span>OpenAI API Key (Disabled)</span>
              <span className="text-slate-600 font-bold">[Coming Soon]</span>
            </label>
            <div className="relative">
              <input
                type="password"
                disabled
                placeholder="Disabled for prototype stability"
                className="w-full bg-[#0a0a0f] border border-cyber-border/40 outline-none rounded px-3 py-2 text-xs font-mono text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Ollama Offline Local Router - Stubbed */}
          <div className="p-3.5 rounded border border-cyber-border/40 bg-black/20 opacity-40 select-none">
            <label className="flex justify-between items-center text-xs font-mono text-slate-500 font-medium mb-1.5">
              <span>Ollama Endpoint (Offline)</span>
              <span className="text-slate-600 font-bold">[Coming Soon]</span>
            </label>
            <input
              type="text"
              disabled
              placeholder="http://localhost:11434"
              className="w-full bg-[#0a0a0f] border border-cyber-border/40 outline-none rounded px-3 py-2 text-xs font-mono text-slate-500 cursor-not-allowed"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-cyber-border hover:bg-slate-900 rounded text-xs font-mono text-slate-400 hover:text-slate-200"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={success}
              className={`flex items-center gap-1.5 px-6 py-2 rounded text-xs font-mono font-bold tracking-widest uppercase transition-all duration-200 shadow-md ${
                success
                  ? "bg-emerald-500 text-black shadow-emerald-500/20"
                  : "bg-cyber-purple text-slate-100 hover:bg-purple-600 hover:shadow-purple-500/20"
              }`}
            >
              {success ? (
                <>
                  <Check className="w-4 h-4" />
                  SAVED OK
                </>
              ) : (
                "SAVE KEYS"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
