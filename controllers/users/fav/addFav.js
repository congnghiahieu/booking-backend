const UserModel = require('../../../model/User');
const HotelModel = require('../../../model/Hotel');
const { checkValidMongoId } = require('../../../utils/checkValidMongoId');
const findDoc = require('../../../utils/findDoc');

/*
    POST /v1/users/fav
*/

const addFav = async (req, res) => {
    const { id, hotelId } = req.body;

    // Check for data fullfil
    if (!id || !hotelId) {
        return res.status(400).json({
            message: 'Bad request. Required users ID and hotel ID',
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

        if (user.fav.includes(hotelId)) {
            return res.status(409).json({
                message: `Hotel with ID ${hotelId} alreay in Fav Item`,
            });
        }

        user.fav.push(hotelId);

        const result = await user.save();
        console.log(result);

        return res.status(201).json({
            message: `User ID ${result._id} add ${hotelId} to Fav sucessfully`,
        });
    } catch (err) {
        console.log(err);
        return res.status(422).json({
            message: `User with ID ${id} add to Fav failed`,
            isError: true,
        });
    }
};

module.exports = {
    addFav,
};
