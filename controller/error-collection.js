'use strict';

class ErrorCollection {
    static invalidModel(model) {
        throw new Error(`model "${model}" is not valid.`);
    }
    static invalidConditions(conditions) {
        let condStr = conditions && JSON.parse(conditions) || conditions;
        throw new Error(`invalid conditions json: "${condStr}".`);
    }
    static malformedConditions(conditions, parseError) {
        const parseMsg = parseError && parseError.message || '';
        throw new Error(`malformed conditions json: "${conditions}". ${parseMsg}`);
    }
    static paramRequired(paramsString, status) {
        const error = new Error(`params ${paramsString} required`);
        error.status = status;
        throw error;
    }
    static documentNotFound(status) {
        const error = new Error('Document not found.');
        error.statys = status;
        throw error;
    }
}

module.exports = ErrorCollection;