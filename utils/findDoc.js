const mongoose = require('mongoose')
const findDoc = (fieldName, findField, model,isLean) => {
    return async () => {
        let field;
        if(!isLean)
        {
             field = await model.find(findField).exec()
             //console.log(field instanceof mongoose.Document)

        }
        field = await model.find(findField).lean().exec()
        if (!field?.length) {
            throw new Error(`Cannot find ${fieldName} with ${JSON.stringify(findField)} `);
        }

        return field;
    };
};

module.exports = findDoc;
