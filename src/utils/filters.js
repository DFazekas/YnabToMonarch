import { getAccountTypeByName, getSubtypeByName } from './accountTypeUtils.js';

export default class Filters {
  constructor() {
    this.pendingFilters = new FilterCriteria();
    this.activeFilters = new FilterCriteria();
    this.searchQuery = '';
  }

  clearPendingFilters() {
    this.pendingFilters.clear();
  }

  clearActiveFilters() {
    this.activeFilters.clear();
  }

  applyPendingToActive() {
    this.activeFilters = Object.assign(new FilterCriteria(), this.pendingFilters);
  }

  getNumberOfActiveFilters() {
    let count = 0;
    if (this.activeFilters.accountName) count++;
    if (this.activeFilters.types.size > 0) count++;
    if (this.activeFilters.subtypes.size > 0) count++;
    if (this.activeFilters.transactionsMin !== null) count++;
    if (this.activeFilters.transactionsMax !== null) count++;
    if (this.activeFilters.balanceMin !== null) count++;
    if (this.activeFilters.balanceMax !== null) count++;
    if (this.activeFilters.inclusion !== 'all') count++;
    return count;
  }

  hasPendingChanges() {
    return (
      this.accountNameHasPendingChange() ||
      this.typesHavePendingChange() ||
      this.subtypesHavePendingChange() ||
      this.transactionMinHasPendingChange() ||
      this.transactionMaxHasPendingChange() ||
      this.balanceMinHasPendingChange() ||
      this.balanceMaxHasPendingChange() ||
      this.inclusionHasPendingChange()
    );
  }

  passesFilters(account) {
    if (this.activeFilters.accountName) {
      const accountName = this.activeFilters.nameCaseSensitive ? account.current.name : account.current.name.toLowerCase();
      const filterName = this.activeFilters.nameCaseSensitive ? this.activeFilters.accountName : this.activeFilters.accountName.toLowerCase();

      if (this.activeFilters.nameMatchType === 'exact') {
        if (accountName !== filterName) return false;
      } else {
        if (!accountName.includes(filterName)) return false;
      }
    }

    // Type filter
    if (this.activeFilters.types.size > 0) {
      const accountType = getAccountTypeByName(account.current.type);
      const typeDisplay = accountType ? accountType.typeDisplay : (account.current.type || '');
      if (!this.activeFilters.types.has(typeDisplay)) return false;
    }

    // Subtype filter
    if (this.activeFilters.subtypes.size > 0) {
      const accountSubtype = getSubtypeByName(account.current.type, account.current.subtype);
      const subtypeDisplay = accountSubtype ? accountSubtype.display : (account.current.subtype || '');
      if (!this.activeFilters.subtypes.has(subtypeDisplay)) return false;
    }

    // Transaction count filter
    const transactionCount = account.transactionCount || 0;
    if (this.activeFilters.transactionsMin !== null && transactionCount < this.activeFilters.transactionsMin) return false;
    if (this.activeFilters.transactionsMax !== null && transactionCount > this.activeFilters.transactionsMax) return false;

    // Balance filter
    const balance = parseFloat(account.balance) || 0;
    if (this.activeFilters.balanceMin !== null && balance < this.activeFilters.balanceMin) return false;
    if (this.activeFilters.balanceMax !== null && balance > this.activeFilters.balanceMax) return false;

    // Inclusion filter
    if (this.activeFilters.inclusion === 'included' && !account.included) return false;
    if (this.activeFilters.inclusion === 'excluded' && account.included) return false;

    return true;
  }

  accountNameHasPendingChange() {
    return this.activeFilters.accountName !== this.pendingFilters.accountName ||
      this.activeFilters.nameMatchType !== this.pendingFilters.nameMatchType ||
      this.activeFilters.nameCaseSensitive !== this.pendingFilters.nameCaseSensitive;
  }

  transactionMinHasPendingChange() {
    return this.activeFilters.transactionsMin !== this.pendingFilters.transactionsMin;
  }

  transactionMaxHasPendingChange() {
    return this.activeFilters.transactionsMax !== this.pendingFilters.transactionsMax;
  }

  balanceMinHasPendingChange() {
    return this.activeFilters.balanceMin !== this.pendingFilters.balanceMin;
  }

  balanceMaxHasPendingChange() {
    return this.activeFilters.balanceMax !== this.pendingFilters.balanceMax;
  }

  typesHavePendingChange() {
    const af = this.activeFilters;
    const pf = this.pendingFilters;
    if (af.types.size !== pf.types.size) return true;
    return ![...pf.types].every(t => af.types.has(t));
  }

  subtypesHavePendingChange() {
    const af = this.activeFilters;
    const pf = this.pendingFilters;
    if (af.subtypes.size !== pf.subtypes.size) return true;
    return ![...pf.subtypes].every(s => af.subtypes.has(s));
  }

  inclusionHasPendingChange() {
    return this.activeFilters.inclusion !== this.pendingFilters.inclusion;
  }

  setSearchQuery(str) {
    this.searchQuery = str.toLowerCase();
  }
}

class FilterCriteria {
  constructor() {
    this.accountName = '';
    this.nameMatchType = 'contains';
    this.nameCaseSensitive = false;
    this.types = new Set();
    this.subtypes = new Set();
    this.transactionsMin = null;
    this.transactionsMax = null;
    this.balanceMin = null;
    this.balanceMax = null;
    this.inclusion = 'all'; // 'all', 'included', 'excluded'
  }

  clear() {
    this.accountName = '';
    this.nameMatchType = 'contains';
    this.nameCaseSensitive = false;
    this.types.clear();
    this.subtypes.clear();
    this.transactionsMin = null;
    this.transactionsMax = null;
    this.balanceMin = null;
    this.balanceMax = null;
    this.inclusion = 'all';
  }
}