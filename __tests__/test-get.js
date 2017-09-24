const jsonTool = require('../index');

const exampleObj = {
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
        },
        {
            id: '123gryr78mghi456sfgajq234',
            regex: '/<3/',
            intent: 'love'
        }
    ]
}

describe('Get object index by id.', () => {

    it('Should return the index in the array: Expected index 1.', () => {
        let objId = '23fgerty568hj56837dfbdhw1';
        let index = jsonTool.getObjectIndexById(objId, exampleObj.intents);
        expect(index).toEqual(1);
    });
});

describe('Get JSON file (Sync).', () => {

    it('Should return the JSON file content using Sync method.', () => {
        let obj = jsonTool.getJsonFileSync('__tests__/', 'ex-3objs');
        expect(obj).toEqual(exampleObj);
    });
});

describe('Get JSON file (Async).', () => {

    it('Should return the JSON file content using Async method.', () => {
        jsonTool.getJsonFile('__tests__/', 'ex-3objs')
            .then(result => {
                expect(result).toEqual(exampleObj);
            });
    });
});

describe('Get array filtered.', () => {

    it('Should return the array filetered by the specified JSON object.', () => {
        let filter = { intent: 'greeting' };
        let arr = [
            {
                id: 'cj7w9hzfb000276jxhuc21qrv',
                regex: '/Hi/',
                intent: 'greeting'
            },
            {
                id: '23fgerty568hj56837dfbdhw1',
                regex: '/Hello/',
                intent: 'greeting'
            }];

        let arrFiltered = jsonTool.getArrayObjectFilered(filter, 'intents', exampleObj);
        expect(arrFiltered).toEqual(arr);
    });
});

describe('Get object by ID.', () => {
    
    it('Should return an object by the id.', () => {
        let arrFiltered = jsonTool.getObjectById(exampleObj.intents[2].id, 'intents', exampleObj);
        expect(arrFiltered).toEqual(exampleObj.intents[2]);
    });
});

describe('Get object by ID from a JSON file.', () => {

    it('Should return an object by the id from a file.', () => {
        jsonTool.getObjectByIdFromFile(exampleObj.intents[2].id, 'intents', 'ex-3objs', '__tests__/')
            .then(result => {
                expect(result).toEqual(exampleObj.intents[2]);
            });
    });
});