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

/*

*** PENDING TO SOLVE ISSUE WHEN TRY TO DELETE TE JSON COPY.***

describe('Update object in a JSON file.', () => {

    it('Should update an object in a JSON file.', (done) => {
        shell.cp('__tests__/ex-1obj.json', '__tests__/ex-1obj_copy.json');

        jsonTool.updateObjectInFile('cj7w9hzfb000276jxhuc21qrv', '/Hello/', 'intents.regex', 'ex-1obj_copy', '__tests__/')
            .then(() => {
                jsonTool.getJsonFile('__tests__/', 'ex-1obj2').then((file) => {
                    jsonTool.getJsonFile('__tests__/', 'ex-1obj_copy').then(fileUpdated => {
                        expect(fileUpdated).toEqual(file);
                    })
                });

            }).then(() => {
                shell.rm('__tests__/ex-1obj_copy.json');
                done();
            });
    });
});

*/