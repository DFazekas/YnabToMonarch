# YNAB to Monarch Money

[![Netlify Status](https://api.netlify.com/api/v1/badges/6eccae9f-57ac-4659-ab15-5242c66e525c/deploy-status)](https://app.netlify.com/sites/ynab-to-monarch/deploys)

A tool to migrate YNAB transaction records into Monarch Money.

## Important Disclaimers

**⚠️ Third-Party Application Notice**

This application is **NOT** affiliated, associated, or in any way officially connected with YNAB (You Need A Budget) or Monarch Money, or any of their subsidiaries or affiliates.

- **YNAB**: The official YNAB website can be found at [https://www.ynab.com](https://www.ynab.com). The names "YNAB" and "You Need A Budget", as well as related names, tradenames, marks, trademarks, emblems, and images are registered trademarks of YNAB.

- **Monarch Money**: The official Monarch Money website can be found at [https://www.monarchmoney.com](https://www.monarchmoney.com). All Monarch Money trademarks and service marks are the property of Monarch Money.

This is an independent, community-created tool designed to help users transfer their financial data between these platforms. Use at your own discretion and always backup your financial data before performing any transfers.

## Features

- Upload YNAB Register CSV file
- Map YNAB accounts to Monarch accounts
- Generate account-specific transaction files

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20.19.0 (use `.nvmrc` to pin locally)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/ynabtomonarch.git
   cd ynabtomonarch
   ```

2. Match the required Node version:

   ```sh
   nvm install
   nvm use
   ```

3. Install dependencies:

   ```sh
   npm install
   ```

4. Run the cloud functions locally: `npm run functions`.
5. Run the website locally: `npm run website`.

## Usage

Visit the live site at [https://ynab-to-monarch.netlify.app/](https://ynab-to-monarch.netlify.app/)

1. Upload your YNAB Register CSV file.
2. Download the generated transaction files.
3. Enter your Monarch credentials.
4. Map your YNAB accounts to Monarch accounts.
5. Import accounts and transactions into Monarch.

## YNAB OAuth Redirect

- Authorization callbacks are handled at `/oauth/ynab/callback`, so configure YNAB to redirect to `https://ynab-to-monarch.netlify.app/oauth/ynab/callback` after the user grants access.

## Privacy & Security

**🔒 Your Data Security is Our Priority**

- **Local Processing**: All data processing happens in your browser - we do not store your financial data on our servers
- **No Data Collection**: Your YNAB and Monarch credentials are stored locally in your browser only
- **Secure Transmission**: All API communications use HTTPS encryption
- **No Third-Party Sharing**: Your data is only transferred between YNAB and Monarch Money as you explicitly authorize

For complete details, please review our:
- [Privacy Policy](./public/privacy.html)
- [Terms of Service](./public/terms.html)
- [Support & FAQ](./public/support.html)

## Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

**Trademark Notice**: This project is not affiliated with YNAB or Monarch Money. All trademarks are the property of their respective owners. Please refer to the [Privacy Policy](./public/privacy.html), [Terms of Service](./public/terms.html), and [Support](./public/support.html) pages for more information about data handling and legal compliance.
