const jsonTool = require('../index');
const shell = require('shelljs');
const async = require('async');

let nestedObj = {
    level1: {
        level2: {
            level3: {
                id: '123gryr78mghi456sfgajq234',
                regex: '/<3/',
                intent: 'love'
            }
        }
    }
}

const obj = {
    id: '123gryr78mghi456sfgajq234',
    regex: '/<3/',
    intent: 'love'
};

describe('Go to position in JS object.', () => {

    it('Should return a sub object in nested JS object.', () => {
        let newObj = jsonTool.goToPositon('level1.level2.level3', nestedObj);
        expect(newObj).toEqual(obj);
    });
});

describe('Save array object to array.', () => {

    it('Should save an object in an array in a JS object.', async (done) => {
        shell.exec('touch newFile.json');

        let json = await jsonTool.saveArrayObject('__tests__/', 'newFile', obj);
        let file = await jsonTool.getJsonFile('__tests__/', 'newFile');

        expect(file).toEqual(obj);

        shell.rm('__tests__/newFile.json');
        done();
    });
});