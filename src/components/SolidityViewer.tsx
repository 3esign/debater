"use client";

import { useEffect, useRef } from "react";
import { useDebaterStore } from "../lib/store";
import { DEBATER_VAULT_CODE_LINES } from "../lib/contractCode";
import { ShieldCheck, Cpu } from "lucide-react";

export default function SolidityViewer() {
  const store = useDebaterStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  const activeRange = store.activeHighlightLines;

  // Auto-scroll to the active executing line range
  useEffect(() => {
    if (activeRange && containerRef.current && activeLineRef.current) {
      const activeElement = activeLineRef.current;
      const container = containerRef.current;

      // Scroll smoothly to keep the active block centered
      const topOffset = activeElement.offsetTop - container.clientHeight / 3;
      container.scrollTo({
        top: Math.max(0, topOffset),
        behavior: "smooth",
      });
    }
  }, [activeRange]);

  // High-fidelity custom light-speed Solidity syntax highlighter for zero-SSR-friction execution
  const highlightSolidity = (line: string) => {
    let cleanLine = line;

    // Comments helper
    if (cleanLine.trim().startsWith("//") || cleanLine.trim().startsWith("/*") || cleanLine.trim().startsWith("*")) {
      return <span className="text-slate-500/80 italic">{line}</span>;
    }

    // Splitting words and symbols to preserve formatting
    const keywords = [
      "contract", "struct", "mapping", "function", "external", "payable", 
      "require", "emit", "modifier", "event", "returns", "public", 
      "private", "view", "pure", "enum", "constructor", "return"
    ];

    const types = ["uint256", "address", "bytes32", "bool", "string", "uint8"];

    // Basic regex replacement for syntax token rendering
    const parts: React.ReactNode[] = [];
    const tokens = line.split(/(\W+)/); // keep whitespace and punctuation

    tokens.forEach((token, idx) => {
      if (keywords.includes(token)) {
        parts.push(<span key={idx} className="text-purple-400 font-semibold">{token}</span>);
      } else if (types.includes(token)) {
        parts.push(<span key={idx} className="text-blue-400 font-semibold">{token}</span>);
      } else if (token.startsWith('"') && token.endsWith('"')) {
        parts.push(<span key={idx} className="text-amber-200">{token}</span>);
      } else if (/^\d+$/.test(token)) {
        parts.push(<span key={idx} className="text-amber-500">{token}</span>);
      } else if (token.startsWith("emit") || token.startsWith("require")) {
        parts.push(<span key={idx} className="text-red-400">{token}</span>);
      } else {
        parts.push(token);
      }
    });

    return <>{parts}</>;
  };

  return (
    <div className="flex flex-col h-full bg-cyber-panel border border-cyber-border rounded-xl overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
      {/* Header Area */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-cyber-dark/80 border-b border-cyber-border backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${activeRange ? 'bg-amber-400' : 'bg-slate-600'}`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${activeRange ? 'bg-cyber-amber shadow-[0_0_10px_#fbbf24]' : 'bg-slate-600'}`}></span>
          </div>
          <span className="font-mono text-sm tracking-widest text-slate-300 font-medium">
            DebaterVault.sol
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-cyber-amber border border-amber-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>BASE SEPOLIA SECURE</span>
        </div>
      </div>

      {/* Real-time Plain-English Smart Explainer Panel */}
      <div className="p-4 bg-cyber-dark/40 border-b border-cyber-border flex gap-3 items-start min-h-[76px] transition-all duration-300">
        <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-cyber-amber mt-0.5">
          <Cpu className="w-4 h-4 animate-pulse" />
        </div>
        <div className="flex-1">
          <span className="text-slate-400 text-xs font-mono uppercase tracking-wider block font-semibold mb-0.5">
            On-Chain Execution Explainer
          </span>
          <p className="text-slate-300 text-xs font-sans leading-relaxed">
            {store.activeExplainer}
          </p>
        </div>
      </div>

      {/* Code Window */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-5 select-none bg-cyber-dark/25 scroll-smooth relative"
      >
        <div className="min-w-max">
          {DEBATER_VAULT_CODE_LINES.map((line, idx) => {
            const lineNum = idx + 1;
            const isHighlighted =
              activeRange && lineNum >= activeRange[0] && lineNum <= activeRange[1];
            const isFirstOfHighlight = activeRange && lineNum === activeRange[0];

            return (
              <div
                key={idx}
                ref={isFirstOfHighlight ? activeLineRef : null}
                className={`flex w-full group items-center transition-all duration-300 ${
                  isHighlighted
                    ? "bg-cyber-amber/5 text-amber-100 border-l-2 border-cyber-amber -ml-1 pl-1 py-0.5 shadow-[inset_4px_0_12px_rgba(251,191,36,0.04)] animate-pulse-amber"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {/* Line number column */}
                <span
                  className={`inline-block w-8 text-right pr-3 font-semibold select-none border-r border-cyber-border/40 mr-3.5 ${
                    isHighlighted
                      ? "text-cyber-amber border-cyber-amber/40"
                      : "text-slate-600/70"
                  }`}
                >
                  {lineNum}
                </span>

                {/* Highlighted text */}
                <span className="whitespace-pre">
                  {highlightSolidity(line)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
