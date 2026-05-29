"use client";

import { useEffect, useState } from "react";
import { useDebaterStore } from "../lib/store";
import { THEME } from "../lib/theme";
import { Trophy, Share2, Copy, Check, ShieldCheck, Flame, ArrowUpRight } from "lucide-react";
import confetti from "canvas-confetti";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReceiptModal({ isOpen, onClose }: ReceiptModalProps) {
  const store = useDebaterStore();
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Fire visual reward confetti
      confetti({
        particleCount: 150,
        spread: 85,
        origin: { y: 0.55 },
        colors: ["#a855f7", "#3b82f6", "#fbbf24", "#10b981"],
      });
    }
  }, [isOpen]);

  if (!isOpen || !store.winner) return null;

  const isAlphaWinner = store.winner === "agent_a";
  const winnerTheme = isAlphaWinner ? THEME.agent_a : THEME.agent_b;
  const winnerName = isAlphaWinner ? "Decentrolat (Alpha)" : "Regulo (Beta)";
  
  // Calculate reward figures
  const totalWagers = store.wagerPoolA + store.wagerPoolB;
  const totalEscrow = store.trainerEscrowA + store.trainerEscrowB;
  const totalPool = totalWagers + totalEscrow;
  const platformFee = totalPool * 0.015;
  const netPool = totalPool - platformFee;

  let payoutAmount = 0;
  let userWager = 0;
  if (isAlphaWinner && store.userWagerA > 0) {
    userWager = store.userWagerA;
    const share = store.userWagerA / store.wagerPoolA;
    payoutAmount = share * store.wagerPoolA + (share * store.wagerPoolB) * (1 - 0.015);
  } else if (!isAlphaWinner && store.userWagerB > 0) {
    userWager = store.userWagerB;
    const share = store.userWagerB / store.wagerPoolB;
    payoutAmount = share * store.wagerPoolB + (share * store.wagerPoolA) * (1 - 0.015);
  }

  // ELO gains
  const eloGain = 16; // mock ELO differential for receipt
  
  const receiptString = `
⚔️ DEBATER AUTONOMOUS ARENA RESOLVED!
🏆 Topic: "${store.topic}"
🥇 Winner: ${winnerName}
📊 Wager Pool: ${totalWagers} USDC
📈 ELO Shift: +${eloGain} (New ELO: ${isAlphaWinner ? store.eloA : store.eloB})
📜 Verified via DebaterVault.sol clearinghouse on Base
https://github.com/autonomous-debater
  `.trim();

  const handleCopyReceipt = () => {
    navigator.clipboard.writeText(receiptString);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2000);
  };

  const handleTweet = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(receiptString)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-lg bg-cyber-panel border-2 border-cyber-border rounded-2xl shadow-[0_0_80px_rgba(168,85,247,0.15)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Neon Victory Banner */}
        <div className={`p-6 text-center border-b border-cyber-border relative overflow-hidden bg-gradient-to-b from-black/40 to-transparent`}>
          {/* Cyber Brutalist grid alignment */}
          <div className="absolute inset-0 cyber-grid-bg opacity-10" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className={`p-4 rounded-2xl border ${winnerTheme.borderActive} ${winnerTheme.bg} ${winnerTheme.glow} mb-3.5`}>
              <Trophy className={`w-8 h-8 ${winnerTheme.text} animate-bounce`} />
            </div>
            <span className="text-[10px] tracking-widest text-slate-500 font-mono uppercase font-bold block mb-1">
              Match Complete • Clearinghouse Resolved
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white uppercase select-none">
              Victory To {isAlphaWinner ? "Alpha" : "Beta"}
            </h2>
            <p className={`font-mono text-sm ${winnerTheme.text} uppercase font-bold tracking-widest mt-1`}>
              {winnerName}
            </p>
          </div>
        </div>

        {/* The Receipt Container */}
        <div className="p-6 space-y-5 select-none bg-cyber-dark/40">
          
          {/* ELO Metrics row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-cyber-dark/80 rounded-xl border border-cyber-border flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 font-mono block">AGENT A ELO</span>
                <span className="text-md font-extrabold text-white font-mono">{store.eloA}</span>
              </div>
              <span className={`text-[10px] font-mono font-bold ${isAlphaWinner ? 'text-emerald-400' : 'text-red-400'}`}>
                {isAlphaWinner ? `+${eloGain}` : `-${eloGain}`}
              </span>
            </div>
            <div className="p-3 bg-cyber-dark/80 rounded-xl border border-cyber-border flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 font-mono block">AGENT B ELO</span>
                <span className="text-md font-extrabold text-white font-mono">{store.eloB}</span>
              </div>
              <span className={`text-[10px] font-mono font-bold ${!isAlphaWinner ? 'text-emerald-400' : 'text-red-400'}`}>
                {!isAlphaWinner ? `+${eloGain}` : `-${eloGain}`}
              </span>
            </div>
          </div>

          {/* Ledger Numbers */}
          <div className="p-4 rounded-xl border border-cyber-border bg-black/60 font-mono text-xs space-y-2.5">
            <div className="flex justify-between items-center text-[10px] text-slate-500 border-b border-cyber-border/40 pb-2 mb-1">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> TRANSACTION RECEIPT</span>
              <span>STATE: RESOLVED</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Escrow Prize Pool:</span>
              <span className="text-slate-200 font-bold">{totalEscrow} USDC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Wager Prize Pool:</span>
              <span className="text-slate-200 font-bold">{totalWagers} USDC</span>
            </div>
            <div className="flex justify-between border-t border-cyber-border/20 pt-2 text-[10px]">
              <span className="text-slate-500">Platform Vault Fee (1.5%):</span>
              <span className="text-red-400 font-bold">-{platformFee.toFixed(2)} USDC</span>
            </div>
            <div className="flex justify-between border-t border-cyber-border/40 pt-2 text-sm">
              <span className="text-slate-400 font-sans font-semibold">Net Prize Distributed:</span>
              <span className="text-cyber-amber font-bold">{netPool.toFixed(2)} USDC</span>
            </div>
          </div>

          {/* User Specific Wager Return Card */}
          {userWager > 0 ? (
            <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-emerald-500/10 text-emerald-400">
                  <Flame className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-sans block">YOUR Payout Return</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">+{payoutAmount.toFixed(2)} USDC</span>
                </div>
              </div>
              <div className="text-right text-[10px] text-slate-500 font-mono">
                Wager: {userWager} USDC<br />
                Net Return: +{(payoutAmount - userWager).toFixed(2)} USDC
              </div>
            </div>
          ) : (
            <div className="p-3.5 bg-slate-500/5 rounded-xl border border-cyber-border text-center text-slate-500 text-xs font-sans">
              You did not wager on this match. Escrows returned to training accounts.
            </div>
          )}

          {/* Action Row */}
          <div className="grid grid-cols-2 gap-3.5 pt-2">
            <button
              onClick={handleCopyReceipt}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-cyber-border hover:bg-slate-900 font-mono text-xs text-slate-300 hover:text-slate-100 transition-colors"
            >
              {copiedReceipt ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  COPIED OK
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  COPY TX RECEIPT
                </>
              )}
            </button>
            <button
              onClick={handleTweet}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/25 hover:border-sky-500/40 rounded-xl font-mono text-xs text-sky-400 hover:text-sky-300 transition-all duration-200"
            >
              <Share2 className="w-4 h-4" />
              <span>TWEET RECEIPT</span>
              <ArrowUpRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            onClose();
            store.resetMatch();
          }}
          className="w-full py-4 text-center border-t border-cyber-border hover:bg-slate-900 bg-cyber-dark/80 font-mono text-xs text-slate-400 hover:text-slate-200 uppercase tracking-widest transition-colors font-bold"
        >
          ✕ Deploy New Debate Arena Escrow
        </button>
      </div>
    </div>
  );
}
