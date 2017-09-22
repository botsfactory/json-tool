const jsonfile = require('jsonfile');
const jsonQuery = require('json-query');
const _ = require('lodash');

/**
 * This method read a json file and return it as JS Object.
 * Use '/' in the path to specify the rute.
 * 
 * @param  {} path
 * @param  {} file
 */
function getJsonFile(path, file) {
    let jsonPath = path || '';
    let json = `${jsonPath}${file}.json`;

    return new Promise((fulfill, reject) => {
        jsonfile.readFile(json, (err, jsonObj) => {
            if (err) reject(err);
            else fulfill(jsonObj);
        })
    });
}

/**
 * This method read a json file and return it as JS Object synchronously.
 * 
 * @param  {} path
 * @param  {} file
 */
function getJsonFileSync(path, file) {
    let jsonPath = path || '';
    let json = `${jsonPath}${file}.json`;

    return jsonfile.readFileSync(json);
}

/**
 * This method return an array of objects filtered by key,
 * subkey and value.
 * 
 * @param  {} obj
 * @param  {} key
 * @param  {} subkey
 * @param  {} value
 */
function getArrayObjectFilered(obj, key, subkey, value) {
    let query = `${key}[**][*${subkey}=${value}]`;
    let filteredJson = JSON.stringify(jsonQuery(query, { data: obj }).value);

    return filteredJson;
}

/**
 * This method return the array with the object updated with new value.
 * 
 * @param  {} jsonObject
 * @param  {} key
 * @param  {} subkey
 * @param  {} value
 * @param  {} newValue
 */
function updateArrayObject(obj, key, subkey, value, newValue) {
    let newJson = obj[key];

    newJson.map((obj) => {
        if (obj[subkey] == value) {
            obj[subkey] = newValue;
        }

        return obj;
    });

    return obj;
}

/**
 * This method go to path and return the contained object.
 * Use dot notation to specify the path.
 * 
 * @param  {} path
 * @param  {} obj
 */
function goToPositon(path, obj) {
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
}

/**
 * This method add a new object to an array in a JS object.
 * You can add new object to array directly if path is null.
 * Use dot notation to specify the path.
 * 
 * @param  {} path
 * @param  {} obj
 * @param  {} newObj
 */
function addObjectToArray(path, obj, newObj) {
    let clonedObj = _.cloneDeep(obj);
    let parentObj = path ? goToPositon(path, clonedObj) : clonedObj;

    if (Array.isArray(parentObj)) {
        parentObj.push(newObj);
    }

    return clonedObj;
}

/**
 * This method delete a new object from an array in a JS object.
 * 'obj' can be an JS object or directly an array.
 * Use dot notation to specify the path.
 * 
 * @param  {} path
 * @param  {} obj
 * @param  {} newObj
 */
function deleteObjectFromArray(path, obj, objToDelete) {
    let clonedObj = _.cloneDeep(obj);
    let parentObj = path ? goToPositon(path, clonedObj) : clonedObj;

    if (Array.isArray(parentObj)) {
        let objIndex = _.findIndex(parentObj, objToDelete);
        parentObj.splice(objIndex, 1);
    }

    return clonedObj;
}

/**
 * This method return the object updated with the new value.
 * Use dot notation to specify the path.
 * 
 * @param  {} obj
 * @param  {} path
 * @param  {} currentValue
 * @param  {} newValue
 */
function updateObjectInArray(path, obj, currentValue, newValue) {
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

    let parentObj = goToPositon(parentPath, clonedObj);

    if (Array.isArray(parentObj)) {
        parentObj.map((obj) => {
            if (key in obj && obj[key] == currentValue) {
                obj[key] = newValue;
            }

            return obj;
        });
    }

    return clonedObj;
}

/**
 * This method update the specified file with the information
 * in the array object. The file is created if not exist.
 * Use dot notation to specify the path.
 * 
 * @param  {} path
 * @param  {} file
 * @param  {} arrayObject
 */
function saveArrayObject(path, file, arrayObject) {
    let jsonPath = path || '';
    let json = `${jsonPath}${file}.json`;

    return new Promise((fulfill, reject) => {
        jsonfile.writeFile(json, arrayObject, { spaces: 4 }, (err) => {
            if (err) reject(err);
            else fulfill('OK');
        })
    });
}

/**
 * This method add an object to an array in a json file.
 * Use dot notation to specify the path(keyPath).
 * 
 * @param  {} obj
 * @param  {} keyPath
 * @param  {} file
 * @param  {} filePath
 */
function addObjectToFile(obj, keyPath, file, filePath) {
    return getJsonFile(filePath, file)
        .then(json => {
            let newJson = addObjectToArray(keyPath, json, obj);
            return newJson;
        })
        .then(jsonToSave => {
            return saveArrayObject(filePath, file, jsonToSave)
                .then(result => {
                    return result;
                });
        });
}

/**
 * This method update specific value for a key in a json.
 * Use dot notation to specify the path(keyPath).
 * 
 * @param  {} value
 * @param  {} newValue
 * @param  {} keyPath
 * @param  {} file
 * @param  {} filePath
 */
function updateObjectInFile(value, newValue, keyPath, file, filePath) {
    return getJsonFile(filePath, file)
        .then(json => {
            let newJson = updateObjectInArray(keyPath, json, value, newValue);
            return newJson;
        })
        .then(jsonToSave => {
            return saveArrayObject(filePath, file, jsonToSave)
                .then(result => {
                    return result;
                });
        });
}

/**
 * This method delete specific object for a key in a json.
 * Use dot notation to specify the path(keyPath).
 * 
 * @param  {} value
 * @param  {} newValue
 * @param  {} keyPath
 * @param  {} file
 * @param  {} filePath
 */
function deleteObjectFromFile(obj, keyPath, file, filePath) {
    return getJsonFile(filePath, file)
        .then(json => {
            let newJson = deleteObjectFromArray(keyPath, json, objToDelete);
            return newJson;
        })
        .then(jsonToSave => {
            return saveArrayObject(filePath, file, jsonToSave)
                .then(result => {
                    return result;
                });
        });
}

module.exports.getJsonFile = getJsonFile;
module.exports.getJsonFileSync = getJsonFileSync;
module.exports.getArrayObjectFilered = getArrayObjectFilered;

module.exports.addObjectToArray = addObjectToArray;
module.exports.addObjectToFile = addObjectToFile;

module.exports.updateArrayObject = updateArrayObject;
module.exports.updateObjectInArray = updateObjectInArray;
module.exports.updateObjectInFile = updateObjectInFile;

module.exports.deleteObjectFromArray = deleteObjectFromArray;
module.exports.deleteObjectFromFile = deleteObjectFromFile;

module.exports.goToPositon = goToPositon;
module.exports.saveArrayObject = saveArrayObject;