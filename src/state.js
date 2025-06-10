export default {
  deviceUuid: '550e8400-e29b-51d4-a716-446655440000', //null,
  awaitingOtp: false,
  credentials: { email: 'fazekas.devon+monarch3@gmail.com', password: 'n90WJLg1Eotii*', otp: '' },
  apiToken: "67af1cb416aefd7cf83bd206e3e29e40b9f3727386d6756efefad800ab8486a9",
  // registerData: [], // Original data from the YNAB register file
  registerData: [
    {
        "id": "id-bx041a1aw",
        "name": "Dummy Account 1",
        "modifiedName": "New account 1",
        "type": "brokerage",
        "subtype": "cryptocurrency",
        "transactions": [
            {
                "Account": "Dummy Account 1",
                "Flag": "",
                "Date": "01/01/2025",
                "Payee": "Dummy Payee",
                "Category Group/Category": "Dummy Category",
                "Category Group": "Dummy Group",
                "Category": "Dummy Category",
                "Memo": "Dummy Memo",
                "Outflow": "100.00",
                "Inflow": "0.00",
                "Cleared": "Cleared"
            }
        ],
        "transactionCount": 1,
        "balanceCents": -10000,
        "excluded": false,
        "balance": -100
    },
    {
        "id": "id-j252a4p84",
        "name": "Dummy Account 2",
        "modifiedName": "Dummy Account 2",
        "type": "depository",
        "subtype": "checking",
        "transactions": [
            {
                "Account": "Dummy Account 2",
                "Flag": "",
                "Date": "01/01/2025",
                "Payee": "Dummy Payee",
                "Category Group/Category": "Dummy Category",
                "Category Group": "Dummy Group",
                "Category": "Dummy Category",
                "Memo": "Dummy Memo",
                "Outflow": "100.00",
                "Inflow": "0.00",
                "Cleared": "Cleared"
            }
        ],
        "transactionCount": 1,
        "balanceCents": -10000,
        "excluded": true,
        "balance": -100
    },
    {
        "id": "id-5c55ur3w4",
        "name": "Dummy Account 3",
        "modifiedName": "New account 2",
        "type": "brokerage",
        "subtype": "cryptocurrency",
        "transactions": [
            {
                "Account": "Dummy Account 3",
                "Flag": "",
                "Date": "01/01/2025",
                "Payee": "Dummy Payee",
                "Category Group/Category": "Dummy Category",
                "Category Group": "Dummy Group",
                "Category": "Dummy Category",
                "Memo": "Dummy Memo",
                "Outflow": "100.00",
                "Inflow": "0.00",
                "Cleared": "Cleared"
            }
        ],
        "transactionCount": 1,
        "balanceCents": -10000,
        "excluded": false,
        "balance": -100
    },
],
  monarchAccounts: null,
  selectedYnabAccounts: new Set() // Accounts locally selected for editing purposes
};
