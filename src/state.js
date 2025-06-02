export default {
  deviceUuid: null,
  awaitingOtp: false,
  credentials: { email: '', password: '', otp: '' },
  apiToken: null,

  // New structure for parsed data
  registerData: [],  // This now holds enriched account objects (see parser below)

  monarchAccounts: null,
  filteredYnabAccounts: [],
  selectedYnabAccounts: []
};
