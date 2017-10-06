const jsonfile = require('jsonfile');
const jsonQuery = require('json-query');
const fs = require('fs');
const _ = require('lodash');

module.exports = {

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
     * This method return an array of objects filtered from array/object.
     * 'filer' must be a json object. It's used to filter.
     * You can search in the array directly if path is null.
     * 
     * @param  {} filter
     * @param  {} path
     * @param  {} obj
     */
    getArrayObjectFilered(filter, path, obj) {
        let jsonPath = path || '';
        let parentObj = path ? this.goToPositon(path, obj) : obj;
        return _.filter(parentObj, filter);
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
     * 'filer' must be a json object. It's used to filter the object to update.
     * Use dot notation to specify the path.
     * 
     * @param  {} filter
     * @param  {} path
     * @param  {} value
     * @param  {} obj
     */
    updateValueInArray(filter, path, value, obj) {
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
            let index = _.findIndex(parentObj, filter);
            if (index != -1) {
                parentObj[index][key] = value;
            }
        }

        return obj;
    },

    /**
     * This method replace the object filtered for the new object.
     * 'filer' must be a json object. It's used to filter the object to update.
     * 'filter' must be null if the object in path is not an array.
     * Use dot notation to specify the path.
     * 
     * @param  {} filter
     * @param  {} path
     * @param  {} newObj
     * @param  {} jsonObj
     */
    updateObjectInArray(filter, path, newObj, jsonObj) {
        let clonedObj = _.cloneDeep(jsonObj);
        let parentObj = path ? this.goToPositon(path, jsonObj) : clonedObj;

        if (Array.isArray(parentObj)) {
            parentObj = this.deleteObjectFromArray(filter, path, clonedObj);
            parentObj = this.addObjectToArray(path, parentObj, newObj);

        } else {
            parentObj = newObj;
        }


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
     * 'filer' must be a json object. It's used to filter the object to delete.
     * Use dot notation to specify the path.
     * 
     * @param  {} filter
     * @param  {} path
     * @param  {} obj
     */
    deleteObjectFromArray(filter, path, obj) {
        let clonedObj = _.cloneDeep(obj);
        let parentObj = path ? this.goToPositon(path, clonedObj) : clonedObj;

        if (Array.isArray(parentObj)) {
            let index = _.findIndex(parentObj, filter);
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
     * 'filer' must be a json object. It's used to filter the object to update.
     * 'filter' must be null if the object in path is not an array.
     * Use dot notation to specify the path(keyPath).
     * 
     * @param  {} filter
     * @param  {} newObj
     * @param  {} keyPath
     * @param  {} file
     * @param  {} filePath
     */
    updateObjectInFile(filter, newObj, keyPath, file, filePath) {
        return this.getJsonFile(filePath, file)
            .then(json => {
                let newJson = this.updateObjectInArray(filter, keyPath, newObj, json);
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
     * 'filer' must be a json object. It's used to filter the object to update.
     * Use dot notation to specify the path(keyPath).
     * 
     * @param  {} filter
     * @param  {} value
     * @param  {} keyPath
     * @param  {} file
     * @param  {} filePath
     */
    updateValueInFile(filter, value, keyPath, file, filePath) {
        return this.getJsonFile(filePath, file)
            .then(json => {
                let newJson = this.updateValueInArray(filter, keyPath, value, json);
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
     * 'filer' must be a json object. It's used to filter the object to delete.
     * Use dot notation to specify the path(keyPath).
     * 
     * @param  {} filter
     * @param  {} keyPath
     * @param  {} file
     * @param  {} filePath
     */
    deleteObjectFromFile(filter, keyPath, file, filePath) {
        return this.getJsonFile(filePath, file)
            .then(json => {
                let newJson = this.deleteObjectFromArray(filter, keyPath, json);
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
     * This method get specific object from a JSON file.
     * You can filter the content if the object contains an array.
     * 'filer' must be a json object.
     * 'filer' can be null.
     * Use dot notation to specify the path(keyPath).
     * 
     * @param  {} filter
     * @param  {} keyPath
     * @param  {} file
     * @param  {} filePath
     */
    getObjectFromFile(filter, keyPath, file, filePath) {
        return this.getJsonFile(filePath, file)
            .then(json => {
                let newJson;
                let parentObj = this.goToPositon(keyPath, json);

                if (filter && Array.isArray(parentObj)) {
                    newJson = this.getArrayObjectFilered(filter, keyPath, json)[0];
                } else {
                    newJson = parentObj;
                }
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
    },

    /** This method get all JSONs files in the folder and return each file
     *  in an JSONs array with the file name and content.
     * 
     * @param  {} path
     */
    async getFolderContent(path) {
        let fileNames = fs.readdirSync(path);

        if (fileNames.length > 0) {
            let filesContent = fileNames.map(async (fileName) => {
                let name = fileName.split('.')[0];
                let file = {};

                file.name = name;
                file.content = await this.getJsonFile(`${path}/`, name);

                return file;
            });

            return Promise.all(filesContent);
        }
    },

    /**
     * This method get the files in a path and return the conent in a unique JSON file.
     * 
     * @param  {} path
     */
    async getFolderContentInAJson(path) {
        let arrContent = await this.getFolderContent(path);
        let json = {};

        arrContent.forEach(file => {
            json[file.name] = file.content;
        });

        return json;
    }
}