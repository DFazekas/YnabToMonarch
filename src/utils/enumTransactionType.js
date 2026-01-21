export const TransactionType = Object.freeze({
  PAYMENT: 'payment', 
  REFUND: 'refund',
  FEE: 'fee',
  INTEREST: 'interest',
  ESCROW: 'escrow',
  BALANCE_ADJUSTMENT: 'balanceAdjustment',
  CREDIT: 'credit',
  CHARGE: 'charge'
});

export const TransactionTypeValues = Object.freeze(Object.values(TransactionType));
