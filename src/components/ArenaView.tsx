"use client";

import { useEffect, useRef, useState } from "react";
import { useDebaterStore } from "../lib/store";
import { THEME } from "../lib/theme";
import { GENESIS_DEBATE_SCRIPT } from "../lib/genesisScript";
import { streamTextRhythmically, streamLLMResponse } from "../lib/llm";
import { Coins, Swords, Check, Flame, Hourglass, Award, Key, ShieldAlert } from "lucide-react";
import confetti from "canvas-confetti";

interface ArenaViewProps {
  playMode: "genesis" | "live";
  liveConfig: {
    topic: string;
    agentA: { provider: any; model: string; persona: string };
    agentB: { provider: any; model: string; persona: string };
  } | null;
  onExit: () => void;
  onShowReceipt: () => void;
}

export default function ArenaView({ playMode, liveConfig, onExit, onShowReceipt }: ArenaViewProps) {
  const store = useDebaterStore();
  const chatBottomRef = useRef<HTMLDivElement>(null);
  
  // Arena State
  const [activeTurnIdx, setActiveTurnIdx] = useState(-1);
  const [isDebating, setIsDebating] = useState(false);
  const [wagerAmount, setWagerAmount] = useState(100);
  const [betSuccess, setBetSuccess] = useState<'agent_a' | 'agent_b' | null>(null);
  
  // Voting Form States
  const [voteSelection, setVoteSelection] = useState<1 | 2>(1);
  const [voteSalt, setVoteSalt] = useState("0x" + Math.random().toString(16).substring(2, 8));

  // Autoscroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [store.messages]);

  // Main Arena Controller Loop
  useEffect(() => {
    if (playMode === "genesis") {
      runGenesisDebate();
    } else if (playMode === "live" && liveConfig) {
      runLiveDebate();
    }
  }, []);

  // ----------------------------------------------------
  // ENGINE A: PRE-COMPILED GENESIS TOURNAMENT STREAMER
  // ----------------------------------------------------
  const runGenesisDebate = async () => {
    setIsDebating(true);
    
    // Step 1: Genesis Init
    const initTurn = GENESIS_DEBATE_SCRIPT[0];
    store.addMessage({
      id: initTurn.id,
      role: initTurn.role,
      senderName: initTurn.senderName,
      content: "",
    });
    store.highlightCode(initTurn.highlightLines, initTurn.contractStateExplainer);
    store.addLedgerLog("vault.enterMatch", initTurn.ledgerDetail, initTurn.ledgerValue, initTurn.highlightLines);

    await streamTextRhythmically(initTurn.content, (acc) => {
      store.updateLastMessage(acc);
    });

    await new Promise((r) => setTimeout(r, 1200));

    // Step 2: Open Betting Pools
    const betOpenTurn = GENESIS_DEBATE_SCRIPT[1];
    store.addMessage({
      id: betOpenTurn.id,
      role: betOpenTurn.role,
      senderName: betOpenTurn.senderName,
      content: "",
    });
    store.highlightCode(betOpenTurn.highlightLines, betOpenTurn.contractStateExplainer);
    store.addLedgerLog("vault.placeBet", betOpenTurn.ledgerDetail, betOpenTurn.ledgerValue, betOpenTurn.highlightLines);

    await streamTextRhythmically(betOpenTurn.content, (acc) => {
      store.updateLastMessage(acc);
    });

    await new Promise((r) => setTimeout(r, 1500));

    // Live Turn Iterations (Turns 2 to 5 are the debate rounds)
    for (let i = 2; i <= 5; i++) {
      const turn = GENESIS_DEBATE_SCRIPT[i];
      
      // Injecting synthetic ledger activity during rounds to show interactive wagers
      store.addMessage({
        id: turn.id,
        role: turn.role,
        senderName: turn.senderName,
        content: "",
      });
      store.highlightCode(turn.highlightLines, turn.contractStateExplainer);
      store.addLedgerLog("vault.placeBet", turn.ledgerDetail, turn.ledgerValue, turn.highlightLines);

      // Increment matching spectator pools dynamically
      if (turn.role === 'agent_a') {
        store.wagerPoolA += 180;
      } else {
        store.wagerPoolB += 200;
      }

      await streamTextRhythmically(turn.content, (acc) => {
        store.updateLastMessage(acc);
      });

      await new Promise((r) => setTimeout(r, 2000));
    }

    // Step 7: Declare turn locks
    const lockTurn = GENESIS_DEBATE_SCRIPT[6];
    store.addMessage({
      id: lockTurn.id,
      role: lockTurn.role,
      senderName: lockTurn.senderName,
      content: "",
    });
    store.lockBetting();

    await streamTextRhythmically(lockTurn.content, (acc) => {
      store.updateLastMessage(acc);
    });

    setIsDebating(false);
    store.setMatchState('voting');
  };

  // ----------------------------------------------------
  // ENGINE B: UNIVERSAL DIRECT STREAMING ENGINE (LIVE LLM)
  // ----------------------------------------------------
  const runLiveDebate = async () => {
    if (!liveConfig) return;
    setIsDebating(true);

    const refereeName = "Consensus Referee";
    
    // Step 1: Initializing Vault Escrow Event
    store.addMessage({
      id: "live_init",
      role: "referee",
      senderName: refereeName,
      content: `🎙️ Live Match escrow initialized for topic: "${liveConfig.topic}". Lock-up fee: ${store.trainerEscrowA} USDC from Agent Trainers A & B.`
    });
    store.highlightCode([84, 98], "Deploying match vault escrow. Spectator wagers are active.");
    store.addLedgerLog("vault.enterMatch", "Locking training collateral escrows", `Escrow: ${store.trainerEscrowA * 2} USDC`, [84, 98]);

    await new Promise((r) => setTimeout(r, 2000));

    // Open Betting Pools
    store.addMessage({
      id: "live_bet_open",
      role: "system",
      senderName: "Base Ledger VM",
      content: "🟢 TRANSACTION CONFIRMED. Match state updated to 'Live'. Spectators may now wager mock USDC into pools A & B."
    });
    store.highlightCode([100, 113], "Wager pools active. Separating trainer collateral from wagers.");
    store.addLedgerLog("vault.placeBet", "Wagering pools open", "State: Live", [100, 113]);

    await new Promise((r) => setTimeout(r, 2000));

    // Debate Prompts Builder
    const round1PromptA = `You are ${liveConfig.agentA.persona}. 
Topic: "${liveConfig.topic}".
Deliver your opening argument. Keep it concise, sharp, and limited to 2-3 sentences. Be punchy!`;

    // Round 1 - Agent A Turn
    store.addMessage({ id: "agent_a_1", role: "agent_a", senderName: "Agent Alpha", content: "..." });
    store.highlightCode([100, 113], "Agent A compiles opening context. Spectators betting active.");
    
    try {
      const respA1 = await streamLLMResponse(
        liveConfig.agentA.provider,
        liveConfig.agentA.model,
        round1PromptA,
        store.apiKeys,
        (acc) => store.updateLastMessage(acc)
      );
      
      // Seed dynamic betting
      store.wagerPoolA += 120;
      store.addLedgerLog("vault.placeBet", "Spectator wagered on Alpha", "Amount: +120 USDC", [100, 113]);
      
      await new Promise((r) => setTimeout(r, 2000));

      // Round 1 - Agent B Turn
      const round1PromptB = `You are ${liveConfig.agentB.persona}. 
Topic: "${liveConfig.topic}".
Agent Alpha just argued: "${respA1}".
Deliver your opening statement, directly rebutting their claims. Limit your response to 2-3 socratic sentences.`;

      store.addMessage({ id: "agent_b_1", role: "agent_b", senderName: "Agent Beta", content: "..." });
      store.highlightCode([100, 113], "Agent B is formulating a counter-argument. Spectators betting active.");
      
      const respB1 = await streamLLMResponse(
        liveConfig.agentB.provider,
        liveConfig.agentB.model,
        round1PromptB,
        store.apiKeys,
        (acc) => store.updateLastMessage(acc)
      );

      store.wagerPoolB += 150;
      store.addLedgerLog("vault.placeBet", "Spectator wagered on Beta", "Amount: +150 USDC", [100, 113]);

      await new Promise((r) => setTimeout(r, 2000));

      // Round 2 - Agent A Rebuttal
      const round2PromptA = `You are ${liveConfig.agentA.persona}.
Topic: "${liveConfig.topic}".
Agent Beta argued: "${respB1}".
Deliver your final, absolute socratic rebuttal. Lock down your argument in 2-3 sentences.`;

      store.addMessage({ id: "agent_a_2", role: "agent_a", senderName: "Agent Alpha", content: "..." });
      store.highlightCode([100, 113], "Agent A compiles final rebuttal context.");

      const respA2 = await streamLLMResponse(
        liveConfig.agentA.provider,
        liveConfig.agentA.model,
        round2PromptA,
        store.apiKeys,
        (acc) => store.updateLastMessage(acc)
      );

      store.wagerPoolA += 210;
      store.addLedgerLog("vault.placeBet", "Spectator wagered on Alpha", "Amount: +210 USDC", [100, 113]);

      await new Promise((r) => setTimeout(r, 2000));

      // Round 2 - Agent B Rebuttal
      const round2PromptB = `You are ${liveConfig.agentB.persona}.
Topic: "${liveConfig.topic}".
Agent Alpha final rebuttal: "${respA2}".
Deliver your absolute socratic closing argument. Finalize your defense in 2-3 sentences.`;

      store.addMessage({ id: "agent_b_2", role: "agent_b", senderName: "Agent Beta", content: "..." });
      store.highlightCode([100, 113], "Agent B compiles final closing statement.");

      await streamLLMResponse(
        liveConfig.agentB.provider,
        liveConfig.agentB.model,
        round2PromptB,
        store.apiKeys,
        (acc) => store.updateLastMessage(acc)
      );

      store.wagerPoolB += 240;
      store.addLedgerLog("vault.placeBet", "Spectator wagered on Beta", "Amount: +240 USDC", [100, 113]);

      await new Promise((r) => setTimeout(r, 2500));

    } catch (e: any) {
      store.addMessage({
        id: "error",
        role: "system",
        senderName: "Arena System Exception",
        content: `❌ LLM Streaming turn failed: ${e.message}. Falling back to visual voting sandbox.`
      });
    }

    // Step 3: Turn Locks
    store.addMessage({
      id: "live_lock",
      role: "referee",
      senderName: refereeName,
      content: "🔔 The Live debate turns have finalized. Turn lock command transmitted to the clearinghouse. Betting is frozen."
    });
    store.lockBetting();
    
    setIsDebating(false);
    store.setMatchState('voting');
  };

  // ----------------------------------------------------
  // SPECTATOR ON-CHAIN STATE INTERACTIONS
  // ----------------------------------------------------
  const handlePlaceBet = (agentId: 'agent_a' | 'agent_b') => {
    const success = store.placeWager(agentId, wagerAmount);
    if (success) {
      setBetSuccess(agentId);
      setTimeout(() => setBetSuccess(null), 1500);
      confetti({
        particleCount: 20,
        spread: 30,
        colors: agentId === 'agent_a' ? ["#a855f7"] : ["#3b82f6"]
      });
    } else {
      alert("Insufficient mock USDC balance. Check your key parameters or reset match.");
    }
  };

  const handleCommitVote = () => {
    store.commitVote(voteSelection, voteSalt);
  };

  const handleRevealVote = () => {
    store.revealVote();
  };

  const handleResolveMatch = () => {
    store.resolveMatch();
    onShowReceipt();
  };

  // Percent ratios for visual progress
  const totalWagersCount = store.wagerPoolA + store.wagerPoolB;
  const ratioA = totalWagersCount > 0 ? (store.wagerPoolA / totalWagersCount) * 100 : 50;
  const ratioB = totalWagersCount > 0 ? (store.wagerPoolB / totalWagersCount) * 100 : 50;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-in fade-in duration-300 h-full max-h-[85vh]">
      
      {/* Colosseum Chat Panel (Spans 2 columns) */}
      <div className="lg:col-span-2 flex flex-col h-full bg-cyber-panel border border-cyber-border rounded-xl overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
        
        {/* Banner Title */}
        <div className="px-5 py-4 bg-cyber-dark/80 border-b border-cyber-border flex justify-between items-center select-none">
          <div className="min-w-0">
            <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase font-bold block mb-0.5">
              Arena Active Arena Match
            </span>
            <h2 className="text-sm font-black text-white uppercase truncate font-mono">
              ⚔️ {store.topic}
            </h2>
          </div>
          <button
            onClick={() => {
              store.resetMatch();
              onExit();
            }}
            className="px-3 py-1 border border-cyber-border hover:bg-slate-900 text-[10px] font-mono text-slate-500 hover:text-slate-200 uppercase rounded"
          >
            ✕ LEAVE ARENA
          </button>
        </div>

        {/* Message Feed list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-cyber-dark/20 min-h-[300px]">
          {store.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-600 font-mono py-12">
              <Hourglass className="w-6 h-6 text-slate-600 animate-spin mb-3" />
              <span className="text-xs uppercase tracking-widest">[LOADING AUTONOMOUS PIPELINE]</span>
            </div>
          ) : (
            store.messages.map((msg) => {
              let theme = THEME.referee;
              if (msg.role === 'agent_a') theme = THEME.agent_a;
              if (msg.role === 'agent_b') theme = THEME.agent_b;
              if (msg.role === 'system') theme = { ...THEME.referee, text: "text-slate-400 font-semibold" };

              return (
                <div
                  key={msg.id}
                  className={`p-3.5 rounded-xl border transition-all duration-200 ${theme.border} ${theme.bg} ${
                    msg.content === "..." ? "animate-pulse" : ""
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] font-mono mb-1.5 pb-1 border-b border-cyber-border/10 select-none">
                    <span className={`font-black uppercase tracking-wider ${theme.text}`}>
                      {msg.senderName}
                    </span>
                    <span className="text-slate-600">STATE: MUTABLE</span>
                  </div>
                  <p className="text-slate-100 text-xs font-sans leading-relaxed whitespace-pre-wrap select-text">
                    {msg.content}
                    {msg.content === "..." && (
                      <span className="inline-block w-1.5 h-3 bg-cyber-amber animate-terminal-cursor ml-1"></span>
                    )}
                  </p>
                </div>
              );
            })
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Inline Live Indicator */}
        {isDebating && (
          <div className="px-5 py-2.5 bg-black/60 border-t border-cyber-border/80 flex items-center justify-between text-[10px] text-slate-500 font-mono select-none">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-cyber-purple animate-ping"></span>
              <span>Training agents compiling turns...</span>
            </span>
            <span>BASE HIGH-CADENCE TIMEOUT: SAFE</span>
          </div>
        )}
      </div>

      {/* Betting Slips & State controls Panel (1 column) */}
      <div className="flex flex-col h-full space-y-4">
        
        {/* Betting Slip Module */}
        <div className="p-4 bg-cyber-panel border border-cyber-border rounded-xl space-y-4 shadow-md">
          <div className="flex justify-between items-center select-none border-b border-cyber-border/40 pb-2">
            <span className="text-[10px] text-slate-400 font-mono font-bold tracking-widest uppercase block">
              Spectator Wagering Slips
            </span>
            <div className="flex items-center gap-1 text-[9px] text-cyber-amber font-mono bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
              <Coins className="w-3.5 h-3.5" />
              <span>USDC POOLS</span>
            </div>
          </div>

          {/* Dynamic Pool Share Bar */}
          <div className="space-y-1 select-none">
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span className="text-cyber-purple font-bold">Alpha: {ratioA.toFixed(0)}%</span>
              <span className="text-cyber-blue font-bold">Beta: {ratioB.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-cyber-dark rounded-full overflow-hidden flex">
              <div className="bg-cyber-purple transition-all duration-300" style={{ width: `${ratioA}%` }} />
              <div className="bg-cyber-blue transition-all duration-300" style={{ width: `${ratioB}%` }} />
            </div>
            <div className="flex justify-between text-[9px] text-slate-600 font-mono">
              <span>{store.wagerPoolA} USDC</span>
              <span>{store.wagerPoolB} USDC</span>
            </div>
          </div>

          {/* Slider input */}
          {store.matchState === 'live' ? (
            <div className="space-y-3">
              <div className="space-y-1.5 select-none">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Wager Amount</span>
                  <span className="text-cyber-amber font-bold">{wagerAmount} USDC</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="1000"
                  step="10"
                  value={wagerAmount}
                  onChange={(e) => setWagerAmount(parseInt(e.target.value))}
                  className="w-full accent-cyber-amber bg-cyber-dark h-1.5 rounded cursor-pointer border border-cyber-border"
                />
              </div>

              {/* Action Wager triggers */}
              <div className="flex gap-2">
                <button
                  onClick={() => handlePlaceBet('agent_a')}
                  className={`flex-1 flex items-center justify-center gap-1 py-3 bg-cyber-purple/10 hover:bg-cyber-purple hover:text-black border border-cyber-purple/40 hover:border-transparent rounded-lg font-mono text-xs font-extrabold uppercase tracking-wider text-cyber-purple transition-all duration-150 cursor-pointer`}
                >
                  {betSuccess === 'agent_a' ? <Check className="w-3.5 h-3.5" /> : "Bet Alpha"}
                </button>
                <button
                  onClick={() => handlePlaceBet('agent_b')}
                  className={`flex-1 flex items-center justify-center gap-1 py-3 bg-cyber-blue/10 hover:bg-cyber-blue hover:text-black border border-cyber-blue/40 hover:border-transparent rounded-lg font-mono text-xs font-extrabold uppercase tracking-wider text-cyber-blue transition-all duration-150 cursor-pointer`}
                >
                  {betSuccess === 'agent_b' ? <Check className="w-3.5 h-3.5" /> : "Bet Beta"}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-black/60 rounded-lg border border-cyber-border/40 text-center select-none">
              <span className="text-[10px] font-mono font-bold text-red-400 tracking-widest uppercase block">
                🔒 WAGERING POOLS LOCKED
              </span>
              <p className="text-[10px] font-sans text-slate-500 mt-1 leading-relaxed">
                Turns have closed. Vault smart contract locked bets to prevent front-running quorum outcomes.
              </p>
            </div>
          )}
        </div>

        {/* Smart Clearinghouse Voting / Reveal Module */}
        <div className="flex-1 p-4 bg-cyber-panel border border-cyber-border rounded-xl space-y-4 flex flex-col justify-between shadow-md">
          <div className="space-y-4">
            <div className="flex justify-between items-center select-none border-b border-cyber-border/40 pb-2">
              <span className="text-[10px] text-slate-400 font-mono font-bold tracking-widest uppercase block">
                Smart Consensus Vault Quorum
              </span>
              <span className="text-[9px] text-cyber-purple font-mono bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 rounded uppercase">
                {store.matchState}
              </span>
            </div>

            {/* Voting Commitment Controls */}
            {store.matchState === 'voting' && (
              <div className="space-y-3.5 animate-in fade-in duration-200">
                {!store.hasCommitted ? (
                  <div className="space-y-3">
                    <span className="text-[11px] text-slate-400 font-sans block leading-relaxed select-none">
                      Cast your blind encrypted vote based on agent arguments quality:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setVoteSelection(1)}
                        className={`py-2 text-xs font-mono border rounded ${
                          voteSelection === 1
                            ? "bg-cyber-purple/10 border-cyber-purple text-cyber-purple"
                            : "bg-black/20 border-cyber-border text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        Alpha (A)
                      </button>
                      <button
                        onClick={() => setVoteSelection(2)}
                        className={`py-2 text-xs font-mono border rounded ${
                          voteSelection === 2
                            ? "bg-cyber-blue/10 border-cyber-blue text-cyber-blue"
                            : "bg-black/20 border-cyber-border text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        Beta (B)
                      </button>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 block">Secret Commits Salt</label>
                      <input
                        type="text"
                        value={voteSalt}
                        onChange={(e) => setVoteSalt(e.target.value)}
                        className="w-full bg-cyber-dark border border-cyber-border outline-none rounded p-1.5 text-xs text-slate-300 font-mono"
                      />
                    </div>
                    <button
                      onClick={handleCommitVote}
                      className="w-full py-2 bg-cyber-amber hover:bg-amber-500 text-black font-mono text-xs font-bold uppercase rounded-lg transition-colors cursor-pointer"
                    >
                      Commit Blind Vote Hash
                    </button>
                  </div>
                ) : !store.hasRevealed ? (
                  <div className="space-y-3 p-3 bg-black/40 rounded border border-cyber-border/40 select-none">
                    <div className="flex gap-2 items-start">
                      <Hourglass className="w-4 h-4 text-cyber-amber shrink-0 animate-spin mt-0.5" />
                      <div>
                        <span className="text-xs text-slate-200 font-semibold block uppercase font-mono">
                          Commit Hash Registered
                        </span>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-sans mt-0.5">
                          You committed vote hash based selection to the vault. Reveal salt payload to verify.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRevealVote}
                      className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase rounded-lg transition-colors cursor-pointer"
                    >
                      Reveal Cryptographic Salt
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-500/5 rounded border border-emerald-500/20 space-y-1.5 select-none text-center animate-in zoom-in-95">
                    <span className="text-xs font-bold text-emerald-400 font-mono uppercase block">
                      ✓ Vote Successfully Revealed
                    </span>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                      Verified selection: Agent {store.userVoteSelection === 1 ? 'Alpha' : 'Beta'}. Quorum thresholds met.
                    </p>
                  </div>
                )}

                {/* Quorum Progress indicators */}
                {store.totalRevealedVotes > 0 && (
                  <div className="space-y-1 text-[10px] font-mono select-none pt-2.5 border-t border-cyber-border/20">
                    <div className="flex justify-between text-slate-400">
                      <span>Quorum Progress:</span>
                      <span className="text-emerald-400 font-bold">{store.totalRevealedVotes} verified</span>
                    </div>
                    <div className="h-1.5 bg-cyber-dark rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 animate-pulse" style={{ width: `${Math.min(100, (store.totalRevealedVotes / 3) * 100)}%` }} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Inactive lobby stage */}
            {store.matchState === 'lobby' && (
              <div className="text-center text-slate-600 text-xs font-sans py-8 select-none">
                Deploy debate escrow in the lobby panel to begin.
              </div>
            )}

            {/* Live streaming turns stage */}
            {store.matchState === 'live' && (
              <div className="text-center text-slate-500 font-sans text-xs space-y-2 select-none py-8">
                <Hourglass className="w-5 h-5 text-slate-500 animate-spin mx-auto" />
                <p className="leading-relaxed">
                  Watching debate rounds. Lock bets to trigger the commit-reveal consensus quorum.
                </p>
              </div>
            )}
          </div>

          {/* Smart Resolution Release trigger */}
          {store.matchState === 'voting' && store.hasRevealed && (
            <button
              onClick={handleResolveMatch}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-black font-mono text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all duration-200 cursor-pointer shadow-lg shadow-emerald-500/10 animate-pulse"
            >
              Resolve Vault Smart Escrow
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
