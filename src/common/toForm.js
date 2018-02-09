const toForm ={
	getForm(data, form = {}, rootKey = ""){
        Object.keys(data).forEach(key => {
            let obj = data[key];
            let rk = rootKey !== "" ? rootKey + "." + key : key;
            if(this.isObject(obj)){
                this.getForm(obj, form, rk);
            } else {
                form[rk] = obj;
            }
        });
        return form;
    },
    /**
	 * Check the obj whether is function or not
	 * @param {*} obj
	 * @returns {boolean}
	 */
	isFunction (obj) {
	    return typeof obj === 'function';
	},
	
	/**
	 * Check the obj whether is number or not
	 * @param {*} obj
	 * @returns {boolean}
	 */
	isNumber (obj) {
	    return typeof obj === 'number' || Object.prototype.toString.call(obj) === '[object Number]';
	},
	
	/**
	 * Check the obj whether is string or not
	 * @param {*} obj
	 * @returns {boolean}
	 */
	isString (obj) {
	    return typeof obj === 'string' || Object.prototype.toString.call(obj) === '[object String]';
	},
	
	/**
	 * Check the obj whether is array or not
	 * @param {*} obj
	 * @returns {boolean}
	 */
	isArray (obj) {
	    return Array.isArray(obj) ||
	        (typeof obj === 'object' && Object.prototype.toString.call(obj) === '[object Array]');
	},
	
	/**
	 * Check the obj whether is undefined or not
	 * @param {*} obj
	 * @returns {boolean}
	 */
	isUndefined (obj) {
	    return typeof obj === 'undefined';
	},
	
	/**
	 * Check the obj whether is object or not
	 * @param {*} obj
	 * @returns {boolean}
	 */
	isObject (obj) {
	    return typeof obj === "object" && Object.prototype.toString.call(obj) === '[object Object]';
	}

};
module.exports = toForm;
