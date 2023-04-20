const ServiceModel = require('../../../model/Service');
const checkValidMongoId = require('../../../utils/checkValidMongoId');

/*
    GET /v1/services/images/:id
*/

const getImagesByServiceId = async (req, res) => {
    const { id } = req.params;

    // Check for data fullfil
    if (!id) {
        return res.status(400).json({
            message: 'Bad request. Required service ID',
        });
    }

    // Check valid mongo ID
    const { isValid, errMsg, errCode } = checkValidMongoId(id);
    if (!isValid) return res.status(errCode).json(errMsg);

    try {
        // Check for exist hotel
        const service = await ServiceModel.findById(id).exec();

        if (!service) {
            return res.status(400).json({ message: 'Bad request. Service not found' });
        }

        return res.status(201).json(service.images);
    } catch (err) {
        console.log(err);
        return res.status(422).json({
            message: `Get images from service with ID ${id} failed`,
            isError: true,
        });
    }
};

module.exports = {
    getImagesByServiceId,
};
