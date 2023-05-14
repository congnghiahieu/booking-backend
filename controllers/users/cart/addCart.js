const UserModel = require('../../../model/User');
const ServiceModel = require('../../../model/Service');
const { checkValidMongoId } = require('../../../utils/checkValidMongoId');
const findDoc = require('../../../utils/findDoc');

/*
    POST /v1/users/cart
*/

const addCart = async (req, res) => {
    const { id, serviceId } = req.body;
    // Check for data fullfil
    if (!id || !serviceId) {
        return res.status(400).json({
            message: 'Bad request. Required req body: id, serviceId',
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

        if (user.cart.includes(serviceId)) {
            return res.status(409).json({
                message: `Service with ID ${serviceId} alreay in Cart Item`,
            });
        }

        user.cart.push(serviceId);

        const result = await user.save();
        console.log(result);

        return res.status(201).json({
            message: `User ID ${result._id} add to Cart sucessfully`,
        });
    } catch (err) {
        console.log(err);
        return res.status(422).json({
            message: `User with ID ${id} add to Cart failed`,
            isError: true,
        });
    }
};

module.exports = {
    addCart,
};
