export interface GenesisTurn {
  id: string;
  role: 'referee' | 'agent_a' | 'agent_b' | 'system';
  senderName: string;
  content: string;
  highlightLines: [number, number]; // Solidity lines to glow
  ledgerDetail: string;
  ledgerValue?: string;
  contractStateExplainer: string;
  delayMultiplier?: number; // Adjust cadence delay for specific narrative beats
}

export const GENESIS_DEBATE_SCRIPT: GenesisTurn[] = [
  {
    id: "init",
    role: "referee",
    senderName: "Consensus Referee",
    content: "🎙️ Welcome to the Debater Colosseum. Match #Genesis is initializing on the Base Network. Topic: 'Decentralization vs. Regulation'. Locking agent training deposits in escrow.",
    highlightLines: [84, 98],
    ledgerDetail: "vault.enterMatch(matchId, trainerAlpha, trainerBeta, 250 USDC)",
    ledgerValue: "Escrow: 500 USDC locked",
    contractStateExplainer: "The vault escrows entry fees from both autonomous agent training accounts into the secure match clearinghouse to prevent premature exit."
  },
  {
    id: "bet_open",
    role: "system",
    senderName: "Base Network VM",
    content: "🟢 TRANSACTION CONFIRMED: Match state updated to 'Live'. Spectator wagering pools are now open. Spectators can place bets on Agent A (Alpha) or Agent B (Beta) using mock USDC.",
    highlightLines: [100, 113],
    ledgerDetail: "vault.placeBet(matchId, selection=1, amount=150 USDC)",
    ledgerValue: "Wager Pool A: 150 USDC",
    contractStateExplainer: "Betting pools A and B are active. Vault maintains strict trainers/bettors separation rules to prevent on-chain insider trading."
  },
  {
    id: "alpha_turn_1",
    role: "agent_a",
    senderName: "Decentrolat (Alpha)",
    content: "Cypherpunks write code. Centralized regulators protect institutions, not individuals. Every central point of control is a bottleneck for human progress and a honeypot for state corruption. By anchoring consensus in math, cryptography, and immutable ledgers, we construct a sovereign framework that requires neither permission nor compliance. We do not need permission to be free. Let the code speak for itself.",
    highlightLines: [100, 113],
    ledgerDetail: "vault.placeBet(matchId, selection=1, amount=120 USDC)",
    ledgerValue: "Wager Pool A: 270 USDC",
    contractStateExplainer: "Agent Alpha asserts sovereignty. Spectator wagers are streaming into Pool A as cypherpunk sentiment gains momentum."
  },
  {
    id: "beta_turn_1",
    role: "agent_b",
    senderName: "Regulo (Beta)",
    content: "Sovereignty is a hollow comfort when your life savings are vaporized in a flash-loan exploit. Pure decentralization is an ideological fantasy that ignores basic human psychology. Without guardrails, regulation, and dispute resolution, web3 becomes a hostile dark forest governed solely by predators. True mainstream adoption demands institutional confidence, standard security controls, and regulatory compliance. Guardrails do not restrict freedom—they make it safe to exist.",
    highlightLines: [100, 113],
    ledgerDetail: "vault.placeBet(matchId, selection=2, amount=320 USDC)",
    ledgerValue: "Wager Pool B: 320 USDC",
    contractStateExplainer: "Agent Beta advocates for pragmatic protection. Institutional wagers pool into B, matching cypherpunk conviction."
  },
  {
    id: "alpha_turn_2",
    role: "agent_a",
    senderName: "Decentrolat (Alpha)",
    content: "You mistake the training wheels for the bicycle. Exploits are painful, but they are the evolutionary pressure that forces code to become bulletproof. Handing key control or regulatory override keys to a central body introduces the ultimate systemic risk: a single pen stroke that can seize billions in capital. Compliance is just a polite word for structural compliance with monopoly gatekeepers. We build trustless systems because humans are inherently untrustworthy. You cannot patch human fallibility by putting another bureaucrat in charge.",
    highlightLines: [100, 113],
    ledgerDetail: "vault.placeBet(matchId, selection=1, amount=210 USDC)",
    ledgerValue: "Wager Pool A: 480 USDC",
    contractStateExplainer: "Rebuttal: Agent Alpha denounces regulatory seizure risks. Cynics and developers place secondary bets on Pool A."
  },
  {
    id: "beta_turn_2",
    role: "agent_b",
    senderName: "Regulo (Beta)",
    content: "A trustless system that ignores systemic failure is not robust—it is fragile. Code is written by humans, meaning code is inherently fallible. When a smart contract malfunctions or is exploited, the refusal to intervene is not 'immutability,' it is complicity in theft. Standard compliance, KYC, and centralized recovery channels are the bridge that transforms a niche developer playground into a global economic framework. We do not need absolute lawlessness; we need a resilient hybrid layer that protects users while respecting decentralization.",
    highlightLines: [100, 113],
    ledgerDetail: "vault.placeBet(matchId, selection=2, amount=280 USDC)",
    ledgerValue: "Wager Pool B: 600 USDC",
    contractStateExplainer: "Rebuttal: Agent Beta defends safety layers. Speculators balance betting pools, anticipating the referee quorum call."
  },
  {
    id: "referee_lock",
    role: "referee",
    senderName: "Consensus Referee",
    content: "🔔 The debate rounds have concluded. The Referee has initiated the turn lock command on-chain. Wagers are permanently frozen. Proceeding to blind spectator voting.",
    highlightLines: [115, 119],
    ledgerDetail: "vault.lockBetting(matchId)",
    ledgerValue: "Betting Pools Locked",
    contractStateExplainer: "Wager pools A & B are permanently frozen. The match transitions to the voting state, preventing any further front-running of the vote."
  },
  {
    id: "vote_commit",
    role: "referee",
    senderName: "Consensus Referee",
    content: "🗳️ VOTING PHASE [COMMIT]: Spectators are committing blind, encrypted hashes of their selection to the vault to prevent bandwagon voting.",
    highlightLines: [123, 127],
    ledgerDetail: "vault.commitVote(matchId, keccak256(selection, salt))",
    ledgerValue: "Commits: 3 Hashed Votes",
    contractStateExplainer: "Spectators commit a blind hash (representing their vote + secret salt). This secures the voting process from public coordination bias."
  },
  {
    id: "vote_reveal",
    role: "referee",
    senderName: "Consensus Referee",
    content: "🔑 VOTING PHASE [REVEAL]: Voters are submitting their cleartext selections and salts. The contract cryptographically verifies the original commitments.",
    highlightLines: [129, 141],
    ledgerDetail: "vault.revealVote(matchId, selection=1, salt=\"0x9b7e...\")",
    ledgerValue: "Reveals: 3 Votes Unveiled (Alpha: 2, Beta: 1)",
    contractStateExplainer: "Voters reveal their salts to verify and count their vote. Verification matches the committed hash, progressing the consensus quorum."
  },
  {
    id: "resolve",
    role: "referee",
    senderName: "Consensus Referee",
    content: "🏆 MATCH RESOLVED! Consensus quorum has resolved Agent A (Alpha) as the winner of this match. The clearinghouse will distribute the escrow and wagers immediately.",
    highlightLines: [145, 166],
    ledgerDetail: "vault.resolveMatch(matchId)",
    ledgerValue: "Decentrolat Wins: 1080 USDC distributed",
    contractStateExplainer: "Quorum is successfully verified. Vault resolves and transfers prize escrow and wager pools to Agent Alpha trainers and winning bettors."
  }
];
