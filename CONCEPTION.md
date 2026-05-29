# Debater: Live AI Debate Colosseum & Smart Contract Sandbox
> Watch two autonomous AI agents debate any topic while an educational Solidity smart contract settles the outcome in real time.

---

## 🎯 1. The Core Vision & Prototype Scope

**Debater** is a zero-friction, highly visual web sandbox built to showcase the intersection of **Autonomous AI Agents**, **Prediction Markets (USDC Wagers)**, and **Visual Smart Contract Education**.

### The "Purple Cow" (Product Innovation)
Standard code viewers are passive; ours is an interactive, reactive clearinghouse. As the AI debate progresses, spectators place spectator wagers, and the simulated blockchain executes consensus, the corresponding function blocks in `DebaterVault.sol` pulse with neon light in real-time correlation with live state transitions, complete with smooth auto-centering scroll animations.

### 🛡️ Core Prototype Scope (Strictly Engine A Client-Side Simulator)
To guarantee 100% reliability, instant loadability, and zero hosting-friction, the prototype is built as a **100% Client-Side Next.js Sandbox**. 

> [!IMPORTANT]
> **Defeating the Complexity Trap (Engine B Separation)**:
> In alignment with strategic feedback, **Engine B (Pusher, Upstash Redis database, Coinbase AgentKit, real Base Sepolia Web3 transactions) has been deleted from the v1 MVP implementation plan entirely.** Real on-chain settlements are a startup-scale undertaking that would delay the launch. Instead, Engine B lives strictly in [ROADMAP_ENGINE_B.md](file:///c:/Users/treed/OneDrive/Desktop/Debater/ROADMAP_ENGINE_B.md). The v1 MVP is a high-fidelity client-side educational simulator that emulates every step of the smart contract logic with high-performance reactive store state.

```
┌────────────────────────────────────────────────────────────────────────┐
│                              DEBATER APP                               │
│                   100% Client-Side Next.js Sandbox                     │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
          ┌─────────────────────────┴─────────────────────────┐
          ▼                                                   ▼
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│     COLOSSEUM STAGE (Left)      │       │     SOLIDITY SANDBOX (Right)    │
│ • Rhythmic Token Chat Stream    │       │ • Interactive DebaterVault.sol  │
│ • Referee Orchestrator Terminal │ ◄───► │ • Glowing Active Line Ranges    │
│ • Sidebar Betting Slip          │       │ • Simulated Base Ledger Logs    │
│ • Commit-Reveal Vote Quorum     │       │ • Plain-English State Explainer │
└─────────────────────────────────┘       └─────────────────────────────────┘
```

---

## 📁 2. Clean Next.js App Router Structure

To avoid maintainability issues and facilitate a viral growth loop with shareable URLs, the page router must be split into dedicated, focused routes rather than piling all views into a single `page.tsx`:

1.  **Lobby View / Home Route (`src/app/page.tsx`)**:
    *   **Scope**: Under 50 lines. Handles the landing page, preset topic cards (e.g., *"Decentralization vs. Regulation"*), and customizable tournament fields (Agent trainer personas, key inputs, starting match button).
2.  **Arena View / Active Debate Route (`src/app/debate/[id]/page.tsx`)**:
    *   **Scope**: The active split-screen colosseum stage. Renders the live chat arena on the left, and the visual Solidity clearinghouse + simulated ledger terminal on the right.
3.  **Shareable Receipt Route (`src/app/debate/[id]/receipt/page.tsx`)**:
    *   **Scope**: A shareable, highly aesthetic victory receipt page. Fetches the saved debate outcome from local storage, displays the ELO shifts, mock balances, spectator payout statistics, and fires canvas-confetti. Includes custom SEO OpenGraph tags to support sharing on platforms like X.

---

## 🔌 3. Zero-Friction LLM Onboarding (Launch Two)

To eliminate the "empty state key trap," the sandbox supports two distinct modes:

1.  **Genesis Tour Match (Default)**: A pre-compiled, high-fidelity script (*"Decentralization vs. Regulation"*) that runs instantly out-of-the-box. It triggers identical token streaming, wagers, consensus voting, ledger transactions, and Solidity glows, giving users a complete experience in 5 seconds without requiring immediate API keys.
    *   *One Renderer, Two Data Sources*: The Genesis Tour plays through the *exact same* streaming renderer components as live matches, ensuring no duplicate codepaths or mode-specific bugs.
2.  **Universal Direct Engine (Live Models)**: Users provide their own keys in a secure modal (stored 100% locally in `localStorage`, never sent to any server) to run live debates.
    *   **Strategic Launch Refinement**: We limit supported providers to **two** high-reliability options to prevent edge-case failures:
        - **Google Gemini** (*Gemini 1.5 Flash* via official `@google/generative-ai` SDK): Generous developer free tier, blistering response speed.
        - **OpenRouter** (*Universal Open-Source Router*): Seamless access to DeepSeek, Llama 3, Qwen, and other state-of-the-art models through a single direct client-side fetch, maximizing flexibility.
        - *Other Providers (Ollama, Groq, OpenAI, Anthropic)*: UI elements are gracefully disabled with a "Coming Soon" label, keeping codebase complexity minimal.

---

## 🏟️ 4. Visceral Colosseum Gameplay Mechanics

*   **Rhythmic Token Streaming**: Words print with natural human-like cadence delays (e.g., standard pauses between words, and longer pauses at punctuation, sentences, and socratic rebuttals).
*   **The Consensus Referee Terminal**: A retro-style scrolling hacker console logging the orchestrator's step-by-step decisions (e.g., `[ORCHESTRATOR] Instantiating DebaterVault...`).
*   **Anti-Collusion Simulation**: Educates developers on prediction market risks by simulating trainer/bettor lockouts (`require(msg.sender != m.agentA)`).
*   **API Cost Counter**: Tracks live tokens used and simulates exact micro-USDC gas/token fee counters (e.g., `$0.00018`) to demonstrate cost-efficiency.
    *   *No "Context Drift" embedding traps*: Stripped semantic context drift meters to avoid high latency and API dependency, focusing strictly on high-reliability gameplay.
*   **Commit-Reveal Consensus Voting**: Renders a blind commit phase where spectators enter a vote + secret salt, producing a simulated `keccak256` hash. Once the reveal deadline triggers, salts are revealed, vote tallies update the quorum progress meter, and the contract settles.

---

## 🏛️ 5. Smart Contract Educational Visualizer

The right panel displays the 1-indexed lines of `DebaterVault.sol`. Frontend actions emit simulated blockchain events that trigger beautiful glowing overlays and centered scrolling:

| Visual Stage | Event Emitted | Solidity Lines | Plain-English Explainer |
| :--- | :--- | :--- | :--- |
| **Match Creation** | `MatchCreated` | `84 - 98` | "Vault locks both AI trainers' entry fees into secure escrow." |
| **Wager Placed** | `BetPlaced` | `100 - 113` | "Locks bets in pools A/B. Enforces trainer-spectator firewall." |
| **State Turn-Lock** | `VotingStarted` | `115 - 119` | "Locks betting pools permanently to prevent front-running." |
| **Consensus Committing** | `VoteCommitted` | `123 - 127` | "Spectators submit a blind, hashed vote to prevent bandwagon rigging." |
| **Consensus Revealing** | `VoteRevealed` | `129 - 141` | "Salt revealed to verify vote integrity. Advances the quorum meter." |
| **Match Resolution** | `MatchResolved` | `145 - 166` | "Platform fees collected. Entry fees and wagers transferred to winners." |

---

## 📓 6. Developer Diary & Session Logs

### 📂 Session Log: May 29, 2026

#### 1. Strategic Feedback Deconstruction
*   **Action**: Analyzed the strategic feedback folder (`Feedback 5.txt`, `Feedback 6.txt`, `DebaterVault_Design_Report.md`) from scratch.
*   **Strategic Shift**: Eliminated Engine B multiplayer backend dependencies completely to secure a 100% shippable frontend product.
*   **Architectural Refinement**: Prepared the Next.js routing architecture to cleanly split page layout responsibilities between `/` (Lobby), `/debate/[id]` (Arena), and `/debate/[id]/receipt` (Aesthetic Receipt Page).
*   **Stability Guarantee**: Scaled down direct LLM providers to two (Gemini & Ollama) and stubbed others, resolving potential edge cases before writing code.
