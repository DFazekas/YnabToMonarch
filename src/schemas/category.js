import getLogger, { setLoggerConfig } from '../utils/logger.js';
import { GoalType, GoalTypeValues } from '../utils/enumGoalType.js';


const categoryLogger = getLogger('Category');

setLoggerConfig({
  namespaces: { Category: false },
  methods: {},
  levels: { debug: true, group: true, groupEnd: true },
});

// TODO: Implement category features.

export default class Category {
  constructor(id, categoryGroupId) {

    /** Unique identifier for the category. 
     * @type {string}
    */
    this.id = id;

    /** Unique identifier for the parent category group. 
     * @type {string}
    */
    this._categoryGroupId = categoryGroupId;

    /** The name of the category. 
     * @type {string}
    */
    this._name = "";

    /** Whether the category is hidden. 
     * @type {boolean}
    */
    this._isHidden = false;

    /** A note associated with the category. 
     * @type {string|null}
    */
    this._note = null;

    this._budgetedDollars = 0.00;
    this._activityDollars = 0.00;
    this._balanceDollars = 0.00;

    // TODO: Implement goal features.

    /** The type of goal, if the category has a goal
     * @type {null|GoalType}
     */
    this._goalType = null;

    /** Indicates the monthly rollover behaviour for "NEED"-type goals.
     * 
     * When `true`, the goal will always ask for the target amount in the new month ("Set Aside").
     * When `false`, previous month category funding is used ("Refill"). For other goal types, this field will be `null`.
     * @type {boolean|null}
    */
    this._doesGoalNeedWholeAmount = null;

    /** A day offset modifier for the goal's due date.
     * 
     * When goal_cadence is `2` (Weekly), this value specifies which day of the week the goal is due (`0 = Sunday`, `6 = Saturday`).
     * Otherwise, this value specifies which day of the month the goal is due (`1 = 1st`, `31 = 31st`, `null = Last day of Month`).
     * @type {number|null}
     */
    this._goalDay = null;

    /** The goal cadence. Value in range 0-14.
     * 
     * There are two subsets of these values which behave differently.
     * For values 0, 1, 2, and 13, the goal's due date repeats every `goal_cadence` * `goal_cadence_frequency`, where 0 = None, 1 = Monthly, 2 = Weekly, and 13 = Yearly.
     * For example, `goal_cadence` 1 with `goal_cadence_frequency` 2 means the goal is due every other month.
     * For values 3-12 and 14, `goal_cadence_frequency` is ignored and the goal's due date repeats every `goal_cadence`, where 3 = Every 2 Months, 4 = Every 3 Months, ..., 12 = Every 11 Months, and 14 = Every 2 Years.
     * @type {null|GoalTypeValues
     */
    this._goalCadence = null;

    /** The goal cadence frequency.
     * 
     * When goal_cadence is 0, 1, 2, or 13, a goal's due date repeats every `goal_cadence` * `goal_cadence_frequency`.
     * For example, `goal_cadence` 1 with `goal_cadence_frequency` 2 means the goal is due every other month. When `goal_cadence` is 3-12 or 14, `goal_cadence_frequency` is ignored.
     * @type {null|number}
     */
    this._goalCadenceFrequency = null;

    /** The month a goal was created
     * @type {string|null}
     */
    this._goalCreationMonth = null;

    /** The goal target amount in dollars.
     * @type {float|null}
     */
    this._goalTargetDollars = null;

    /** The original target month for the goal to be completed. Only some goal types specify this date.
     * @type {string|null}
     */
    this._goalTargetMonth = null;

    /** The percentage completion of the goal.
     * @type {float|null}
    */
    this._goalPercentageComplete = null;

    /** The number of months, including the current month, left in the current goal period.
     * @type {number|null}
    */
    this._goalMonthstoBudget = null;

    /** The amount of funding still needed in the current month to stay on track towards completing the goal within the current goal period.
     * 
     * This amount will generally correspond to the 'Underfunded' amount in the web and mobile clients except when viewing a category with a Needed for Spending Goal in a future month.
     * 
     * The web and mobile clients will ignore any funding from a prior goal period when viewing category with a Needed for Spending Goal in a future month.
     * @type {float|null}
     */
    this._goalUnderFundedDollars = null;

    /** The total amount funded, in dollars, towards the goal within the current goal period. 
     * @type {float|null}
    */
    this._goalOverallFundedDollars = null;

    /** The amount of funding, in dollars, still needed to complete the goal within the current goal period.
     * @type {float|null}
     */
    this._goalOverallLeftDollars = null;

    /** The date/time the goal was snoozed.
     * 
     * If the goal is not snoozed, this will be null.
     * @type {Date|null}
    */
    this._goalSnoozedAt = null;
  }

  toObject() {
    return {
      id: this.id,
      categoryGroupId: this._categoryGroupId,
      name: this._name,
      isHidden: this._isHidden,
      note: this._note,
      budgetedDollars: this._budgetedDollars,
      activityDollars: this._activityDollars,
      balanceDollars: this._balanceDollars,
      goalType: this._goalType,
      doesGoalNeedWholeAmount: this._doesGoalNeedWholeAmount,
      goalDay: this._goalDay,
      goalCadence: this._goalCadence,
      goalCadenceFrequency: this._goalCadenceFrequency,
      goalCreationMonth: this._goalCreationMonth,
      goalTargetDollars: this._goalTargetDollars,
      goalTargetMonth: this._goalTargetMonth,
      goalPercentageComplete: this._goalPercentageComplete,
      goalMonthstoBudget: this._goalMonthstoBudget,
      goalUnderFundedDollars: this._goalUnderFundedDollars,
      goalOverallFundedDollars: this._goalOverallFundedDollars,
      goalOverallLeftDollars: this._goalOverallLeftDollars,
      goalSnoozedAt: this._goalSnoozedAt
    };
  }
}