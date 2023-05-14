const UserModel = require('../../../model/User');
const HotelModel = require('../../../model/Hotel');
const ServiceModel = require('../../../model/Service');
const { checkValidMongoId } = require('../../../utils/checkValidMongoId');
const findDoc = require('../../../utils/findDoc');

/*
  DELETE /v1/users/cart
*/

const deleteCart = async (req, res) => {
    const { id, serviceId } = req.body;

    // Check for fullfil information
    if (!id || !serviceId) {
        return res.status(400).json({
            message: 'Bad request. Required users ID, service ID',
        });
    }

    // Check valid mongo ID
    const { isValid, errMsg, errCode } = checkValidMongoId(id, serviceId);
    if (!isValid) return res.status(errCode).json(errMsg);

    try {
        const [user] = await Promise.all([
            findDoc('user', id, UserModel)(),
            findDoc('service', serviceId, ServiceModel, true)(),
        ]);
        user.cart = user.cart.filter(cartId => cartId != serviceId);

        const result = await user.save();
        console.log(result);

        return res.status(200).json({
            message: `This cart item has been deleted successfully`,
        });
    } catch (err) {
        console.log(err);
        return res.status(422).json({
            message: `Delete Cart item of user with id ${id} failed`,
            isError: true,
        });
    }
};

module.exports = {
    deleteCart,
};
