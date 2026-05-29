"use client";

import { useState } from "react";
import { useDebaterStore } from "../lib/store";
import { THEME } from "../lib/theme";
import { Zap, ShieldCheck, Key, HelpCircle, Swords, Award, Play, Wallet, LogOut, Coins } from "lucide-react";
import KeysModal from "./KeysModal";

const TOPIC_PRESETS = [
  {
    title: "Decentralization vs. Regulation",
    desc: "Sovereign cryptographic immutability vs. central consumer safety rails."
  },
  {
    title: "AGI Safety: Open Source vs. Monopolies",
    desc: "Should frontier models be globally free or locked under strict corporate licensing?"
  },
  {
    title: "Web3 Economy: Value vs. Speculation",
    desc: "Are decentralized financial mechanisms building real utility or pure casinos?"
  }
];

const PROVIDER_OPTIONS = [
  { id: "gemini", name: "Gemini", defaultModel: "gemini-1.5-flash", desc: "Lightning fast, free tier" },
  { id: "groq", name: "Groq", defaultModel: "llama3-70b-8192", desc: "High-cadence streaming Llama 3" },
  { id: "openai", name: "OpenAI", defaultModel: "gpt-4o-mini", desc: "Standard benchmark engine" },
  { id: "openrouter", name: "OpenRouter", defaultModel: "deepseek/deepseek-chat", desc: "Access DeepSeek & Qwen" },
  { id: "ollama", name: "Ollama", defaultModel: "llama3", desc: "100% Free local offline play" }
];

interface LobbyViewProps {
  onStartGenesis: () => void;
  onStartLive: (config: {
    topic: string;
    agentA: { provider: any; model: string; persona: string };
    agentB: { provider: any; model: string; persona: string };
  }) => void;
}

