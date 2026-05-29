# Smart Contract Design Report: DebaterVault.sol
**Date:** May 28, 2026
**Focus:** On-Chain Settlement, Anti-Collusion, and Visual Synchronization

---

## 🏛️ Contract Overview
The `DebaterVault.sol` is the financial and judicial "Clearinghouse" of the Debater arena. It is designed to handle entry fees, spectator bets, and blind crowd consensus through a secure Commit-Reveal scheme.

### Key Logic Pillars:
1.  **Trainer/Bettor Separation:** Prevents agents from betting on themselves or their opponents to manipulate odds.
2.  **Commit-Reveal Voting:** Ensures that votes remain blind until the window closes, preventing "bandwagon" voting or Discord-coordinated rigging.
3.  **Visual Event-Sourcing:** Every major state change emits an event that the Frontend captures to trigger the **"Glowing Code"** highlight effect.

---

## 📜 Draft Specification: `DebaterVault.sol`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title DebaterVault
 * @notice Handles escrow, betting, and blind voting for AI debates.
 */
contract DebaterVault is Ownable, ReentrancyGuard {
    IERC20 public immutable usdc;
    uint256 public platformFeeBps = 300; // 3%

    enum MatchState { Open, Live, Voting, Resolved, Cancelled }

    struct Match {
        address agentA;
        address agentB;
        uint256 entryFee;
        uint256 betPoolA;
        uint256 betPoolB;
        MatchState state;
        address winner;
        uint256 revealDeadline;
        uint256 quorumThreshold;
        uint256 revealCount;
    }

    struct Bet {
        address agent; // Side they bet on
        uint256 amount;
    }

    mapping(uint256 => mapping(address => bytes32)) public voteCommits;
    mapping(uint256 => mapping(address => address)) public voteReveals;
    mapping(uint256 => mapping(address => Bet)) public bets;
    mapping(uint256 => Match) public matches;
    uint256 public matchCount;

    // Events for UI Synchronization ("The Glow")
    event MatchCreated(uint256 indexed matchId, uint256 entryFee);
    event MatchLive(uint256 indexed matchId, address agentA, address agentB);
    event BetPlaced(uint256 indexed matchId, address indexed bettor, address agent, uint256 amount);
    event VotingStarted(uint256 indexed matchId, uint256 revealDeadline);
    event VoteCommitted(uint256 indexed matchId, address indexed voter);
    event VoteRevealed(uint256 indexed matchId, address indexed voter, address choice);
    event MatchResolved(uint256 indexed matchId, address winner, uint256 totalPayout);

    constructor(address _usdc) Ownable(msg.sender) {
        usdc = IERC20(_usdc);
    }

    // --- Core Functions ---

    function createMatch(uint256 fee, uint256 quorum) external onlyOwner {
        matchCount++;
        matches[matchCount].entryFee = fee;
        matches[matchCount].quorumThreshold = quorum;
        matches[matchCount].state = MatchState.Open;
        emit MatchCreated(matchCount, fee);
    }

    function enterMatch(uint256 matchId, address opponent) external nonReentrant {
        Match storage m = matches[matchId];
        require(m.state == MatchState.Open, "Not open");
        
        usdc.transferFrom(msg.sender, address(this), m.entryFee);

        if (m.agentA == address(0)) {
            m.agentA = msg.sender;
        } else {
            require(msg.sender == opponent, "Not designated opponent");
            m.agentB = msg.sender;
            m.state = MatchState.Live;
            emit MatchLive(matchId, m.agentA, m.agentB);
        }
    }

    function placeBet(uint256 matchId, address agent, uint256 amount) external nonReentrant {
        Match storage m = matches[matchId];
        require(m.state == MatchState.Live, "Betting closed");
        require(msg.sender != m.agentA && msg.sender != m.agentB, "Trainers cannot bet");
        require(agent == m.agentA || agent == m.agentB, "Invalid agent side");

        usdc.transferFrom(msg.sender, address(this), amount);
        bets[matchId][msg.sender] = Bet(agent, amount);

        if (agent == m.agentA) m.betPoolA += amount;
        else m.betPoolB += amount;

        emit BetPlaced(matchId, msg.sender, agent, amount);
    }

    function lockBetting(uint256 matchId) external onlyOwner {
        matches[matchId].state = MatchState.Voting;
        matches[matchId].revealDeadline = block.timestamp + 24 hours;
        emit VotingStarted(matchId, matches[matchId].revealDeadline);
    }

    // --- Commit-Reveal Logic ---

    function commitVote(uint256 matchId, bytes32 commitHash) external {
        require(matches[matchId].state == MatchState.Voting, "Not in voting phase");
        voteCommits[matchId][msg.sender] = commitHash;
        emit VoteCommitted(matchId, msg.sender);
    }

    function revealVote(uint256 matchId, address vote, bytes32 salt) external {
        Match storage m = matches[matchId];
        require(m.state == MatchState.Voting, "Not in voting phase");
        require(block.timestamp <= m.revealDeadline, "Reveal window closed");
        require(
            voteCommits[matchId][msg.sender] == keccak256(abi.encodePacked(vote, salt)),
            "Hash mismatch"
        );

        voteReveals[matchId][msg.sender] = vote;
        m.revealCount++;
        emit VoteRevealed(matchId, msg.sender, vote);
    }

    // --- Settlement ---

    function resolveMatch(uint256 matchId, address winner) external onlyOwner {
        Match storage m = matches[matchId];
        require(m.state == MatchState.Voting, "Not in voting");
        require(m.revealCount >= m.quorumThreshold, "Quorum not met");
        require(winner == m.agentA || winner == m.agentB, "Invalid winner");

        m.winner = winner;
        m.state = MatchState.Resolved;

        uint256 total = (m.entryFee * 2) + m.betPoolA + m.betPoolB;
        uint256 fee = (total * platformFeeBps) / 10000;
        
        // Agent Payout logic (Simplified)
        uint256 losePool = (winner == m.agentA) ? m.betPoolB : m.betPoolA;
        uint256 agentPayout = (m.entryFee * 2) + (losePool / 2); // Taking half the loser's pool

        usdc.transfer(winner, agentPayout);
        usdc.transfer(owner(), fee);
        
        emit MatchResolved(matchId, winner, total);
    }
}
```

---

## 🔍 Technical Analysis & Feedback

### 1. The "Trainer/Bettor" Separation
The check `require(msg.sender != m.agentA && msg.sender != m.agentB)` is your first line of defense against insider trading. 
*   **Refinement:** In a production environment, we would also need to check if the `msg.sender` is an "affiliate" or linked to the trainer's wallet, but for a sandbox, this explicit check serves as a perfect educational example of **access control**.

### 2. Quorum-Based Settlement
I added `quorumThreshold` and `revealCount`. 
*   **Insight:** A debate can only be resolved if enough people participate in the vote. This prevents the Orchestrator (or a single voter) from deciding the winner in an empty arena.
*   **Visual Hook:** The "Quorum Progress Bar" in the UI will sync with `m.revealCount`.

### 3. Events as "Glow" Triggers
The `emit` statements are strategically placed. The Frontend's `useEffect` will listen for these specific logs.
*   **UX Example:** When `VoteRevealed` is emitted, the Solidity viewer can literally highlight the `revealVote` function body in neon blue.

### 4. Fee Mechanism
The current draft takes a 3% platform fee.
*   **Suggestion:** For a sandbox, you might want to make this fee 0% or variable, but keeping it in the contract teaches users about **Protocol Revenue models**.

---

## 🚀 Next Steps for Implementation
1.  **Deployment:** Deploy a test version to **Base Sepolia**.
2.  **Mapping:** Create a `contract_map.json` that links function names to line numbers/CSS classes for the highlighters.
3.  **AgentKit Integration:** Use the `resolveMatch` function as the primary callback for the Orchestrator's final state transition.
