var _isFunction = function(obj) {
    return typeof(obj) === 'function';
};
var _isObject = function(obj) {
    return obj === Object(obj);
};
var _isArray = function(obj) {
    return toString.call(obj) == '[object Array]';
};
var _isDate = function(obj) {
    return toString.call(obj) == '[object Date]';
};
var _isRegExp = function(obj) {
    return toString.call(obj) == '[object RegExp]';
};
var _isBoolean = function(obj) {
    return toString.call(obj) == '[object Boolean]';
};
// Performant way to determine if obj coerces to a number
var _isNumerical = function(obj) {
    obj = obj - 0;
    return obj === obj;
};

var camelize = function(string) {
    if (_isNumerical(string)) {
        return string;
    }
    string = string.replace(/[\-_\s]+(.)?/g, function(match, chr) {
        return chr ? chr.toUpperCase() : '';
    });
    // Ensure 1st char is always lowercase
    return string.substr(0, 1).toLowerCase() + string.substr(1);
};

var camelizeKeys = function(obj, options) {
    if(!_isObject(obj) || _isDate(obj) || _isRegExp(obj) || _isBoolean(obj) || _isFunction(obj)) {
        return obj;
    }

    var output,
        i = 0,
        l = 0;

    if(_isArray(obj)) {
        output = [];
        for(l=obj.length; i<l; i++) {
            output.push(camelizeKeys(obj[i], options));
        }
    }
    else {
        output = {};
        for(var key in obj) {
            if(Object.prototype.hasOwnProperty.call(obj, key)) {
                output[camelize(key, options)] = camelizeKeys(obj[key], options);
            }
        }
    }
    return output;
};