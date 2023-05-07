const UserModel = require('../../../model/User');
const checkValidMongoId = require('../../../utils/checkValidMongoId');

/*
    GET /v1/users/cart?user_id=
*/

const getCart = async (req, res) => {
    const { user_id: userId } = req.query;

    // Check for data fullfil
    if (!userId) {
        return res.status(400).json({
            message: 'Bad request. Required query param user_id',
        });
    }

    // Check valid mongo ID
    const { isValid, errMsg, errCode } = checkValidMongoId(userId);
    if (!isValid) return res.status(errCode).json(errMsg);

    try {
        const user = await UserModel.findById(userId)
            .populate({
                path: 'cart',
                populate: { path: 'hotelId' },
            })
            .select('cart')
            .lean()
            .exec();
        if (!user) {
            return res.status(404).json({ message: `User with ID ${userId} not found` });
        }

        return res.status(200).json(user);
    } catch (err) {
        console.log(err);
        return res.status(422).json({
            message: `Get Cart item of user with ID ${userId} failed`,
            isError: true,
        });
    }
};

module.exports = {
    getCart,
};
