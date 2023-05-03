const findDoc = (fieldName, findField, model) => {
    return async () => {
        const field = await model.find(findField).lean().exec();
        if (!field?.length) {
            throw new Error(`Cannot find ${fieldName} with ${JSON.stringify(findField)} `);
        }

        return field;
    };
};

module.exports = findDoc;
