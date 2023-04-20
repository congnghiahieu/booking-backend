const HotelModel = require('../../../model/Hotel');
const checkValidMongoId = require('../../../utils/checkValidMongoId');
/*
    GET /v1/hotels/images/:id
*/

const getImagesByHotelId = async (req, res) => {
    const { id } = req.params;

    // Check for data fullfil
    if (!id) {
        return res.status(400).json({
            message: 'Bad request. Required hotel ID',
        });
    }

    // Check valid mongo ID
    const { isValid, errMsg, errCode } = checkValidMongoId(id);
    if (!isValid) return res.status(errCode).json(errMsg);

    try {
        // Check for exist hotel
        const hotel = await HotelModel.findById(id).exec();

        if (!hotel) {
            return res.status(400).json({ message: 'Bad request. Hotel not found' });
        }

        return res.status(201).json(hotel.imgs);
    } catch (err) {
        console.log(err);
        return res.status(422).json({
            message: `Get images from hotel with ID ${id} failed`,
            isError: true,
        });
    }
};

module.exports = {
    getImagesByHotelId,
};
