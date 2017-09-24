const jsonTool = require('../index');
const shell = require('shelljs');
const async = require('async');

let exampleObjB = {
    intents: [
        {
            id: 'cj7w9hzfb000276jxhuc21qrv',
            regex: '/Hi/',
            intent: 'greeting'
        }
    ]
}

const exampleObjA = {
    intents: [
        {
            id: 'cj7w9hzfb000276jxhuc21qrv',
            regex: '/Hello/',
            intent: 'greeting'
        }
    ]
}

describe('Update object in array.', () => {

    it('Should update an object in an array in a JS object.', () => {
        let updated = jsonTool.updateObjectInArray('intents.regex', exampleObjB, 'cj7w9hzfb000276jxhuc21qrv', '/Hello/');
        expect(updated).toEqual(exampleObjA);
    });
});

describe('Update object in a JSON file.', () => {

    it('Should update an object in a JSON file.', (done) => {
        shell.cp('__tests__/ex-1obj.json', '__tests__/ex-1obj_copy.json');

        jsonTool.updateObjectInFile('cj7w9hzfb000276jxhuc21qrv', '/Hello/', 'intents.regex', 'ex-1obj_copy', '__tests__/')
            .then(() => {
                jsonTool.getJsonFile('__tests__/', 'ex-1obj-updated').then((file) => {
                    jsonTool.getJsonFile('__tests__/', 'ex-1obj_copy').then(fileUpdated => {
                        expect(fileUpdated).toEqual(file);
                    })
                });
            }).then(() => {
                /*
                shell.exec('rm ex-1obj_copy.json', { async: true, silent: true }, function (data) {
                    console.log(data);
                });*/
                done();
            });
    });
});