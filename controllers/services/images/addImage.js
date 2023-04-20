const ServiceModel = require('../../../model/Service');
const path = require('path');
const checkValidMongoId = require('../../../utils/checkValidMongoId');

/*
    POST /v1/services/images/:id
*/

const addImagesByServiceId = async (req, res) => {
    // Payload already checked in previous middlewares
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

        const files = req.files;

        // Save img
        Object.keys(files).forEach(key => {
            const absPath = path.join(
                __dirname,
                '../',
                '../',
                '../',
                'public',
                'imgs',
                `services`,
                `${service.id}`,
                files[key].name,
            );
            files[key].mv(absPath, err => {
                if (err) return res.status(500).json({ status: 'error', message: err });
            });
            const relPath = path.join(
                'public',
                'imgs',
                `services`,
                `${service.id}`,
                files[key].name,
            );
            service.images.push(relPath);
        });

        await service.save();

        return res.status(201).json({
            message: `Add images for service ${service.name} with ID ${service.id} successfully`,
        });
    } catch (err) {
        console.log(err);
        return res.status(422).json({
            message: `Add images for service with ID ${id} failed`,
            isError: true,
        });
    }
};

module.exports = {
    addImagesByServiceId,
};
