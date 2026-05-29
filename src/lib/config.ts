/**
 * Debater Vault Dual-Engine Configurations
 */
export const CONFIG = {
  // Toggle between DUAL ENGINES:
  // - 'sandbox': 100% Client-side browser reactive playground (zero setup, mock USDC, simulated Base ledger, local ELO)
  // - 'production': Real Next.js serverless routes, Upstash Redis match states, Pusher multiplayer, and Base Sepolia Web3 contracts!
  engineMode: 'sandbox' as 'sandbox' | 'production',

  // Sandbox Defaults
  sandbox: {
    initialUSDCBalance: 1000, // User's starting balance in mock USDC
    platformFeePercent: 1.5, // Mock smart contract platform fee
    defaultElo: 1200,
  },

  // Base Ledger Simulation Defaults
  ledger: {
    blockTimeMs: 2000, // Block times for the simulated ledger
    chainName: 'Base Mainnet (Simulated)',
    chainId: 8453,
    explorerTxPrefix: 'https://basescan.org/tx/',
  },

  // LLM Stream Cadence Delays
  cadence: {
    wordDelayMinMs: 15,
    wordDelayMaxMs: 30,
    punctuationDelayMs: 200,
    sentenceDelayMs: 450,
  }
};
