const jsonTool = require('../index');

const exampleObj = {
    intents: [
        {
            bfId: 'cj7w9hzfb000276jxhuc21qrv',
            regex: '/Hi/',
            intent: 'greeting'
        },
        {
            bfId: '23fgerty568hj56837dfbdhw1',
            regex: '/Hello/',
            intent: 'greeting'
        },
        {
            bfId: '123gryr78mghi456sfgajq234',
            regex: '/<3/',
            intent: 'love'
        }
    ]
}

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
                bfId: 'cj7w9hzfb000276jxhuc21qrv',
                regex: '/Hi/',
                intent: 'greeting'
            },
            {
                bfId: '23fgerty568hj56837dfbdhw1',
                regex: '/Hello/',
                intent: 'greeting'
            }];

        let arrFiltered = jsonTool.getArrayObjectFilered(filter, 'intents', exampleObj);
        expect(arrFiltered).toEqual(arr);
    });
});

describe('Get object by ID from a JSON file.', () => {

    it('Should return an object by the id from a file.', () => {
        let jsonId = { bfId: exampleObj.intents[2].bfId };

        jsonTool.getObjectFromFile(jsonId, 'intents', 'ex-3objs', '__tests__/')
            .then(result => {
                expect(result).toEqual(exampleObj.intents[2]);
            });
    });
});