const HotelModel = require('../../model/Hotel');
const checkValidMongoId = require('../../utils/checkValidMongoId');

/*
    DELETE /v1/hotels
*/

const deleteHotelById = async (req, res) => {
    const { id } = req.body;

    // Check for fullfil information
    if (!id) {
        return res.status(400).json({
            message: 'Bad request! Required hotel ID',
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

        const result = await hotel.deleteOne();

        console.log(result);

        return res.status(200).json({
            message: `Hotel name ${result.name} with ID ${result._id} deleted`,
        });
    } catch (err) {
        console.log(err);
        return res.status(422).json({
            message: `Delete hotel with ID ${id} failed`,
            isError: true,
        });
    }
};

module.exports = {
    deleteHotelById,
};
