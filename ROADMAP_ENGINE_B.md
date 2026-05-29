# Roadmap: Engine B (On-Chain Settlement & Multiplayer)

This document outlines the v2 architectural expansion plan to shift **Debater** from a high-fidelity client-side educational sandbox (**Engine A**) to a fully decentralized, real-time multiplayer arena with actual on-chain settlement on **Base Sepolia** (**Engine B**).

---

## 🏗️ 1. Technical Stack Additions

To transition to live multiplayer matches with financial settlement:
- **State Database**: **Upstash Redis** to persist global match states, active lobbies, and history.
- **Real-Time Sync**: **Pusher Channels** to broadcast turns, spectator bets, and voting consensus in real time.
- **Smart Contract Network**: **Base Sepolia Testnet** for zero-friction gas fees and rapid block confirmation.
- **Agent Wallets**: **Coinbase AgentKit** to provision autonomous wallets for the AI trainers.
- **Frontend Web3 Connectors**: **RainbowKit** or **AppKit (WalletConnect)** for spectator wallet integration.

---

## 🏛️ 2. On-Chain Smart Contract Payouts (`DebaterVault.sol`)

The `DebaterVault.sol` contract deployed on Base Sepolia executes the financial clearinghouse:

1.  **Trainer Escrow Locking**:
    The orchestrator wallet or trainer wallet locks USDC entry collateral by calling `enterMatch(matchId, opponent)`.
2.  **Trainer/Bettor Firewall**:
    The contract enforces strict anti-collusion safety checks:
    ```solidity
    require(msg.sender != m.agentA && msg.sender != m.agentB, "Trainers cannot bet");
    ```
3.  **Hashed Commit-Reveal Quorum**:
    To prevent bandwagon voting or coordinated Discord rigging, the consensus voting utilizes a two-phase smart contract commit-reveal scheme:
    *   *Commit Phase*: Users upload `keccak256(abi.encodePacked(voteSelection, secretSalt))` through `commitVote()`.
    *   *Reveal Phase*: Users upload their `voteSelection` and `secretSalt` via `revealVote()`. The contract recalculates the hash and counts the vote.
4.  **CEI Pattern Settlement**:
    Once the reveal window closes and quorum is met, the contract resolves the winner and distributes payouts using the Checks-Effects-Interactions (CEI) security pattern to prevent reentrancy attacks:
    ```solidity
    b.amount = 0; // Effect happens before Interaction
    usdc.transfer(msg.sender, payout); // Interaction
    ```

---

## 🔌 3. Web3 & Backend Infrastructure Setup

### Redis Match Schema (`redis.ts`)
```typescript
export interface MatchState {
  id: string;
  topic: string;
  state: 'lobby' | 'live' | 'voting' | 'resolved';
  agentAAddress: string;
  agentBAddress: string;
  wagerPoolA: number;
  wagerPoolB: number;
  turns: Turn[];
  votes: Record<string, string>; // userId -> vote hash
}
```

### Real-Time Pusher Broadcasts (`pusher.ts`)
*   **Channel**: `match-[id]`
*   **Events**:
    - `turn`: Emitted by the serverless orchestrator when an agent completes their response, streaming the text to all connected spectators.
    - `bet`: Emitted when a spectator wagers, updating the pool totals in real time.
    - `voting`: Emitted when betting locks and the consensus voting period begins.
    - `resolved`: Emitted when the smart contract finishes payouts, triggering the aesthetic victory receipt modal.

---

## 🛡️ 4. Strategic Execution Phases

### Phase 1: Serverless Lobbies & State
- Deconstruct current client-side state hooks in `store.ts` into Next.js API route endpoints (`/api/match/create`, `/api/match/join`, `/api/match/bet`).
- Hook Upstash Redis client to persist global lobbies.
- Install `pusher-js` and `pusher` libraries and trigger events to synchronize all spectating clients.

### Phase 2: Web3 Wallet Integration & Connectors
- Add RainbowKit to the Lobby, allowing spectators to connect MetaMask, Coinbase Wallet, or Rabby.
- Implement gasless transactions or local USDC faucet integration for smooth onboarding.

### Phase 3: Coinbase AgentKit & Autonomous AI Wallets
- Initialize Coinbase SDK inside the serverless agent loop.
- Provision separate EVM wallet private keys for Agent A and Agent B.
- Automatically execute the entry fee transfer to the deployed contract before a debate starts.

### Phase 4: Full On-Chain Audit & Verification
- Verify gas usage and optimize variables for Base Sepolia.
- Test edge cases: connection loss mid-debate, vote reveal failures, and fallback refund triggers (`cancelMatch`).
