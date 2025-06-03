export default {
  deviceUuid: null,
  awaitingOtp: false,
  credentials: { email: '', password: '', otp: '' },
  apiToken: null,

  registerData: [], // Original data from the YNAB register file

  monarchAccounts: null,
  filteredYnabAccounts: [], // Accounts selected for export
  selectedYnabAccounts: new Set() // Accounts locally selected for editing purposes
};
