const HotelModel = require('../../model/Hotel');
const checkValidMongoId = require('../../utils/checkValidMongoId');

/*
  GET /v1/hotels?:hotel_id
*/

const getHotels = async (req, res) => {
    const { hotel_id: hotelId } = req.query;

    let findField = {};

    // Check for hotel id (query single hotel)
    if (hotelId) {
        const { isValid, errMsg, errCode } = checkValidMongoId(hotelId);
        if (!isValid) return res.status(errCode).json(errMsg);

        findField = { _id: hotelId };
    }

    try {
        const hotelList = await HotelModel.find(findField).lean().exec();

        if (hotelId && !hotelList?.length) {
            // If find single hotel and not found mean wrong id
            return res.status(400).json({
                message: `No hotel with ID ${hotelId} found`,
            });
        }

        // If find single hotel return single obj
        let result = hotelList;
        if (hotelId && hotelList.length == 1) {
            result = hotelList[0];
        }

        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        return res.status(422).json({
            message: `Get ${hotelId ? `hotel with ID ${hotelId}` : 'all hotels'} failed`,
            isError: true,
        });
    }
};

module.exports = {
    getHotels,
};
