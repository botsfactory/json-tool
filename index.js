const jsonfile = require('jsonfile');
const jsonQuery = require('json-query');
const _ = require('lodash');

var algo = module.exports = {

    /**
     * This method go to path and return the contained object.
     * Use dot notation to specify the path.
     * 
     * @param  {} path
     * @param  {} obj
     */
    goToPositon(path, obj) {
        if (path) {
            let parts = path.split('.');

            while (parts.length) {
                let key = parts.shift();

                if (obj[key] == null) {
                    obj[key] = {};
                    obj = obj[key];

                } else if (key in obj) {
                    obj = obj[key];

                } else {
                    throw new Error(`Path not found: ${path}`);
                }
            }
        }
        return obj;
    },

    /**
     * This method return the object id in the array.
     * 
     * @param  {} id
     * @param  {} arr
     */
    getObjectIndexById(id, arr) {
        return _.findIndex(arr, (obj) => {
            return obj.id == id;
        });
    },

    /**
     * This method read a json file and return it as JS Object.
     * Use '/' in the path to specify the rute.
     * 
     * @param  {} path
     * @param  {} file
     */
    getJsonFile(path, file) {
        let jsonPath = path || '';
        let json = `${jsonPath}${file}.json`;

        return new Promise((fulfill, reject) => {
            jsonfile.readFile(json, (err, jsonObj) => {
                if (err) reject(err);
                else fulfill(jsonObj);
            })
        });
    },

    /**
     * This method read a json file and return it as JS Object synchronously.
     * 
     * @param  {} path
     * @param  {} file
     */
    getJsonFileSync(path, file) {
        let jsonPath = path || '';
        let json = `${jsonPath}${file}.json`;

        return jsonfile.readFileSync(json);
    },

    /**
     * This method return an array of objects filtered by json in array/object.
     * You can search in the array directly if path is null.
     * 
     * @param  {} json
     * @param  {} path
     * @param  {} obj
     */
    getArrayObjectFilered(json, path, obj) {
        let jsonPath = path || '';
        let parentObj = path ? this.goToPositon(path, obj) : obj;

        return _.filter(parentObj, json);
    },

    /**
     * This method return an object filtered by id from an array.
     * 
     * @param  {} id
     * @param  {} path
     * @param  {} obj
     */
    getObjectById(id, path, obj) {
        let jsonPath = path || '';
        let parentObj = path ? this.goToPositon(path, obj) : obj;
        let index = this.getObjectIndexById(id, parentObj);

        return parentObj[index];
    },

    /**
     * This method add a new object to an array in a JS object.
     * You can add new object to array directly if path is null.
     * Use dot notation to specify the path.
     * 
     * @param  {} path
     * @param  {} obj
     * @param  {} newObj
     */
    addObjectToArray(path, obj, newObj) {
        let clonedObj = _.cloneDeep(obj);
        let parentObj = path ? this.goToPositon(path, clonedObj) : clonedObj;

        if (Array.isArray(parentObj)) {
            parentObj.push(newObj);
        }

        return clonedObj;
    },

    /**
     * This method return the object updated with the new value.
     * Use dot notation to specify the path.
     * 
     * @param  {} id
     * @param  {} path
     * @param  {} value
     * @param  {} obj
     */
    updateValueInArray(id, path, value, obj) {
        let clonedObj = _.cloneDeep(obj);
        let parts = path.split('.');
        let parentPath = '';
        let key = '';

        if (parts.length > 1) {
            parentPath = parts.slice(0, -1).join('.');
            key = parts.slice(-1)[0];
        } else {
            parentPath = path;
            key = path;
        }

        let parentObj = this.goToPositon(parentPath, obj);

        if (Array.isArray(parentObj)) {
            let index = this.getObjectIndexById(id, parentObj);
            if (index != -1) {
                parentObj[index][key] = value;
            }
        }

        return obj;
    },

    /**
     * This method replace the object with the specified
     * id for the new object.
     * Use dot notation to specify the path.
     * 
     * @param  {} id
     * @param  {} path
     * @param  {} newObj
     * @param  {} jsonObj
     */
    updateObjectInArray(id, path, newObj, jsonObj) {
        let clonedObj = _.cloneDeep(jsonObj);
        let parentObj = path ? this.goToPositon(path, jsonObj) : clonedObj;

        parentObj = this.deleteObjectFromArray(id, path, clonedObj);
        parentObj = this.addObjectToArray(path, parentObj, newObj);

        return parentObj;
    },

    /**
     * This method replace an object for newObj in the specified path.
     * 
     * @param  {} path
     * @param  {} newObj
     * @param  {} obj
     */
    replaceObject(path, newObj, obj) {
        let clonedObj = _.cloneDeep(obj);
        let parts = path.split('.');
        let parentPath = '';
        let key = '';

        if (parts.length > 1) {
            parentPath = parts.slice(0, -1).join('.');
            key = parts.slice(-1)[0];
        } else {
            parentPath = null;
            key = path;
        }

        let parentObj = this.goToPositon(parentPath, clonedObj);
        parentObj[key] = newObj

        return clonedObj;
    },

    /**
     * This method delete an object from an array in a JS object.
     * 'obj' can be an JS object or directly an array.
     * Use dot notation to specify the path.
     * 
     * @param  {} id
     * @param  {} path
     * @param  {} obj
     */
    deleteObjectFromArray(id, path, obj) {
        let clonedObj = _.cloneDeep(obj);
        let parentObj = path ? this.goToPositon(path, clonedObj) : clonedObj;

        if (Array.isArray(parentObj)) {
            let index = this.getObjectIndexById(id, parentObj);
            parentObj.splice(index, 1);

            if (_.size(parentObj) < 1) {
                parentObj = [];
            }
        }

        return clonedObj;
    },

    /**
     * This method update the specified file with the information
     * in the array object. The file is created if not exist.
     * Use dot notation to specify the path.
     * 
     * @param  {} path
     * @param  {} file
     * @param  {} arrayObject
     */
    saveArrayObject(path, file, arrayObject) {
        let jsonPath = path || '';
        let json = `${jsonPath}${file}.json`;

        return new Promise((fulfill, reject) => {
            jsonfile.writeFile(json, arrayObject, { spaces: 4 }, (err) => {
                if (err) reject(err);
                else fulfill('OK');
            })
        });
    },

    /**
     * This method add an object to an array in a JSON file.
     * Use dot notation to specify the path(keyPath).
     * 
     * @param  {} obj
     * @param  {} keyPath
     * @param  {} file
     * @param  {} filePath
     */
    addObjectToFile(obj, keyPath, file, filePath) {
        return this.getJsonFile(filePath, file)
            .then(json => {
                let newJson = this.addObjectToArray(keyPath, json, obj);
                return newJson;
            })
            .then(jsonToSave => {
                return this.saveArrayObject(filePath, file, jsonToSave)
                    .then(result => {
                        return result;
                    });
            });
    },

    /**
     * This method update specific object for an ID in a JSON file.
     * Use dot notation to specify the path(keyPath).
     * 
     * @param  {} id
     * @param  {} newObj
     * @param  {} keyPath
     * @param  {} file
     * @param  {} filePath
     */
    updateObjectInFile(id, newObj, keyPath, file, filePath) {
        return this.getJsonFile(filePath, file)
            .then(json => {
                let newJson = this.updateObjectInArray(id, keyPath, newObj, json);
                return newJson;
            })
            .then(jsonToSave => {
                return this.saveArrayObject(filePath, file, jsonToSave)
                    .then(result => {
                        return result;
                    });
            });
    },

    /**
     * This method update specific value for a key in a JSON file.
     * Use dot notation to specify the path(keyPath).
     * 
     * @param  {} id
     * @param  {} value
     * @param  {} keyPath
     * @param  {} file
     * @param  {} filePath
     */
    updateValueInFile(id, value, keyPath, file, filePath) {
        return this.getJsonFile(filePath, file)
            .then(json => {
                let newJson = this.updateValueInArray(id, keyPath, value, json);
                return newJson;
            })
            .then(jsonToSave => {
                return this.saveArrayObject(filePath, file, jsonToSave)
                    .then(result => {
                        return result;
                    });
            });
    },

    /**
     * This method delete specific object in a JSON file.
     * Use dot notation to specify the path(keyPath).
     * 
     * @param  {} id
     * @param  {} keyPath
     * @param  {} file
     * @param  {} filePath
     */
    deleteObjectFromFile(id, keyPath, file, filePath) {
        return this.getJsonFile(filePath, file)
            .then(json => {
                let newJson = this.deleteObjectFromArray(id, keyPath, json);
                return newJson;
            })
            .then(jsonToSave => {
                return this.saveArrayObject(filePath, file, jsonToSave)
                    .then(result => {
                        return result;
                    });
            });
    },

    /**
     * This method get specific object by path and id from a JSON file.
     * Use dot notation to specify the path(keyPath).
     * 
     * @param  {} id
     * @param  {} keyPath
     * @param  {} file
     * @param  {} filePath
     */
    getObjectByIdFromFile(id, keyPath, file, filePath) {
        return this.getJsonFile(filePath, file)
            .then(json => {
                let newJson = this.getObjectById(id, keyPath, json);
                return newJson;
            });
    },

    /**
     * This method replace an object in the specified path in a JSON file.
     * Use dot notation to specify the path(keyPath).
     * 
     * @param  {} newObj
     * @param  {} keyPath
     * @param  {} file
     * @param  {} filePath
     */
    replaceObjectInFile(newObj, keyPath, file, filePath) {
        return this.getJsonFile(filePath, file)
            .then(json => {
                let newJson = this.replaceObject(keyPath, newObj, json);
                return newJson;
            })
            .then(jsonToSave => {
                return this.saveArrayObject(filePath, file, jsonToSave)
                    .then(result => {
                        return result;
                    });
            });
    }
}