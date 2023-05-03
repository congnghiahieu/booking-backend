const mongoose = require('mongoose');

/**
 *
 * @param {string} fieldName
 * @param {Object} findField
 * @param {mongoose.Model} model
 * @param {boolean} isLean
 * @returns {Promise<mongoose.Document | mongoose.LeanDocument>}
 */
const findDoc = (fieldName, findField, model, lean = false) => {
    return async () => {
        let field;
        if (lean) {
            // field = await model.find(findField).lean().exec();
            field = await model.find(findField).lean().exec();
        }
        field = await model.find(findField).exec();
        if (!field?.length) {
            throw new Error(`Cannot find ${fieldName} with ${JSON.stringify(findField)} `);
        }

        return field;
    };
};

module.exports = findDoc;
