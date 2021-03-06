'use strict';
const mongoose = require('mongoose');
const Validator = require('./validator');
class Model {
    constructor(model) {
        Validator.validateModel(model);
        if(typeof model === 'string') {
            this.model = mongoose.model(model);
        } else {
            this.model = model;
        }
        this._methods = this._methodsVersion();
        this.modelName = this.model.modelName;
    }
    _methodsVersion() {
        const latestVersion = mongoose.version >= '5';
        return {
            count: latestVersion && 'countDocuments' || 'count'
        };
    }
    _parseOptions(query) {
        let options = {
            sort:'_id'
        };
        if(query.skip) {
            options.skip = parseInt(query.skip);
        }
        if(query.limit) {
            options.limit = parseInt(query.limit);
        }
        if(query.sort) {
            options.sort = query.sort;
        }
        if(query.select) {
            options.select = query.select;
        }
        return options;
    }
    _parsePopulate(query) {
        let populate = false;
        if(query && query.populate) {
            try {
                populate = JSON.parse(query.populate);
            } catch (e) {
                populate = query.populate;
            }
        }
        return populate;
    }
    _parseConditions(conditions) {
        if(!conditions) {
            return {};
        }
        Validator.validateConditions(conditions);
        if(typeof conditions === 'object') {
            return conditions;
        }
        return JSON.parse(conditions);
    }
    findById(id, queryParams) {
        const populate = this._parsePopulate(queryParams);
        let query = this.model.findById(id);
        if(populate) {
            query = query.populate(populate);
        }
        return query.then((doc) => {
            Validator.validateDocumentExist(doc, 404);
            return doc;
        });
    }
    find(queryParams) {
        const conditions = this._parseConditions(queryParams.conditions);
        const populate = this._parsePopulate(queryParams);
        const select = queryParams.select || null;
        const options = this._parseOptions(queryParams);
        let query  = this.model.find(conditions, select, options);
        if(populate) {
            query = query.populate(populate);
        }
        return query;
    }
    count(query) {
        const conditions = query && this._parseConditions(query.conditions) || {};
        let method = this._methods.count;
        if(!Object.keys(conditions).length) {
            method = 'estimatedDocumentCount';
        }
        return this.model[method](conditions);
    }
    distinct(query) {
        return this.model.distinct(query);
    }
    updateByConditions(conditions, set) {
        Validator.validateConditions(conditions);
        return this.model.findOne(this._parseConditions(conditions))
            .then((doc) => {
                Validator.validateDocumentExist(doc, 404);
                return doc;
            })
            .then((doc) => {
                Object.assign(doc, set);
                return doc.save();
            });
    }
    updateById(id, set) {
        return this.model.findOne({_id:id})
            .then((doc) => {
                Validator.validateDocumentExist(doc, 404);
                return doc;
            })
            .then((doc) => {
                Object.assign(doc, set);
                return doc.save();
            });
    }
    delete(id) {
        return this.findById(id)
            .then((doc) => {
                Validator.validateDocumentExist(doc);
                return this.model.deleteOne({_id:id})
                    .then(() => {
                        return doc;
                    });
            });
    }
    create(body) {
        let newDoc = new this.model(body);
        return newDoc.save();
    }
}

module.exports = Model;
