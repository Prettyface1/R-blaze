# ResearchBoost: Collaborative Research Funding Platform

ResearchBoost is a decentralized platform designed to help researchers fund their projects through community contributions. Using smart contracts on the Stacks blockchain, it ensures transparency, accountability, and security for funding and project completion. The platform allows researchers to propose projects, receive funding, and complete their projects with the support of the global community.

## Features
- **Propose a Research Project**: Researchers can submit their project proposals, detailing the project title, description, and required funding.
- **Fund Projects**: Community members can fund research projects to help them reach their funding goals.
- **Complete a Project**: Researchers can mark their projects as completed once the required funding has been raised.

## Technologies Used
- **Stacks Blockchain**: Decentralized blockchain for transparent and secure transactions.
- **Clarity Smart Contracts**: The smart contract language used to develop the logic behind the platform, ensuring project creation, funding, and completion.
- **STX Tokens**: The native token of the Stacks blockchain used for funding and transactions on the platform.

## Contract Details

The smart contract contains the following key functions:

- **propose-project**: Allows researchers to propose new research projects by specifying the title, description, and required funding.
- **fund-project**: Enables users to fund projects with a specified amount of STX, updating the project's funding status.
- **complete-project**: Allows researchers to mark their project as completed once the required funding has been raised.

### Constants:
- **PROJECT-STATUS-PROPOSED**: Indicates that the project is awaiting funding.
- **PROJECT-STATUS-FUNDED**: Indicates that the project has received the required funding.
- **PROJECT-STATUS-COMPLETED**: Indicates that the project has been completed.

### Data Structures:
- **Projects**: Stored in a map, each project has an ID, title, description, required funding amount, current funding, and status.
- **Next Project ID**: Tracks the next available project ID.

### Errors:
- **ERR-UNAUTHORIZED**: Raised when a non-researcher attempts an action reserved for the project owner.
- **ERR-INSUFFICIENT-FUNDS**: Raised when a user attempts to fund a project with an amount exceeding the required funding.
- **ERR-PROJECT-NOT-FOUND**: Raised when the specified project ID is not found.
- **ERR-INVALID-INPUT**: Raised when the user provides invalid input, such as an empty project title or description.

## Setup & Usage

To interact with this contract, you can use the following tools and steps:

### Requirements:
- [Clarinet](https://github.com/hirosystems/clarinet): A tool for building, testing, and deploying Clarity smart contracts on the Stacks blockchain.
- Stacks Wallet: A wallet to interact with the Stacks blockchain.

### Setup:

1. **Install Clarinet**:
   Follow the instructions in the Clarinet [Installation Guide](https://docs.clarinet.xyz/) to set up Clarinet on your local machine.

2. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/researchboost.git
   cd researchboost
   ```

3. **Install Dependencies**:
   Make sure all necessary dependencies for Clarinet are installed.

4. **Run Clarinet Test**:
   Before deploying the contract to the blockchain, run tests to ensure everything is working as expected.
   ```bash
   clarinet test
   ```

5. **Deploy the Contract**:
   After testing, you can deploy the contract using the Clarinet CLI:
   ```bash
   clarinet deploy
   ```

### Interacting with the Contract:

Once deployed, you can interact with the contract using the Clarinet CLI or a Stacks wallet. The key functions you can use are:

- **propose-project**: Propose a new research project.
- **fund-project**: Contribute funds to an existing project.
- **complete-project**: Mark a project as completed after it has received the required funding.

## Future Improvements

- **Governance Features**: Allow users to vote on project priorities and research areas.
- **Milestone Tracking**: Add milestones to each project for a more detailed tracking of progress.
- **Multi-Researcher Projects**: Enable collaboration between multiple researchers on a single project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

