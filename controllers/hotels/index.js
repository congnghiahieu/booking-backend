const { getHotels } = require('./getHotel');
const { createHotel } = require('./createHotel');
const { updateHotelInfoById } = require('./updateHotel');
const { deleteHotelById } = require('./deleteHotel');

module.exports = {
    getHotels,
    createHotel,
    updateHotelInfoById,
    deleteHotelById,
};
