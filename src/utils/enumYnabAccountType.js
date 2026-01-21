export const AccountType = Object.freeze({
  CHECKING: 'checking',
  SAVINGS: 'savings',
  CASH: 'cash',
  CREDIT_CARD: 'creditCard',
  LINE_OF_CREDIT: 'lineOfCredit',
  OTHER_ASSET: 'otherAsset',
  OTHER_LIABILITY: 'otherLiability',
  MORTGAGE: 'mortgage',
  AUTO_LOAN: 'autoLoan',
  STUDENT_LOAN: 'studentLoan',
  PERSONAL_LOAN: 'personalLoan',
  MEDICAL_DEBT: 'medicalDebt',
  OTHER_DEBT: 'otherDebt',
});

export const AccountTypeValues = Object.freeze(Object.values(AccountType));
