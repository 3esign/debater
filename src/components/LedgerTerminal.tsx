"use client";

import { useDebaterStore } from "../lib/store";
import { Terminal, Copy, Check, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function LedgerTerminal() {
  const store = useDebaterStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, txHash: string, id: string) => {
    e.stopPropagation(); // prevent triggering solidity highlights
    navigator.clipboard.writeText(txHash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleLogClick = (highlightRange?: [number, number], detail?: string) => {
    if (highlightRange) {
      store.highlightCode(highlightRange, detail || "Simulated EVM Execution");
    }
  };

  return (
    <div className="flex flex-col h-full bg-cyber-dark/95 border border-cyber-border rounded-xl overflow-hidden font-mono text-xs shadow-inner shadow-black/80">
      {/* Console Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-black/60 border-b border-cyber-border">
        <div className="flex items-center gap-2 text-emerald-400">
          <Terminal className="w-4 h-4 animate-pulse" />
          <span className="font-semibold tracking-wider text-[11px] uppercase">
            Base Ledger Live Feed (Simulated)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="text-[10px] text-slate-500">BLKS: {store.currentBlockNumber}</span>
        </div>
      </div>

      {/* Terminal logs list */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin select-none max-h-[350px]">
        {store.ledgerLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-600/80 py-10">
            <span className="text-[10px] text-slate-600 uppercase mb-1">
              [SYSTEM WAITING]
            </span>
            <p className="text-center max-w-[280px] font-sans text-xs">
              No on-chain events yet. Setup the debate parameters and click "Deploy Arena Escrow" to begin.
            </p>
          </div>
        ) : (
          store.ledgerLogs.map((log) => {
            const isRangeActive =
              store.activeHighlightLines &&
              log.lineHighlightRange &&
              store.activeHighlightLines[0] === log.lineHighlightRange[0];

            return (
              <div
                key={log.id}
                onClick={() => handleLogClick(log.lineHighlightRange, log.detail)}
                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 group relative ${
                  isRangeActive
                    ? "bg-emerald-500/5 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.03)]"
                    : "bg-black/40 border-cyber-border/40 hover:border-slate-700/60"
                }`}
              >
                {/* Event timestamp and block details */}
                <div className="flex justify-between items-center text-[10px] text-slate-500 mb-2 border-b border-cyber-border/20 pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3 text-emerald-500" />
                    <span className="font-semibold text-slate-400">
                      Block #{log.blockNumber}
                    </span>
                  </div>
                  <span>{log.timestamp}</span>
                </div>

                {/* Main TX action call */}
                <div className="flex justify-between items-start gap-4 mb-2">
                  <div className="font-bold text-slate-100 break-all select-text font-mono">
                    {log.action}
                  </div>
                  {log.valueText && (
                    <span className="text-[11px] text-cyber-amber bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded font-bold whitespace-nowrap shrink-0">
                      {log.valueText}
                    </span>
                  )}
                </div>

                {/* Sub-details */}
                <div className="text-slate-400 leading-relaxed text-[11px] font-sans mb-2">
                  {log.detail}
                </div>

                {/* Transaction Hash interactive copyable element */}
                <div className="flex justify-between items-center text-[9px] text-slate-600 bg-black/60 px-2.5 py-1.5 rounded border border-cyber-border/20 mt-1">
                  <span className="font-mono text-slate-500">
                    TX: {log.txHash.substring(0, 18)}...{log.txHash.substring(log.txHash.length - 8)}
                  </span>
                  <button
                    onClick={(e) => handleCopy(e, log.txHash, log.id)}
                    className="p-1 text-slate-600 hover:text-emerald-400 rounded transition-colors"
                    title="Copy Transaction Hash"
                  >
                    {copiedId === log.id ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 group-hover:text-slate-400" />
                    )}
                  </button>
                </div>

                {/* Hover guide tag */}
                <div className="absolute bottom-1 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] text-slate-500 tracking-widest font-sans uppercase">
                  Click to inspect contract
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
