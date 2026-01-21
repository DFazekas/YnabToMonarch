import getLogger, { setLoggerConfig } from '../utils/logger.js';


const categoryGroupLogger = getLogger('CategoryGroup');

setLoggerConfig({
  namespaces: { CategoryGroup: false },
  methods: {},
  levels: { debug: true, group: true, groupEnd: true },
});

// TODO: Implement category group features.

export default class CategoryGroup {
  constructor(id) {

    /** Unique identifier for the category group. 
     * @type {string}
    */
    this.id = id;

    /** The name of the category group. 
     * @type {string}
    */
    this._name = "";

    /** Whether the category group is hidden. 
     * @type {boolean}
    */
    this._isHidden = false;
  }

  toObject() {
    return {
      id: this.id,
      name: this._name,
      isHidden: this._isHidden
    };
  }
}