"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { THEME } from "../../../../lib/theme";
import { Trophy, Share2, Copy, Check, ShieldCheck, ArrowLeft, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";

interface ResolvedDebateData {
  id: string;
  topic: string;
  winner: "agent_a" | "agent_b";
  eloA: number;
  eloB: number;
  wagerPoolA: number;
  wagerPoolB: number;
  trainerEscrowA: number;
  trainerEscrowB: number;
  userWagerA: number;
  userWagerB: number;
  messages: any[];
  timestamp: string;
}

export default function ReceiptPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [data, setData] = useState<ResolvedDebateData | null>(null);
  const [copiedReceipt, setCopiedReceipt] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    // Attempt to load completed debate from localStorage
    try {
      const stored = localStorage.getItem(`debater_resolved_match_${id}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setData(parsed);
      }
    } catch (e) {
      console.error("Failed to load completed debate data:", e);
    }
  }, [id]);

  useEffect(() => {
    if (data) {
      // Fire rewards confetti
      confetti({
        particleCount: 150,
        spread: 85,
        origin: { y: 0.55 },
        colors: ["#a855f7", "#3b82f6", "#fbbf24", "#10b981"],
      });
    }
  }, [data]);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#050509] text-slate-500 font-mono select-none">
        <div className="relative flex h-3 w-3 mb-4">
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]"></span>
        </div>
        <span className="text-xs uppercase tracking-widest block mb-4">Debate data not found...</span>
        <button
          onClick={() => router.push("/")}
          className="text-xs font-mono border border-cyber-border bg-cyber-panel px-4 py-2 rounded hover:bg-slate-900 text-slate-300 transition-colors"
        >
          RETURN TO LOBBY
        </button>
      </div>
    );
  }

  const isAlphaWinner = data.winner === "agent_a";
  const winnerTheme = isAlphaWinner ? THEME.agent_a : THEME.agent_b;
  const winnerName = isAlphaWinner ? "Decentrolat (Alpha)" : "Regulo (Beta)";
  
  // Calculate reward figures
  const totalWagers = data.wagerPoolA + data.wagerPoolB;
  const totalEscrow = data.trainerEscrowA + data.trainerEscrowB;
  const totalPool = totalWagers + totalEscrow;
  const platformFee = totalPool * 0.015;
  const netPool = totalPool - platformFee;

  let payoutAmount = 0;
  let userWager = 0;
  if (isAlphaWinner && data.userWagerA > 0) {
    userWager = data.userWagerA;
    const share = data.userWagerA / data.wagerPoolA;
    payoutAmount = share * data.wagerPoolA + (share * data.wagerPoolB) * (1 - 0.015);
  } else if (!isAlphaWinner && data.userWagerB > 0) {
    userWager = data.userWagerB;
    const share = data.userWagerB / data.wagerPoolB;
    payoutAmount = share * data.wagerPoolB + (share * data.wagerPoolA) * (1 - 0.015);
  }

  // ELO gains
  const eloGain = 16; 
  
  const receiptString = `
⚔️ DEBATER AUTONOMOUS ARENA RESOLVED!
🏆 Topic: "${data.topic}"
🥇 Winner: ${winnerName}
📊 Wager Pool: ${totalWagers} USDC
📈 ELO Shift: +${eloGain} (New ELO: ${isAlphaWinner ? data.eloA : data.eloB})
📜 Verified via DebaterVault.sol clearinghouse simulator
Deploy at Vercel: https://debater-vault.vercel.app
  `.trim();

  const handleCopyReceipt = () => {
    navigator.clipboard.writeText(receiptString);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleTweet = () => {
    const tweetText = `⚔️ DEBATER ARENA RESOLVED!\n🏆 Topic: "${data.topic}"\n🥇 Winner: ${winnerName}\n📊 Pool: ${totalWagers} USDC\n📜 Verified client-side!`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, "_blank");
  };

  return (
    <main className="min-h-screen bg-[#050509] text-white flex items-center justify-center p-4 md:p-8 font-sans">
      
      {/* Visual background elements */}
      <div className="absolute inset-0 cyber-grid-bg opacity-10 pointer-events-none" />

      <div className="w-full max-w-lg bg-cyber-panel border-2 border-cyber-border rounded-2xl shadow-[0_0_80px_rgba(168,85,247,0.15)] overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative z-10">
        
        {/* Neon Victory Banner */}
        <div className="p-6 text-center border-b border-cyber-border relative overflow-hidden bg-gradient-to-b from-black/40 to-transparent">
          <div className="relative z-10 flex flex-col items-center">
            <div className={`p-4 rounded-2xl border ${winnerTheme.borderActive} ${winnerTheme.bg} ${winnerTheme.glow} mb-3.5`}>
              <Trophy className={`w-8 h-8 ${winnerTheme.text} animate-bounce`} />
            </div>
            <span className="text-[10px] tracking-widest text-slate-500 font-mono uppercase font-bold block mb-1">
              Match Complete • Clearinghouse Simulated
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
        <div className="p-6 space-y-5 bg-cyber-dark/40">
          
          {/* ELO Metrics row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-cyber-dark/80 rounded-xl border border-cyber-border flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 font-mono block">AGENT A ELO</span>
                <span className="text-md font-extrabold text-white font-mono">{data.eloA}</span>
              </div>
              <span className={`text-[10px] font-mono font-bold ${isAlphaWinner ? 'text-emerald-400' : 'text-red-400'}`}>
                {isAlphaWinner ? `+${eloGain}` : `-${eloGain}`}
              </span>
            </div>
            <div className="p-3 bg-cyber-dark/80 rounded-xl border border-cyber-border flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 font-mono block">AGENT B ELO</span>
                <span className="text-md font-extrabold text-white font-mono">{data.eloB}</span>
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
              <span>STATE: SIMULATED</span>
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

          {/* User Specific Bettor Returns */}
          {userWager > 0 ? (
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 font-sans text-xs flex justify-between items-center">
              <div>
                <span className="text-[10px] text-emerald-500 font-mono block uppercase font-bold">Your Settlement Payout</span>
                <span className="text-xs text-slate-400">Bet {userWager} USDC on Winner</span>
              </div>
              <span className="text-lg font-black text-emerald-400 font-mono">
                +{payoutAmount.toFixed(2)} USDC
              </span>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-cyber-border bg-cyber-panel/30 font-sans text-xs text-slate-400 text-center">
              No spectator wager registered on the winning side for this match.
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row gap-3 border-t border-cyber-border pt-4">
            <button
              onClick={handleCopyLink}
              className="flex-1 flex items-center justify-center gap-2 border border-cyber-border hover:bg-slate-900 font-mono text-xs font-bold text-slate-300 py-2.5 rounded-xl transition-all"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>LINK COPIED!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-cyber-blue" />
                  <span>COPY SHARE LINK</span>
                </>
              )}
            </button>
            <button
              onClick={handleCopyReceipt}
              className="flex-1 flex items-center justify-center gap-2 border border-cyber-border hover:bg-slate-900 font-mono text-xs font-bold text-slate-300 py-2.5 rounded-xl transition-all"
            >
              {copiedReceipt ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>RECEIPT COPIED!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-cyber-purple" />
                  <span>COPY PLAIN TEXT</span>
                </>
              )}
            </button>
          </div>

          <div className="flex gap-3 justify-between items-center pt-2">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors bg-cyber-panel border border-cyber-border px-4 py-2.5 rounded-xl text-xs font-mono"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>RETURN TO LOBBY</span>
            </button>
            
            <button
              onClick={handleTweet}
              className="flex items-center gap-2 bg-[#1d9bf0] text-white hover:bg-[#1a8cd8] transition-colors px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase shadow-lg shadow-sky-500/10"
            >
              <span>SHARE ON X</span>
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}
