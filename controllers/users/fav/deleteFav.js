const UserModel = require('../../../model/User');
const HotelModel = require('../../../model/Hotel');
const { checkValidMongoId } = require('../../../utils/checkValidMongoId');
const findDoc = require('../../../utils/findDoc');

/*
  DELETE /v1/users/fav
*/

const deleteFav = async (req, res) => {
    const { id, hotelId } = req.body;

    // Check for fullfil information
    if (!id || !hotelId) {
        return res.status(400).json({
            message: 'Bad request. Required users ID, hotel ID',
        });
    }

    // Check valid mongo ID
    const { isValid, errMsg, errCode } = checkValidMongoId(id, hotelId);
    if (!isValid) return res.status(errCode).json(errMsg);

    try {
        const [user] = await Promise.all([
            findDoc('user', id, UserModel)(),
            findDoc('hotel', hotelId, HotelModel, true)(),
        ]);
        user.fav = user.fav.filter(favId => favId != hotelId);

        const result = await user.save();
        console.log(result);

        return res.status(200).json({
            message: `This fav item has been deleted successfully`,
        });
    } catch (err) {
        console.log(err);
        return res.status(422).json({
            message: `Delete Fav item of user with ID ${id} failed`,
            isError: true,
        });
    }
};

module.exports = {
    deleteFav,
};
