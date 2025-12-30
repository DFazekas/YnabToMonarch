/**
 * AccountReview View - Entry point for the account review page
 * Delegates all logic to AccountReviewController
 */
import AccountReviewController from './controllers/AccountReviewController.js';

let controller;

export default function initAccountReviewView() {
  // Accounts singleton is already initialized and available via state.accounts
  controller = new AccountReviewController();
  controller.init();
}
