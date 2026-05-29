"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useDebaterStore } from "../../../lib/store";
import ArenaView from "../../../components/ArenaView";
import SolidityViewer from "../../../components/SolidityViewer";
import LedgerTerminal from "../../../components/LedgerTerminal";
import { Swords, Eye, ArrowLeft } from "lucide-react";

export default function DebateArenaPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const store = useDebaterStore();

  const id = params.id as string;
  const playMode = searchParams.get("mode") === "live" ? "live" : "genesis";

  const [liveConfig, setLiveConfig] = useState<{
    topic: string;
    agentA: { provider: string; model: string; persona: string };
    agentB: { provider: string; model: string; persona: string };
  } | null>(null);

  useEffect(() => {
    if (!store.isMounted) return;

    if (playMode === "live") {
      // Load live configuration from localStorage or query params
      try {
        const cachedConfig = localStorage.getItem("debater_pending_config");
        if (cachedConfig) {
          setLiveConfig(JSON.parse(cachedConfig));
        } else {
          // Fallback if no configuration is found
          setLiveConfig({
            topic: decodeURIComponent(searchParams.get("topic") || "Decentralization vs. Regulation"),
            agentA: {
              provider: searchParams.get("a_prov") || "gemini",
              model: searchParams.get("a_mod") || "gemini-1.5-flash",
              persona: searchParams.get("a_pers") || "You are a progressive Keynesian economist.",
            },
            agentB: {
              provider: searchParams.get("b_prov") || "openrouter",
              model: searchParams.get("b_mod") || "meta-llama/llama-3-8b-instruct",
              persona: searchParams.get("b_pers") || "You are a staunch libertarian economist.",
            },
          });
        }
      } catch (e) {
        console.error("Failed to parse debate live configuration:", e);
      }
    } else {
      // Genesis mode
      store.setTopic("Decentralization vs. Regulation");
    }

    // Set store state to live
    store.setMatchState("live");
  }, [store.isMounted, playMode, searchParams]);

  // Hydration safety check
  if (!store.isMounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#050509] text-slate-500 font-mono select-none">
        <div className="relative flex h-3 w-3 mb-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-purple opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-cyber-purple shadow-[0_0_12px_rgba(168,85,247,0.8)]"></span>
        </div>
        <span className="text-xs uppercase tracking-widest animate-pulse">Initializing Arena Stage...</span>
      </div>
    );
  }

  const handleExit = () => {
    store.resetMatch();
    localStorage.removeItem("debater_pending_config");
    router.push("/");
  };

  const handleShowReceipt = () => {
    // Save debate outcome in local storage history before redirecting to ensure receipt page has access
    const debateData = {
      id,
      topic: store.topic,
      winner: store.winner,
      eloA: store.eloA,
      eloB: store.eloB,
      wagerPoolA: store.wagerPoolA,
      wagerPoolB: store.wagerPoolB,
      trainerEscrowA: store.trainerEscrowA,
      trainerEscrowB: store.trainerEscrowB,
      userWagerA: store.userWagerA,
      userWagerB: store.userWagerB,
      messages: store.messages,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(`debater_resolved_match_${id}`, JSON.stringify(debateData));

    router.push(`/debate/${id}/receipt`);
  };

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 flex flex-col gap-6 md:gap-8 min-h-screen bg-[#050509] text-white">
      {/* Visual Navigation Bar */}
      <nav className="flex items-center justify-between border-b border-cyber-border pb-4 select-none">
        <div className="flex items-center gap-4">
          <button
            onClick={handleExit}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors bg-cyber-panel border border-cyber-border px-3 py-1.5 rounded-lg text-xs font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>EXIT TO LOBBY</span>
          </button>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-r from-cyber-purple to-cyber-blue rounded-xl border border-white/5 shadow-md">
              <Swords className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-mono text-[10px] text-slate-400 block tracking-widest uppercase">
                ARENA MATCH #{id.substring(0, 8).toUpperCase()}
              </span>
              <span className="font-sans font-black text-xs tracking-tight text-white uppercase block">
                DEBATER CLEARINGHOUSE
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-400 bg-cyber-panel border border-cyber-border px-3 py-1.5 rounded-lg">
            <Eye className="w-3.5 h-3.5 text-cyber-blue" />
            <span>SOL: HIGH-ACTIVE</span>
          </div>
        </div>
      </nav>

      {/* Main Split-Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8 flex-1 min-h-[500px]">
        {/* Left Side: Live Colosseum Arena (3 columns) */}
        <div className="lg:col-span-3 flex flex-col h-full">
          <ArenaView
            playMode={playMode}
            liveConfig={liveConfig}
            onExit={handleExit}
            onShowReceipt={handleShowReceipt}
          />
        </div>

        {/* Right Side: Glowing Smart Contract Sandbox (2 columns) */}
        <div className="lg:col-span-2 flex flex-col gap-6 h-full min-h-[600px] lg:min-h-0 select-none">
          <div className="flex-1 min-h-[350px]">
            <SolidityViewer />
          </div>
          <div className="h-[280px]">
            <LedgerTerminal />
          </div>
        </div>
      </div>
    </main>
  );
}
