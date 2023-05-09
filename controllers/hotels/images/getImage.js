const HotelModel = require('../../../model/Hotel');
const checkValidMongoId = require('../../../utils/checkValidMongoId');
/*
    GET /v1/hotels/images?hotel_id=
*/

const getImagesByHotelId = async (req, res) => {
    const { hotel_id: hotelId } = req.query;

    // Check for data fulfill
    if (!hotelId) {
        return res.status(400).json({
            message: 'Bad request. Required hotel ID',
        });
    }

    // Check valid mongo ID
    const { isValid, errMsg, errCode } = checkValidMongoId(hotelId);
    if (!isValid) return res.status(errCode).json(errMsg);

    try {
        // Check for exist hotel
        const hotel = await HotelModel.findById(hotelId).exec();

        if (!hotel) {
            return res.status(400).json({ message: 'Bad request. Hotel not found' });
        }

        return res.status(200).json(hotel.imgsGG);
    } catch (err) {
        console.log(err);
        return res.status(422).json({
            message: `Get images from hotel with ID ${hotelId} failed`,
            isError: true,
        });
    }
};

module.exports = {
    getImagesByHotelId,
};
