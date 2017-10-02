# ⚠️ Under heavy development ⚠️

# BotsFactory JSON-Tool

JSON-Tool is a simple JavaScript tool for JS Objects and JSON processing.  
You can read, update, replace, delte and write JSON data.

## Getting Started

These instructions will get you a copy of the JSON-Tool to use in your code.

## Reference

The commands available are:

* goToPositon(path, obj)

This method go to the path and return the contained object.  


* getJsonFile(path, file)

This method read a json file and return it as JS Object.
Use '/' in the path to specify the rute.


* getJsonFileSync(path, file)

This method read a json file and return it as JS Object (synchronously).


* getArrayObjectFilered(json, path, obj) 

This method return an array of objects filtered by json in array/object.
You can search in the array directly if path is null.


* addObjectToArray(path, obj, newObj)

This method add a new object to an array in a JS object.
You can add new the object to the array directly if path is null.


* updateValueInArray(filter, path, value, obj) 

This method return the object updated with the new value.


* updateObjectInArray(filter, path, newObj, jsonObj)

This method replace the object filtered for the new object.


* replaceObject(path, newObj, obj)

This method replace an object for newObj in the specified path.


* deleteObjectFromArray(filter, path, obj) 

This method delete an object from an array in a JS object.
'obj' can be an JS object or directly an array.


* saveArrayObject(path, file, arrayObject) 

This method update the specified file with the information in the array object.
The file is created if not exist.


* addObjectToFile(obj, keyPath, file, filePath) 

This method add an object to an array in a JSON file.


* updateObjectInFile(filter, newObj, keyPath, file, filePath) 

This method update specific object for an id in a JSON file.


* updateValueInFile(filter, value, keyPath, file, filePath) 

This method update specific value for a key in a JSON file.


* deleteObjectFromFile(filter, keyPath, file, filePath)

This method delete specific object in a JSON file.


* getObjectFromFile(filter, keyPath, file, filePath)

This method get specific object filtered from a JSON file.


* replaceObjectInFile(newObj, keyPath, file, filePath)

This method replace an object in the specified path in a JSON file.


**Note:**
Use dot notation to specify the path in the JSON.
'filter' parameter must be a valid json object. It's used to filter the desired object.


## Authors

[BotsFactory](https://www.botsfactory.io)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.