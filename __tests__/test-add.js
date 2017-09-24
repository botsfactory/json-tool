const jsonTool = require('../index');
const shell = require('shelljs');

let exampleObj1 = {
    intents: [
        {
            id: 'cj7w9hzfb000276jxhuc21qrv',
            regex: '/Hi/',
            intent: 'greeting'
        }
    ]
}

const exampleObj2 = {
    intents: [
        {
            id: 'cj7w9hzfb000276jxhuc21qrv',
            regex: '/Hi/',
            intent: 'greeting'
        },
        {
            id: '23fgerty568hj56837dfbdhw1',
            regex: '/Hello/',
            intent: 'greeting'
        }
    ]
}

describe('Add object to array.', () => {

    it('Should add an object to array in a JS object.', () => {
        let newObj = jsonTool.addObjectToArray('intents', exampleObj1, exampleObj2.intents[1]);
        expect(newObj).toEqual(exampleObj2);
    });
});

/*
describe('Add object to a JSON file.', () => {

    it('Should add an object to array in a file.', (done) => {
        shell.cp('__tests__/ex-1obj.json', '__tests__/ex-1obj_copy.json');

        jsonTool.addObjectToFile(exampleObj2.intents[1], 'intents', 'ex-1obj_copy', '__tests__/')
            .then(() => {
                jsonTool.getJsonFile('__tests__/', 'ex-1obj_copy')
                    .then(file => {
                        expect(file).toEqual(exampleObj2);
                    });

            }).then(() => {
                shell.rm('__tests__/ex-1obj_copy.json');
                done();
            });
    });
});*/