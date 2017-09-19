const jsonfile = require('jsonfile');
const jsonQuery = require('json-query');

/**
 * This method read a json file and return a JS Object.
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
 * This method return an array of objects filtered by key, subkey and value.
 * 
 * @param  {} arrayObject
 * @param  {} key
 * @param  {} subkey
 * @param  {} value
 */
function getArrayObjectFilered(arrayObject, key, subkey, value) {
    let query = `${key}[**][*${subkey}=${value}]`;
    let filteredJson = JSON.stringify(jsonQuery(query, { data: arrayObject }).value);

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
function updateArrayObject(jsonObject, key, subkey, value, newValue) {
    let newJson = jsonObject[key];

    newJson.map((obj) => {
        if (obj[subkey] == value) {
            obj[subkey] = newValue;
        }

        return obj;
    });

    return jsonObject;
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

    jsonObjects.map((obj) => {
        let parts = path.split('.').slice(1);

        while (parts.length > 1) {
            obj = obj[parts[0]];
            parts = parts.shift();
        }

        if (parts.length > 0 && obj[parts[0]] == value) {
            obj[parts[0]] = newValue;
        }

        return obj;
    });

    return arrayObject;
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
    let jsonPath = path || '';
    let json = `${jsonPath}${file}.json`;

    return new Promise((fulfill, reject) => {
        jsonfile.writeFile(json, jsonObject, { spaces: 4 }, (err) => {
            if (err) reject(err);
            else fulfill(true);
        })
    });
}

/**
 * This method add new json object to the array object.
 * If jsonKey the jsonObjects parameter is used as array to apped the new object.
 * 
 * @param  {} jsonKey
 * @param  {} jsonObjects
 * @param  {} newObject
 */
function addObjectToArray(jsonKey, jsonObjects, newObject) {
    let newArray = jsonKey ? jsonObjects[jsonKey] : jsonObjects;

    if (Array.isArray(newArray)) {
        newArray.push(newObject);
    }

    return newArray;
}

module.exports.getJsonFile = getJsonFile;
module.exports.getArrayObjectFilered = getArrayObjectFilered;
module.exports.updateArrayObject = updateArrayObject;
module.exports.updateArrayObjectNested = updateArrayObjectNested;
module.exports.saveArrayObject = saveArrayObject;
module.exports.addObjectToArray = addObjectToArray;