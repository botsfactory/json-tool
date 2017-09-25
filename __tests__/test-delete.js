const jsonTool = require('../index');
const shell = require('shelljs');

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

describe('Delte object in a JSON file.', () => {

    it('Should delete an object in an array in a JSON file.', async (done) => {
        shell.cp('__tests__/ex-2objs.json', '__tests__/ex-2objs_copy.json');

        let json = await jsonTool.deleteObjectFromFile('123gryr78mghi456sfgajq234',  'intents', 'ex-2objs_copy', '__tests__/');
        let file = await jsonTool.getJsonFile('__tests__/', 'ex-1obj');
        let fileUpdated = await jsonTool.getJsonFile('__tests__/', 'ex-2objs_copy');

        expect(fileUpdated).toEqual(file);

        shell.rm('__tests__/ex-2objs_copy.json');
        done();
    });
});