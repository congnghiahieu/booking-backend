const ServiceModel = require('../../../model/Service');
const checkValidMongoId = require('../../../utils/checkValidMongoId');

/*
    GET /v1/services/images?service_id=
*/

const getImagesByServiceId = async (req, res) => {
    const { service_id: serviceId } = req.query;

    // Check for data fulfill
    if (!serviceId) {
        return res.status(400).json({
            message: 'Bad request. Required service ID',
        });
    }

    // Check valid mongo ID
    const { isValid, errMsg, errCode } = checkValidMongoId(serviceId);
    if (!isValid) return res.status(errCode).json(errMsg);

    try {
        // Check for exist hotel
        const service = await ServiceModel.findById(serviceId).exec();

        if (!service) {
            return res.status(400).json({ message: 'Bad request. Service not found' });
        }

        return res.status(200).json(service.imgsGG);
    } catch (err) {
        console.log(err);
        return res.status(422).json({
            message: `Get images from service with ID ${serviceId} failed`,
            isError: true,
        });
    }
};

module.exports = {
    getImagesByServiceId,
};
