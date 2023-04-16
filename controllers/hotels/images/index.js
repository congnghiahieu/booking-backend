const { getImagesByHotelId } = require('./getImage');
const { addImagesByHotelId } = require('./addImage');
const { deleteImagesByHotelId } = require('./deleteImage');

module.exports = {
    getImagesByHotelId,
    addImagesByHotelId,
    deleteImagesByHotelId,
};
