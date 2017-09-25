const jsonfile = require('jsonfile');
const jsonQuery = require('json-query');
const _ = require('lodash');

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
 * This method return the object id in the array.
 * 
 * @param  {} id
 * @param  {} arr
 */
function getObjectIndexById(id, arr) {
    return _.findIndex(arr, (obj) => {
        return obj.id == id;
    });
}

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
 * This method return an array of objects filtered by json in array/object.
 * You can search in the array directly if path is null.
 * 
 * @param  {} json
 * @param  {} path
 * @param  {} obj
 */
function getArrayObjectFilered(json, path, obj) {
    let jsonPath = path || '';
    let parentObj = path ? goToPositon(path, obj) : obj;

    return _.filter(parentObj, json);
}

/**
 * This method return an object filtered by id from an array.
 * 
 * @param  {} id
 * @param  {} path
 * @param  {} obj
 */
function getObjectById(id, path, obj) {
    let jsonPath = path || '';
    let parentObj = path ? goToPositon(path, obj) : obj;
    let index = getObjectIndexById(id, parentObj);

    return parentObj[index];
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
 * This method delete an object from an array in a JS object.
 * 'obj' can be an JS object or directly an array.
 * Use dot notation to specify the path.
 * 
 * @param  {} id
 * @param  {} path
 * @param  {} obj
 */
function deleteObjectFromArray(id, path, obj) {
    let clonedObj = _.cloneDeep(obj);
    let parentObj = path ? goToPositon(path, clonedObj) : clonedObj;

    if (Array.isArray(parentObj)) {
        let index = getObjectIndexById(id, parentObj);
        parentObj.splice(index, 1);
    }

    return clonedObj;
}

/**
 * This method return the object updated with the new value.
 * Use dot notation to specify the path.
 * 
 * @param  {} path
 * @param  {} obj
 * @param  {} id
 * @param  {} value
 */
function updateObjectInArray(path, obj, id, value) {
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

    let parentObj = goToPositon(parentPath, obj);

    if (Array.isArray(parentObj)) {
        let index = getObjectIndexById(id, parentObj);
        if (index != -1) {
            parentObj[index][key] = value;
        }
    }

    return obj;
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
 * This method add an object to an array in a JSON file.
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
 * This method update specific value for a key in a JSON file.
 * Use dot notation to specify the path(keyPath).
 * 
 * @param  {} id
 * @param  {} value
 * @param  {} keyPath
 * @param  {} file
 * @param  {} filePath
 */
function updateObjectInFile(id, value, keyPath, file, filePath) {
    return getJsonFile(filePath, file)
        .then(json => {
            let newJson = updateObjectInArray(keyPath, json, id, value);
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
 * This method delete specific object in a JSON file.
 * Use dot notation to specify the path(keyPath).
 * 
 * @param  {} id
 * @param  {} keyPath
 * @param  {} file
 * @param  {} filePath
 */
function deleteObjectFromFile(id, keyPath, file, filePath) {
    return getJsonFile(filePath, file)
        .then(json => {
            let newJson = deleteObjectFromArray(id, keyPath, json);
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
 * This method get specific object by path and id from a JSON file.
 * Use dot notation to specify the path(keyPath).
 * 
 * @param  {} id
 * @param  {} keyPath
 * @param  {} file
 * @param  {} filePath
 */
function getObjectByIdFromFile(id, keyPath, file, filePath) {
    return getJsonFile(filePath, file)
        .then(json => {
            let newJson = getObjectById(id, keyPath, json);
            return newJson;
        });
}

module.exports.getJsonFile = getJsonFile;
module.exports.getJsonFileSync = getJsonFileSync;
module.exports.getArrayObjectFilered = getArrayObjectFilered;
module.exports.getObjectById = getObjectById;
module.exports.getObjectByIdFromFile = getObjectByIdFromFile;

module.exports.addObjectToArray = addObjectToArray;
module.exports.addObjectToFile = addObjectToFile;

module.exports.updateObjectInArray = updateObjectInArray;
module.exports.updateObjectInFile = updateObjectInFile;

module.exports.deleteObjectFromArray = deleteObjectFromArray;
module.exports.deleteObjectFromFile = deleteObjectFromFile;

module.exports.getObjectIndexById = getObjectIndexById;
module.exports.goToPositon = goToPositon;
module.exports.saveArrayObject = saveArrayObject;


/*
const obj = {
    id: '123gryr78mghi456sfgajq234',
    regex: '/<3/',
    intent: 'love'
};

saveArrayObject(null, 'ex-1obj', obj)
    .then(result => {
        console.log(result);
    })
    */