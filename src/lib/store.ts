import { APIKeys, LedgerLog, MatchState, Message, VotePhase } from "./types";
import { CONFIG } from "./config";

class DebaterStore {
  private listeners = new Set<() => void>();

  // Core App State
  public isMounted = false;
  public balance = CONFIG.sandbox.initialUSDCBalance;
  public eloA = CONFIG.sandbox.defaultElo;
  public eloB = CONFIG.sandbox.defaultElo;
  public apiKeys: APIKeys = { ollamaUrl: "http://localhost:11434" };
  public walletAddress: string | null = null;
  public feeCollectorWallet = "0x8b81C548C08C32D391F6007281838cD8d001105D";
  public accumulatedFeesUSDC = 0;

  // Match State
  public matchState: MatchState = 'lobby';
  public votePhase: VotePhase = 'idle';
  public topic = "Decentralization vs. Regulation";
  
  public messages: Message[] = [];
  public ledgerLogs: LedgerLog[] = [];
  
  // Highlight system for Solidity Viewer
  public activeHighlightLines: [number, number] | null = null;
  public activeExplainer = "Vault is idle. Feed autonomous agent training escrow parameters in the lobby to deploy.";

  // Escrow & Wager states
  public trainerEscrowA = 250;
  public trainerEscrowB = 250;
  public wagerPoolA = 0;
  public wagerPoolB = 0;
  
  // User's personal wagers
  public userWagerA = 0;
  public userWagerB = 0;

  // Commit-Reveal Voting states
  public userVoteSelection: 1 | 2 | null = null;
  public userVoteSalt = "";
  public hasCommitted = false;
  public hasRevealed = false;
  public voteCountA = 0;
  public voteCountB = 0;
  public totalRevealedVotes = 0;
  
