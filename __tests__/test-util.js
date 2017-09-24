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

/* 

*** PENDING TO SOLVE ISSUE WHEN TRY TO DELETE TE JSON COPY.***

describe('Save array object to array.', () => {

    it('Should save an object in an array in a JS object.', (done) => {
        shell.cp('__tests__/ex-1obj.json', '__tests__/ex-1obj_copy.json');

        jsonTool.saveArrayObject('intents', 'ex-1obj_copy', obj)
            .then(() => {
                jsonTool.getJsonFile('__tests__/', 'ex-2objs').then((file) => {
                    jsonTool.getJsonFile('__tests__/', 'ex-1obj_copy').then(fileUpdated => {
                        expect(fileUpdated).toEqual(file);
                    });
                });

            }).then(() => {
                shell.rm('__tests__/ex-1obj_copy.json');
                done();
            });
    });
});

*/