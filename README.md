# YNAB to Monarch Money

[![Netlify Status](https://api.netlify.com/api/v1/badges/6eccae9f-57ac-4659-ab15-5242c66e525c/deploy-status)](https://app.netlify.com/sites/ynab-to-monarch/deploys)

A tool to migrate YNAB transaction records into Monarch Money.

## Features

- Upload YNAB Register CSV file
- Map YNAB accounts to Monarch accounts
- Generate account-specific transaction files

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/ynabtomonarch.git
   cd ynabtomonarch
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Start the development server:

   ```sh
   npm start
   ```

## Usage

Visit the live site at [https://ynab-to-monarch.netlify.app/](https://ynab-to-monarch.netlify.app/)

1. Upload your YNAB Register CSV file.
2. Download the generated transaction files.
3. Enter your Monarch credentials.
4. Map your YNAB accounts to Monarch accounts.
5. Import accounts and transactions into Monarch.

## Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