  // Resolution
  public winner: 'agent_a' | 'agent_b' | null = null;
  public currentBlockNumber = 19485002;

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadFromLocalStorage();
    }
  }

  // Pub/Sub
  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public notify() {
    this.listeners.forEach((l) => l());
  }

  // Hydration helper
  public mount() {
    this.isMounted = true;
    this.loadFromLocalStorage();
    this.notify();
  }

  // LocalStorage Persistance
  private loadFromLocalStorage() {
    try {
      const savedBalance = localStorage.getItem("debater_balance");
      if (savedBalance) this.balance = parseFloat(savedBalance);

      const savedEloA = localStorage.getItem("debater_elo_a");
      if (savedEloA) this.eloA = parseInt(savedEloA, 10);

      const savedEloB = localStorage.getItem("debater_elo_b");
      if (savedEloB) this.eloB = parseInt(savedEloB, 10);

      const savedKeys = localStorage.getItem("debater_api_keys");
      if (savedKeys) this.apiKeys = JSON.parse(savedKeys);

      const savedWallet = localStorage.getItem("debater_wallet_address");
      if (savedWallet) this.walletAddress = savedWallet;

      const savedFees = localStorage.getItem("debater_accumulated_fees");
      if (savedFees) this.accumulatedFeesUSDC = parseFloat(savedFees);
    } catch (e) {
      console.error("Failed loading local storage state:", e);
    }
  }

  public saveToLocalStorage() {
    try {
      localStorage.setItem("debater_balance", this.balance.toFixed(2));
      localStorage.setItem("debater_elo_a", this.eloA.toString());
      localStorage.setItem("debater_elo_b", this.eloB.toString());
      localStorage.setItem("debater_api_keys", JSON.stringify(this.apiKeys));
      if (this.walletAddress) {
        localStorage.setItem("debater_wallet_address", this.walletAddress);
      } else {
        localStorage.removeItem("debater_wallet_address");
      }
      localStorage.setItem("debater_accumulated_fees", this.accumulatedFeesUSDC.toString());
    } catch (e) {
      console.error("Failed saving local storage state:", e);
    }
  }

  // Key operations
  public setApiKeys(keys: APIKeys) {
    this.apiKeys = { ...this.apiKeys, ...keys };
    this.saveToLocalStorage();
    this.notify();
  }

  // Wallet operations
  public connectWallet(address: string) {
    this.walletAddress = address;
    this.saveToLocalStorage();
    this.notify();
  }

  public disconnectWallet() {
    this.walletAddress = null;
    this.saveToLocalStorage();
    this.notify();
  }

  // State mutators
  public setTopic(newTopic: string) {
    this.topic = newTopic;
    this.notify();
  }

  public setMatchState(state: MatchState) {
    this.matchState = state;
    this.notify();
  }

  public highlightCode(lines: [number, number] | null, explainer: string) {
    this.activeHighlightLines = lines;
    this.activeExplainer = explainer;
    this.notify();
  }

  public addMessage(msg: Omit<Message, 'timestamp'> & { timestamp?: string }) {
    const fullMsg: Message = {
      timestamp: msg.timestamp || new Date().toLocaleTimeString(),
      ...msg,
    };
    this.messages = [...this.messages, fullMsg];
    this.notify();
  }

  public updateLastMessage(content: string) {
    if (this.messages.length === 0) return;
    const updated = [...this.messages];
    updated[updated.length - 1] = {
      ...updated[updated.length - 1],
      content,
    };
    this.messages = updated;
    this.notify();
  }

  // Simulated Base blockchain logger
  public addLedgerLog(action: string, detail: string, valueText?: string, lineHighlightRange?: [number, number]) {
    this.currentBlockNumber += Math.floor(Math.random() * 3) + 1;
    const randomHex = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const log: LedgerLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      blockNumber: this.currentBlockNumber,
      txHash: randomHex,
      action,
      detail,
      valueText,
      lineHighlightRange
    };
    this.ledgerLogs = [log, ...this.ledgerLogs];
    this.notify();
  }

  // Match Escrow Lock (Trainer Entry)
  public enterEscrow() {
    this.matchState = 'live';
    this.addLedgerLog(
      "vault.enterMatch",
      `Escrow fees locked for trainerAlpha and trainerBeta`,
      `Locked Escrow: ${this.trainerEscrowA + this.trainerEscrowB} USDC`,
      [84, 98]
    );
    this.highlightCode([84, 98], "Vault locks training collateral into smart contract escrow. Spectators are now invited to wager pools.");
  }

  // Placed Bets
  public placeWager(agentId: 'agent_a' | 'agent_b', amount: number) {
    if (this.balance < amount) return false;
    
    this.balance -= amount;
    if (agentId === 'agent_a') {
      this.wagerPoolA += amount;
      this.userWagerA += amount;
    } else {
      this.wagerPoolB += amount;
      this.userWagerB += amount;
    }
    
    this.saveToLocalStorage();
    
    this.addLedgerLog(
      "vault.placeBet",
      `Spectator placed bet on Agent ${agentId === 'agent_a' ? 'A' : 'B'}`,
      `Amount: ${amount} USDC`,
      [100, 113]
    );

    this.highlightCode(
      [100, 113],
      `Wager placed on ${agentId === 'agent_a' ? 'Alpha' : 'Beta'}. Vault separates trainers from spectator wagers to secure payouts.`
    );
    return true;
  }

  // Lock Betting Pools
  public lockBetting() {
    this.votePhase = 'idle';
    this.addLedgerLog(
      "vault.lockBetting",
      "Referee declared turns finalized. Betting pools locked.",
      "Locked Pools A & B",
      [115, 119]
    );
    this.highlightCode([115, 119], "Wagers are permanently locked in escrow. State transitions to spectator vote quorum commit phase.");
    this.notify();
  }

  // Spectator Commit Vote
  public commitVote(selection: 1 | 2, salt: string) {
    this.userVoteSelection = selection;
    this.userVoteSalt = salt;
    this.hasCommitted = true;
    this.votePhase = 'commit';

    // Calculate mock keccak256 hash
    const hash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    
    this.addLedgerLog(
      "vault.commitVote",
      `Spectator committed hashed selection ${hash.substring(0, 10)}...`,
      "State: Committed",
      [123, 127]
    );

    this.highlightCode([123, 127], "Blind voting hash registered on-chain. Secures quorum selection against public bandwidth manipulation.");
  }

  // Spectator Reveal Vote
  public revealVote() {
    if (!this.hasCommitted || !this.userVoteSelection) return;

    this.hasRevealed = true;
    this.votePhase = 'reveal';
    
    if (this.userVoteSelection === 1) {
      this.voteCountA += 1;
    } else {
      this.voteCountB += 1;
    }

    // Add extra mock reveals to simulate organic spectrum quorum
    const extraA = Math.floor(Math.random() * 4) + 1; // 1-4 more votes on A
    const extraB = Math.floor(Math.random() * 3);     // 0-2 more votes on B
    
    this.voteCountA += extraA;
    this.voteCountB += extraB;
    this.totalRevealedVotes += 1 + extraA + extraB;
    this.votePhase = 'complete';

    this.addLedgerLog(
      "vault.revealVote",
      `Revealed votes (Alpha: ${this.voteCountA}, Beta: ${this.voteCountB})`,
      `Total Quorum: ${this.totalRevealedVotes} votes`,
      [129, 141]
    );

    this.highlightCode([129, 141], "Secret salt revealed. Blind commitments matching the on-chain hash are calculated and verified.");
  }

  // Smart Contract Resolution and payout
  public resolveMatch() {
    this.matchState = 'resolved';
    
    const finalWinner = this.voteCountA >= this.voteCountB ? 'agent_a' : 'agent_b';
    this.winner = finalWinner;

    // ELO Calculation
    const K = 32;
    const expectedA = 1 / (1 + Math.pow(10, (this.eloB - this.eloA) / 400));
    const expectedB = 1 / (1 + Math.pow(10, (this.eloA - this.eloB) / 400));
    
    const actualA = finalWinner === 'agent_a' ? 1 : 0;
    const actualB = finalWinner === 'agent_b' ? 1 : 0;

    const eloDeltaA = Math.round(K * (actualA - expectedA));
    const eloDeltaB = Math.round(K * (actualB - expectedB));

    this.eloA += eloDeltaA;
    this.eloB += eloDeltaB;

    // Distribute wagers and prizes
    const totalWagers = this.wagerPoolA + this.wagerPoolB;
    const totalEscrow = this.trainerEscrowA + this.trainerEscrowB;
    const totalPayoutPool = totalWagers + totalEscrow;

    const feeAmt = (totalPayoutPool * CONFIG.sandbox.platformFeePercent) / 100;
    const netPool = totalPayoutPool - feeAmt;
    this.accumulatedFeesUSDC += feeAmt;

    // Payout calculation
    let payoutAmount = 0;
    if (finalWinner === 'agent_a' && this.userWagerA > 0) {
      const share = this.userWagerA / this.wagerPoolA;
      payoutAmount = share * this.wagerPoolA + (share * this.wagerPoolB) * (1 - CONFIG.sandbox.platformFeePercent / 100);
      // user also gets their wagers + training escrow share if they were trainer, 
      // but in sandbox user is spectator, so payout is based on spectator pool share
      this.balance += payoutAmount;
    } else if (finalWinner === 'agent_b' && this.userWagerB > 0) {
      const share = this.userWagerB / this.wagerPoolB;
      payoutAmount = share * this.wagerPoolB + (share * this.wagerPoolA) * (1 - CONFIG.sandbox.platformFeePercent / 100);
      this.balance += payoutAmount;
    }

    this.saveToLocalStorage();

    this.addLedgerLog(
      "vault.resolveMatch",
      `Vault resolved! Winner: Agent ${finalWinner === 'agent_a' ? 'Alpha' : 'Beta'}`,
      `Payout pool: ${netPool.toFixed(2)} USDC`,
      [145, 166]
    );

    this.highlightCode([145, 166], `Quorum verified. Platform fee (${CONFIG.sandbox.platformFeePercent}%) collected, and payouts released to winner trainers and wagers.`);
  }

  // Full reset to initial state
  public resetMatch() {
    this.matchState = 'lobby';
    this.votePhase = 'idle';
    this.messages = [];
    this.ledgerLogs = [];
    this.wagerPoolA = 0;
    this.wagerPoolB = 0;
    this.userWagerA = 0;
    this.userWagerB = 0;
    
    this.userVoteSelection = null;
    this.userVoteSalt = "";
    this.hasCommitted = false;
    this.hasRevealed = false;
    this.voteCountA = 0;
    this.voteCountB = 0;
    this.totalRevealedVotes = 0;
    this.winner = null;

    this.activeHighlightLines = null;
    this.activeExplainer = "Vault is idle. Feed autonomous agent training escrow parameters in the lobby to deploy.";
    
    this.notify();
  }
}

// Single singleton instance shared across visual frames
export const store = new DebaterStore();

// Custom hook to listen to store changes React-natively
import { useState, useEffect } from "react";

export function useDebaterStore() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setTick((t) => t + 1);
    });
    
    store.mount();
    
    // Force an immediate re-render to pick up the mounted state on client
    setTick((t) => t + 1);

    return () => {
      unsubscribe();
    };
  }, []);

  return store;
}
