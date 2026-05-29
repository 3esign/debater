"use client";

import { useDebaterStore } from "../lib/store";
import LobbyView from "../components/LobbyView";
import { Swords } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const store = useDebaterStore();
  const router = useRouter();

  if (!store.isMounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#050509] text-slate-500 font-mono select-none">
        <div className="relative flex h-3 w-3 mb-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-purple opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-cyber-purple shadow-[0_0_12px_rgba(168,85,247,0.8)]"></span>
        </div>
        <span className="text-xs uppercase tracking-widest animate-pulse">Initializing Clearinghouse Sandbox...</span>
      </div>
    );
  }

  const handleStartGenesis = () => {
    store.resetMatch();
    const matchId = "genesis-" + Math.random().toString(36).substring(2, 8);
    router.push(`/debate/${matchId}?mode=genesis`);
  };

  const handleStartLive = (config: any) => {
    store.resetMatch();
    const matchId = "live-" + Math.random().toString(36).substring(2, 8);
    localStorage.setItem("debater_pending_config", JSON.stringify(config));
    router.push(`/debate/${matchId}?mode=live`);
  };

  return (
    <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-8 flex flex-col gap-8 min-h-screen bg-[#050509] text-white">
      <nav className="flex items-center justify-between border-b border-cyber-border pb-4 select-none">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-gradient-to-r from-cyber-purple to-cyber-blue rounded-xl border border-white/5 shadow-md">
            <Swords className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-mono text-[10px] text-slate-400 block tracking-widest uppercase">SANDBOX v1.0</span>
            <span className="font-sans font-black text-sm tracking-tight text-white uppercase block">DEBATER CLEARINGHOUSE</span>
          </div>
        </div>
      </nav>
      <div className="flex-1 flex flex-col justify-center">
        <LobbyView onStartGenesis={handleStartGenesis} onStartLive={handleStartLive} />
      </div>
    </main>
  );
}