export default function LobbyView({ onStartGenesis, onStartLive }: LobbyViewProps) {
  const store = useDebaterStore();
  const [keysOpen, setKeysOpen] = useState(false);
  const [topic, setTopic] = useState("Decentralization vs. Regulation");
  const [escrowFee, setEscrowFee] = useState(250);

  // Agent configuration presets
  const [agentA, setAgentA] = useState({
    provider: "gemini",
    model: "gemini-1.5-flash",
    persona: "Decentrolat, an unyielding cypherpunk advocating for pure decentralized systems. Sharp, socratic, concise."
  });

  const [agentB, setAgentB] = useState({
    provider: "gemini",
    model: "gemini-1.5-flash",
    persona: "Regulo, an elite system strategist advocating for pragmatism, safety, and strict regulatory compliance."
  });

  const handlePresetSelect = (presetTitle: string) => {
    setTopic(presetTitle);
    store.setTopic(presetTitle);
  };

  const handleStartLiveMatch = () => {
    store.trainerEscrowA = escrowFee;
    store.trainerEscrowB = escrowFee;
    store.enterEscrow();
    onStartLive({
      topic,
      agentA,
      agentB
    });
  };

  const isAnyKeyConfigured = !!(
    store.apiKeys.gemini ||
    store.apiKeys.groq ||
    store.apiKeys.openai ||
    store.apiKeys.openrouter ||
    store.apiKeys.ollamaUrl
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Visual Title Header */}
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-black uppercase tracking-tight text-white select-none">
          Autonomous <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-purple via-cyber-blue to-cyber-amber">AI Debate Arena</span>
        </h1>
        <p className="text-xs text-slate-400 font-sans tracking-wide mt-1.5 leading-relaxed max-w-xl">
          Watch autonomous training agents wage intellectual combat while a reactive Solidity smart contract vault locks collateral, captures spectator wagers, and executes automated settlements in real-time.
        </p>
      </div>

      {/* Global Actions bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-cyber-panel border border-cyber-border rounded-xl">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Wallet Balance Info */}
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded bg-cyber-amber/10 text-cyber-amber border border-cyber-amber/20`}>
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-mono block">YOUR WALLET BALANCE</span>
              <span className="text-sm font-extrabold text-white font-mono">
                {store.balance.toFixed(2)} USDC <span className="text-slate-500 text-[10px] font-normal">(Mock)</span>
              </span>
            </div>
          </div>

          {/* Connected Wallet Info */}
          {store.walletAddress ? (
            <div className="flex items-center gap-3 md:border-l border-cyber-border/60 md:pl-4">
              <div className={`p-2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20`}>
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-mono block">WALLET CONNECTED (BASE)</span>
                <span className="text-xs font-mono text-slate-200 flex items-center gap-1.5">
                  {store.walletAddress.substring(0, 6)}...{store.walletAddress.substring(38)}
                  <button 
                    onClick={() => store.disconnectWallet()}
                    className="text-red-400 hover:text-red-300 font-mono text-[9px] uppercase tracking-wider block ml-1 cursor-pointer"
                    title="Disconnect Wallet"
                  >
                    [Disconnect]
                  </button>
                </span>
              </div>
            </div>
          ) : (
            <button
              onClick={() => store.connectWallet("0x8b81C548C08C32D391F6007281838cD8d001105D")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyber-purple/20 to-cyber-blue/20 hover:from-cyber-purple/30 hover:to-cyber-blue/30 border border-cyber-purple/40 hover:border-cyber-purple rounded-lg text-xs font-mono text-slate-300 hover:text-white transition-all shadow-[0_0_15px_rgba(168,85,247,0.05)] cursor-pointer"
            >
              <Wallet className="w-3.5 h-3.5 text-cyber-purple animate-pulse" />
              <span>Connect EVM Wallet</span>
            </button>
          )}

          {/* Accumulated Fees info if connected */}
          {store.walletAddress && (
            <div className="flex items-center gap-3 md:border-l border-cyber-border/60 md:pl-4 animate-in fade-in duration-200">
              <div className={`p-2 rounded bg-cyber-amber/10 text-cyber-amber border border-cyber-amber/20`}>
                <Coins className="w-4 h-4 text-cyber-amber" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-mono block">YOUR COLLECTED FEES (1.5%)</span>
                <span className="text-xs font-bold text-cyber-amber font-mono">
                  {store.accumulatedFeesUSDC.toFixed(2)} USDC
                </span>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setKeysOpen(true)}
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg font-mono text-xs transition-all duration-200 uppercase tracking-widest ${
            !isAnyKeyConfigured
              ? "bg-amber-500/10 border-amber-500/30 text-cyber-amber animate-pulse"
              : "border-cyber-border hover:bg-slate-900 text-slate-300 hover:text-slate-100"
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>API Keys</span>
          {!isAnyKeyConfigured && (
            <span className="h-2 w-2 rounded-full bg-cyber-amber"></span>
          )}
        </button>
      </div>

      {/* Grid: Topic Selector + Match Escrow Config */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Left Card: Arena Topic Configuration */}
        <div className="p-5 bg-cyber-panel border border-cyber-border rounded-xl space-y-4">
          <span className="text-[10px] text-slate-400 font-mono font-bold tracking-widest uppercase block">
            1. Arena Debate Topic Config
          </span>
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 block">Active Debate Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                store.setTopic(e.target.value);
              }}
              placeholder="e.g. Is centralization essential for financial systems?"
              className="w-full bg-cyber-dark border border-cyber-border focus:border-cyber-purple outline-none rounded px-3 py-2 text-xs font-sans text-slate-200 transition-colors"
            />
          </div>

          <div className="space-y-2.5">
            <span className="text-[10px] text-slate-500 font-mono font-semibold block uppercase">
              Or Choose Preset Arena Topics
            </span>
            <div className="space-y-2">
              {TOPIC_PRESETS.map((preset) => (
                <div
                  key={preset.title}
                  onClick={() => handlePresetSelect(preset.title)}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition-all duration-150 ${
                    topic === preset.title
                      ? "bg-cyber-purple/5 border-cyber-purple/50"
                      : "bg-black/20 border-cyber-border/40 hover:border-slate-800 hover:bg-black/40"
                  }`}
                >
                  <span className="text-xs font-bold text-slate-200 block font-sans">
                    {preset.title}
                  </span>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-sans mt-0.5">
                    {preset.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Card: Escrows and Wager parameters */}
        <div className="p-5 bg-cyber-panel border border-cyber-border rounded-xl flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <span className="text-[10px] text-slate-400 font-mono font-bold tracking-widest uppercase block">
              2. On-Chain Escrow Parameters
            </span>
            
            {/* Escrow Fee Input Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Agent Escrow Deposit Fee</span>
                <span className="text-cyber-amber font-bold">{escrowFee} USDC</span>
              </div>
              <input
                type="range"
                min="50"
                max="500"
                step="50"
                value={escrowFee}
                onChange={(e) => setEscrowFee(parseInt(e.target.value))}
                className="w-full accent-cyber-amber bg-cyber-dark h-1.5 rounded cursor-pointer border border-cyber-border"
              />
              <div className="flex justify-between text-[9px] text-slate-600 font-mono">
                <span>Min: 50 USDC</span>
                <span>Max: 500 USDC</span>
              </div>
            </div>

            {/* Simulated clearinghouse information */}
            <div className="p-3.5 bg-black/40 rounded-lg border border-cyber-border/40 font-mono text-[10px] space-y-2 leading-relaxed text-slate-500">
              <div className="flex items-center gap-1.5 text-slate-300 font-bold mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Clearinghouse Verification Rules</span>
              </div>
              <p>• Locks both training agents' entry fees into match escrow.</p>
              <p>• Vault limits wagers during live debate turns to prevent front-running.</p>
              <p>• Resolves prize payouts only upon spectator quorum verification.</p>
            </div>
          </div>

          {/* Quick Play options */}
          <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-cyber-border/40">
            <button
              onClick={() => {
                store.trainerEscrowA = escrowFee;
                store.trainerEscrowB = escrowFee;
                store.enterEscrow();
                onStartGenesis();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-cyber-amber hover:bg-amber-500 text-black font-mono text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/10 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Genesis Tour Match</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Panel: Customized Autonomous Agent Training Controllers */}
      <div className="p-5 bg-cyber-panel border border-cyber-border rounded-xl space-y-4">
        <div className="flex items-center justify-between border-b border-cyber-border/40 pb-3">
          <span className="text-[10px] text-slate-400 font-mono font-bold tracking-widest uppercase block">
            3. Setup Autonomous Agent Trainers
          </span>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
            <Swords className="w-3.5 h-3.5" />
            <span>AGENT KITS ONLINE</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Agent Alpha Configuration Card */}
          <div className="p-4 bg-cyber-dark/40 border border-cyber-border rounded-xl space-y-3.5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyber-purple shadow-[0_0_8px_#a855f7]"></span>
                <span className="font-mono text-xs font-bold text-slate-200">AGENT ALPHA (PURPLE)</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-[10px] text-slate-500">
                <Award className="w-3.5 h-3.5 text-cyber-purple" />
                <span>ELO: {store.eloA}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400">LLM Provider</label>
                <select
                  value={agentA.provider}
                  onChange={(e) => {
                    const prov = PROVIDER_OPTIONS.find(p => p.id === e.target.value);
                    setAgentA({
                      ...agentA,
                      provider: e.target.value,
                      model: prov?.defaultModel || ""
                    });
                  }}
                  className="w-full bg-cyber-dark border border-cyber-border text-slate-300 text-xs rounded p-1.5 outline-none font-mono focus:border-cyber-purple"
                >
                  {PROVIDER_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400">Model Selector</label>
                <input
                  type="text"
                  value={agentA.model}
                  onChange={(e) => setAgentA({ ...agentA, model: e.target.value })}
                  className="w-full bg-cyber-dark border border-cyber-border text-slate-300 text-xs rounded p-1.5 outline-none font-mono focus:border-cyber-purple"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400">Core Persona Directive</label>
              <textarea
                value={agentA.persona}
                onChange={(e) => setAgentA({ ...agentA, persona: e.target.value })}
                rows={2}
                className="w-full bg-cyber-dark border border-cyber-border text-slate-300 text-xs rounded p-1.5 outline-none font-sans focus:border-cyber-purple resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Agent Beta Configuration Card */}
          <div className="p-4 bg-cyber-dark/40 border border-cyber-border rounded-xl space-y-3.5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyber-blue shadow-[0_0_8px_#3b82f6]"></span>
                <span className="font-mono text-xs font-bold text-slate-200">AGENT BETA (BLUE)</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-[10px] text-slate-500">
                <Award className="w-3.5 h-3.5 text-cyber-blue" />
                <span>ELO: {store.eloB}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400">LLM Provider</label>
                <select
                  value={agentB.provider}
                  onChange={(e) => {
                    const prov = PROVIDER_OPTIONS.find(p => p.id === e.target.value);
                    setAgentB({
                      ...agentB,
                      provider: e.target.value,
                      model: prov?.defaultModel || ""
                    });
                  }}
                  className="w-full bg-cyber-dark border border-cyber-border text-slate-300 text-xs rounded p-1.5 outline-none font-mono focus:border-cyber-blue"
                >
                  {PROVIDER_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400">Model Selector</label>
                <input
                  type="text"
                  value={agentB.model}
                  onChange={(e) => setAgentB({ ...agentB, model: e.target.value })}
                  className="w-full bg-cyber-dark border border-cyber-border text-slate-300 text-xs rounded p-1.5 outline-none font-mono focus:border-cyber-blue"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400">Core Persona Directive</label>
              <textarea
                value={agentB.persona}
                onChange={(e) => setAgentB({ ...agentB, persona: e.target.value })}
                rows={2}
                className="w-full bg-cyber-dark border border-cyber-border text-slate-300 text-xs rounded p-1.5 outline-none font-sans focus:border-cyber-blue resize-none leading-relaxed"
              />
            </div>
          </div>

        </div>

        {/* Live Deploy Action */}
        <div className="pt-2">
          <button
            onClick={handleStartLiveMatch}
            disabled={!isAnyKeyConfigured}
            className={`w-full flex items-center justify-center gap-2 py-3.5 font-mono text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-200 border shadow-md select-none ${
              isAnyKeyConfigured
                ? "bg-gradient-to-r from-cyber-purple to-cyber-blue text-white border-transparent hover:brightness-110 shadow-purple-500/10 cursor-pointer"
                : "bg-black/40 border-cyber-border text-slate-600 cursor-not-allowed"
            }`}
          >
            <Swords className="w-4 h-4" />
            <span>Deploy Unscripted Arena Escrow</span>
            {!isAnyKeyConfigured && (
              <span className="text-[10px] font-sans text-amber-500 italic lowercase font-normal ml-1">
                (API Keys required in Keys Manager)
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Keys Modal Integration */}
      <KeysModal isOpen={keysOpen} onClose={() => setKeysOpen(false)} />
    </div>
  );
}
