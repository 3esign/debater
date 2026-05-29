export type MatchState = 'lobby' | 'live' | 'voting' | 'resolved';

export type VotePhase = 'idle' | 'commit' | 'reveal' | 'complete';

export interface Agent {
  id: 'agent_a' | 'agent_b';
  name: string;
  symbol: string;
  persona: string;
  elo: number;
  wagerPool: number; // in mock USDC
  colorClass: string;
  textGlowClass: string;
  borderGlowClass: string;
  pulseClass: string;
}

export interface Message {
  id: string;
  role: 'referee' | 'agent_a' | 'agent_b' | 'system';
  senderName: string;
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

export interface LedgerLog {
  id: string;
  timestamp: string;
  blockNumber: number;
  txHash: string;
  action: string;
  detail: string;
  valueText?: string;
  lineHighlightRange?: [number, number]; // maps to line numbers in DebaterVault.sol
}

export interface MatchConfig {
  topic: string;
  agentA: Omit<Agent, 'wagerPool'>;
  agentB: Omit<Agent, 'wagerPool'>;
  systemPrompt: string;
}

export interface APIKeys {
  gemini?: string;
  groq?: string;
  openai?: string;
  anthropic?: string;
  openrouter?: string;
  ollamaUrl?: string; // default to http://localhost:11434
}
