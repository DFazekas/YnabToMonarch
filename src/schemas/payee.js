import getLogger, { setLoggerConfig } from '../utils/logger.js';


const payeeLogger = getLogger('Payee');

setLoggerConfig({
  namespaces: { Payee: false },
  methods: {},
  levels: { debug: true, group: true, groupEnd: true },
});

// TODO: Implement payee features.

export default class Payee {
  constructor(id, name) {
    /** Unique identifier for the payee.
     * @type {string}
    */
    this.id = id;

    /** Name of the payee. 
     * @type {string}
    */
    this._name = name;

    /** If a transfer payee, the `account_id` to which this payee transfer to.
     * @type {string|null}
     */
    this._transferAccountId = null;
  }

  toObject() {
    return {
      id: this.id,
      name: this._name,
      transferAccountId: this._transferAccountId
    };
  }
}