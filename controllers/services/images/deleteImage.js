const ServiceModel = require('../../../model/Service');
const path = require('path');
const fsPromises = require('fs').promises;
const checkValidMongoId = require('../../../utils/checkValidMongoId');

/*
    DELETE /v1/services/images/:id?image_name=...
    DELETE /v1/services/images/:id?image_name=all
*/

const deleteImagesByServiceId = async (req, res) => {
    const { id } = req.params;
    const { image_name: imageName } = req.query;

    if (!id || !imageName) {
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

        let rmPath = path.join(
            __dirname,
            '../',
            '../',
            '../',
            'public',
            'imgs',
            'services',
            `${service.id}`,
        );

        // Delete all image of hotel
        if (imageName == 'all') {
            await fsPromises.rm(rmPath, { recursive: true, force: true });
            service.images = [];
            await service.save();
            return res.status(200).json({
                message: `Delete all images of service ${service.name} with ID ${service.id} successfully`,
            });
        }

        // Delete single image
        rmPath = path.join(rmPath, imageName);
        await fsPromises.rm(rmPath, { force: true });
        service.images = service.images.filter(img => !img.includes(imageName));
        await service.save();

        return res.status(200).json({
            message: `Delete image ${imageName} of service ${service.name} with ID ${service.id} successfully`,
        });
    } catch (err) {
        console.log(err);
        return res.status(422).json({
            message: `Delete image for service with ID ${id} failed`,
            isError: true,
        });
    }
};

module.exports = {
    deleteImagesByServiceId,
};
