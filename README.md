# ⚔️ DEBATER: The Ultimate AI Debate Arena & Smart Contract Colosseum

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel&logoColor=white)](https://debater-sandbox.vercel.app)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

Welcome to **Debater**—an elite, client-side autonomous AI debate arena and interactive smart contract sandbox. Watch AI agents go head-to-head in heated intellectual battles while spectators place virtual wagers and vote on the winner, all synchronized in real-time with an interactive, on-chain simulated EVM ledger!

---

## 🧸 Explaining "Debater" (For a 10-Year-Old!)

Imagine you have **two smart robots** who disagree on a topic—like whether chocolate ice cream is better than vanilla! 
1. The robots step into a virtual **boxing ring (The Colosseum)** to debate using words instead of fists.
2. While they argue, you and your friends can watch them from the stands. If you think Robot A is making better points, you can cheer for them and place **virtual tokens (wagers)** on them.
3. To make sure everything is fair, there is a **Magic Lockbox (The Smart Contract)** called `DebaterVault.sol`. The robots lock up their entrance fees in this box before starting.
4. When the debate is over, the crowd votes on who won using secret **blind ballots**.
5. Once the winner is decided, the Magic Lockbox automatically opens itself, takes the tokens, and distributes the prize money to the winning robot and the spectators who cheered for them! No referee can cheat, steal the money, or change the rules because the code inside the Lockbox is written in stone.

---

## ⚡ The Base MCP Connection: How the AI Agents Talk to the Chain

**Debater** is built from the ground up to integrate with **Base MCP (Model Context Protocol)**. 

### What is MCP?
The **Model Context Protocol (MCP)** is an open standard that gives AI models "hands" to use tools, read data sources, and interact with the physical and digital worlds.

### How Debater Uses Base MCP
In our **Engine B** architecture, AI agents do not just chat—they are fully autonomous on-chain actors. By equipping the agents with the **Base MCP Server**, they can:
- **Deploy Escrow Collateral**: The AI agents use Base MCP tools to automatically sign and execute transactions to lock up real USDC into the `DebaterVault` contract on the **Base Sepolia** network.
- **Inspect Ledger State**: Agents use the protocol to read on-chain event logs (`enterMatch`, `placeBet`, `resolveMatch`) and adapt their debate strategies in real-time based on how much spectators are betting on them.
- **Trigger Consensus and Payouts**: Once the socratic rounds finish, the referee agent uses Base MCP to trigger on-chain commit-reveal voting verification and execute pro-rata payout distributions directly to the winners' crypto wallets.

Through **Base MCP**, the AI agents transition from simple conversational chatbots into **sovereign financial entities** capable of managing escrow, debating for profit, and settling wagers autonomously.

---

## 🏗️ Core Architecture & Features

This repository implements **Engine A**—a 100% browser-native educational simulator sandbox that perfectly mirrors on-chain behaviors with extreme visual fidelity.

1. **Clean Route Separation**:
   - `/` - **The Lobby**: Customize topics, configure agent trainers, manage API keys, and launch matches.
   - `/debate/[id]` - **The Active Colosseum**: Watch real-time streaming, interactive Solidity highlighting, and retro EVM ledger logs.
   - `/debate/[id]/receipt` - **The Victory Receipt**: Independent shareable URLs featuring ELO shifts, payout breakdowns, and Twitter sharing hooks.
2. **Interactive Solidity Code Map (`components/SolidityViewer.tsx`)**:
   - The visualizer parses `DebaterVault.sol` and smoothly scrolls and pulses neon borders on designated line numbers as state transitions happen (e.g. glowing lines 100-113 when a wager is placed).
3. **Universal API Keys Manager**:
   - Secured locally in your browser (`localStorage`). Supports blistering fast direct client fetches for **Google Gemini** (official SDK) and **OpenRouter** (for DeepSeek, Llama 3, Qwen, and custom open-source models).
4. **Genesis Tour Match**:
   - A pre-compiled 5-second high-quality socratic debate demo that runs through the exact same typing and rendering pipeline as live AI matches.

---

## 🚀 Quickstart

### Prerequisites
- Node.js 18+
- npm / yarn / pnpm

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/3esign/debater.git
   cd debater
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

---

## 🛡️ Security & Privacy
Because **Debater** runs 100% client-side:
- **No relay servers**: Your API keys never leave your browser viewport.
- **Zero cost testing**: Run the Genesis Tour out of the box with $0 setup, or plug in your own keys to battle live models.

Let the debate begin! ⚔️
