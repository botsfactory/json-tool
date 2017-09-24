const jsonTool = require('../index');
const shell = require('shelljs');
const async = require('async');

let exampleObj = {
    intents: [
        {
            id: 'cj7w9hzfb000276jxhuc21qrv',
            regex: '/Hi/',
            intent: 'greeting'
        },
        {
            id: '123gryr78mghi456sfgajq234',
            regex: '/<3/',
            intent: 'love'
        }
    ]
}

const exampleObjD = {
    intents: [
        {
            id: 'cj7w9hzfb000276jxhuc21qrv',
            regex: '/Hi/',
            intent: 'greeting'
        }
    ]
}

describe('Delete object in array.', () => {

    it('Should delete an object from an array.', () => {
        let updated = jsonTool.deleteObjectFromArray('123gryr78mghi456sfgajq234', 'intents', exampleObj);
        expect(updated).toEqual(exampleObjD);
    });
});

/* 

*** PENDING TO SOLVE ISSUE WHEN TRY TO DELETE TE JSON COPY.***

describe('Delte object in a JSON file.', () => {

    it('Should delete an object in an array in a JSON file.', (done) => {
        shell.cp('__tests__/ex-2objs.json', '__tests__/ex-2objs_copy.json');

        jsonTool.deleteObjectFromFile('123gryr78mghi456sfgajq234',  'intents', 'ex-2objs_copy', '__tests__/')
            .then(() => {
                jsonTool.getJsonFile('__tests__/', 'ex-1obj').then((file) => {
                    jsonTool.getJsonFile('__tests__/', 'ex-2objs_copy').then(fileUpdated => {
                        expect(fileUpdated).toEqual(file);
                    })
                });

            }).then(() => {
                shell.rm('__tests__/ex-2objs_copy.json');
                done();
            });
    });
});

*/