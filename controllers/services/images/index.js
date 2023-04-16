const { getImagesByServiceId } = require('./getImage');
const { addImagesByServiceId } = require('./addImage');
const { deleteImagesByServiceId } = require('./deleteImage');

module.exports = {
    getImagesByServiceId,
    addImagesByServiceId,
    deleteImagesByServiceId,
};
