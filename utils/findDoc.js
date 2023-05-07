const mongoose = require('mongoose');

/**
 *
 * @param {string} fieldName
 * @param {mongoose.ObjectId} docId
 * @param {mongoose.Model} model
 * @param {boolean} lean
 * @returns {Promise<mongoose.Document | mongoose.LeanDocument>}
 */
const findDoc = (fieldName, docId, model, lean = false) => {
    return async () => {
        let field;
        if (lean) {
            field = await model.findById(docId).lean().exec();
        } else {
            field = await model.findById(docId).exec();
        }
        if (!field) {
            throw new Error(`Cannot find ${fieldName} with ${JSON.stringify(docId)} `);
        }

        return field;
    };
};

module.exports = findDoc;
