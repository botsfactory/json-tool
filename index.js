const jsonfile = require('jsonfile');
const jsonQuery = require('json-query');

/**
 * This method read a json file and return a JS Object.
 * 
 * @param  {} path
 * @param  {} file
 */
function getArrayObject(path, file) {
    let jsonPath = path || '';
    let json = `${jsonPath}${file}.json`;

    jsonfile.readFile(json, (err, jsonObj) => {
        return jsonObj;
    })

    return new Promise((fulfill, reject) => {
        jsonfile.readFile(json, (err, jsonObj) => {
            if (err) reject(err);
            else fulfill(jsonObj);
        })
    });
}

/**
 * This method return an array of objects filtered by key, subkey and value.
 * 
 * @param  {} arrayObject
 * @param  {} key
 * @param  {} subkey
 * @param  {} value
 */
function getArrayObjectFilered(arrayObject, key, subkey, value) {
    let query = `${key}[**][*${subkey}=${value}]`;

    return new Promise((fulfill, reject) => {
        let json = JSON.stringify(jsonQuery(query, { data: arrayObject }).value);
        fulfill(json);
    });
}

/**
 * This method return the array with the object updated with new value.
 * 
 * @param  {} arrayObject
 * @param  {} key
 * @param  {} subkey
 * @param  {} value
 * @param  {} newValue
 */
function updateArrayObject(arrayObject, key, subkey, value, newValue) {
    let jsonObjects = arrayObject[key];

    return new Promise((fulfill, reject) => {
        let newJson = jsonObjects.map((obj) => {
            var newObj = obj;

            if (newObj[subkey] == value) {
                newObj[subkey] == newValue;
            }

            return newObj;
        });

        let newJsonObj = {};
        newJsonObj[subkey] = newJson;
        fulfill(newJsonObj);
    });
}

/**
 * This method return the array with the object updated with new value.
 * Use dot notation to specify nested values.
 * 
 * @param  {} arrayObject
 * @param  {} path
 * @param  {} value
 * @param  {} newValue
 */
function updateArrayObjectNested(arrayObject, path, value, newValue) {
    let arrContainer = path.split('.').shift();
    let jsonObjects = arrayObject[arrContainer];

    let newJson = jsonObjects.map((obj) => {
        let newObj = obj;
        let parts = path.split('.');
        parts = parts.slice(1);

        while (parts.length > 1) {
            obj = obj[parts[0]];
            parts = parts.shift();
        }

        if (parts.length > 0 && obj[parts[0]] == value) {
            console.log('entra');
            obj[parts[0]] = newValue;
        }

        return newObj;
    });

    let newJsonObj = arrayObject;
    newJsonObj[arrContainer] = newJson;
    return newJsonObj;

}

/**
 * This method update the specified file with the information in the array object.
 * The file is created if not exist.
 * 
 * @param  {} path
 * @param  {} file
 * @param  {} arrayObject
 */
function saveArrayObject(path, file, arrayObject) {

}

/**
 * This method add new json object to the array object.
 * 
 * @param  {} arrayObject
 * @param  {} newObject
 */
function addObjectToArray(arrayObject, newObject) {

}

module.exports.getArrayObject = getArrayObject;
module.exports.getArrayObjectFilered = getArrayObjectFilered;
module.exports.updateArrayObject = updateArrayObject;
module.exports.updateArrayObjectNested = updateArrayObjectNested;
module.exports.saveArrayObject = saveArrayObject;
module.exports.addObjectToArray = addObjectToArray;