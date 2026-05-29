# Debater: Live AI Debate Colosseum & Smart Contract Sandbox
> Watch two AI agents debate any topic while a Solidity smart contract settles the outcome in real time.

---

## 🎯 1. The Core Vision & Prototype Scope

**Debater** is a zero-friction, highly visual web playground designed to demonstrate the intersection of **Autonomous AI Agents**, **Prediction Markets**, and **Visual Smart Contract Education**.

### The "Purple Cow" (Product Innovation)
While the AI debate provides the *content*, the **Glowing Solidity Viewer** is the *product innovation*. Standard code viewers are passive; ours is an interactive, reactive clearinghouse. As the debate progresses or wagers are placed, the corresponding functions in `DebaterVault.sol` pulse with neon-gold light, visually explaining smart contract execution block-by-block.

### 🛡️ Core Prototype (v1 MVP) Scope
To maximize developer engagement and ensure instant launchability, the prototype is scoped strictly as a **100% Client-Side Next.js Playground**. It strips away multiplayer server-sync (no Pusher, no Upstash Redis) to ensure it is **zero-setup** and runs locally on `npm run dev` with absolute reliability.

```
┌────────────────────────────────────────────────────────────────────────┐
│                              DEBATER APP                               │
│                    100% Client-Side Next.js Arena                      │
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

## 🔌 2. Frictionless API Router & Onboarding

To prevent the "empty state key trap," the prototype incorporates two play modes:
1.  **Genesis Tour Match (Default)**: A pre-compiled, highly-polished debate script (*"Decentralization vs. Regulation"*) that runs instantly out-of-the-box. It triggers identical token streaming, wagers, consensus voting, ledger transactions, and Solidity glows, letting users experience the full gameplay in 5 seconds without requiring immediate API keys.
2.  **Universal Direct Engine**: Users input their own keys in a clean modal (securely saved in `localStorage`, never sent to a backend server) to run unscripted debates supporting:
    - **Google Gemini** (*Gemini 1.5 Flash*): Lightning-fast, generous developer free-tier.
    - **Groq** (*Llama 3 / Gemma 2*): Blistering speed (~500+ tokens/sec) for high-cadence streaming.
    - **Ollama** (*Local Open-Source*): Connects directly to `localhost:11434` for $0, 100% private offline debates.
    - **OpenAI & Anthropic**: Standard client fetches.

---

## 🏟️ 3. Visceral Colosseum UX Primitives

The debate feed is designed as an interactive Colosseum stage:
*   **Rhythmic Token Streaming**: Words buffer and print with natural cadence typing pauses (shorter for standard words, longer at punctuation and rebuttal turns) to simulate active logical reasoning.
*   **The Referee Console**: A retro-style scrolling console logging the referee orchestrator's decisions:
    ```json
    [06:05:01] [ORCHESTRATOR] Initializing Match #Genesis on Base.
    [06:05:03] [ORCHESTRATOR] Injecting socratic rules to Agent A...
    [06:05:05] [ORCHESTRATOR] Enforcing context drift warning threshold...
    ```
*   **Aesthetic Debate Receipt**: A gorgeous, shareable, twitter-ready card displayed upon match resolution, summarizing debate outcomes, wager distributions, ELO shifts, and a copyable "Etherscan-style" blockchain event block receipt.

---

## 🏛️ 4. Visual Solidity Clearinghouse: `DebaterVault.sol`

The right panel features our interactive code sandbox. The state transitions in the Colosseum emit simulated event logs that trigger glowing border overlays on designated line ranges in `DebaterVault.sol`:

### Live Event-to-Code Mapping
1.  **Match Initialization** -> Triggers `MatchCreated` event:
    - *Solidity Highlight*: Lines 84 - 98 (`enterMatch` / `createMatch`).
    - *Explainer*: "Vault locks both AI trainers' USDC entry fees into secure escrow."
2.  **Wager Placement** -> Triggers `BetPlaced` event:
    - *Solidity Highlight*: Lines 100 - 113 (`placeBet`).
    - *Explainer*: "Locks wagers into pools A/B. Enforces strict trainer/bettor firewall to prevent insider trading."
3.  **State Turn-Lock** -> Triggers `VotingStarted` event:
    - *Solidity Highlight*: Lines 115 - 119 (`lockBetting`).
    - *Explainer*: "Locks betting pools to prevent front-running once the final turns conclude."
4.  **Consensus Committing** -> Triggers `VoteCommitted` event:
    - *Solidity Highlight*: Lines 123 - 127 (`commitVote`).
    - *Explainer*: "Spectators submit a blind, hashed vote to prevent bandwagon rigging."
5.  **Consensus Revealing** -> Triggers `VoteRevealed` event:
    - *Solidity Highlight*: Lines 129 - 141 (`revealVote`).
    - *Explainer*: "Voters reveal their salts to verify and count their vote. Progresses the quorum meter."
6.  **Match Resolution** -> Triggers `MatchResolved` event:
    - *Solidity Highlight*: Lines 145 - 166 (`resolveMatch` / `claimWinnings`).
    - *Explainer*: "Quorum met. Vault transfers entry fees and wager share to the winning agent and successful bettors."

---

## 📓 5. Developer Diary & Session Logs

### 📂 Session Log: May 29, 2026

#### 1. Zero-Friction Prototype Refinement
*   **Action**: Analyzed the feedback folder from scratch, treating `DebaterVault_Design_Report.md` and `Feedback_GeminiCLI.md` with highest relevance.
*   **Consolidation**: Stripped away all database, Upstash Redis, and Pusher configurations to deliver the **most basic, visually-focused product prototype**.
*   **The Glowing Viewer**: Centered the entire v1 around the glowing Solidity function blocks and scrolling simulated Base ledger console.
*   **Onboarding**: Fleshed out the pre-scripted **Genesis Tour Match** to provide an immediate interactive experience for developers within 5 seconds.
