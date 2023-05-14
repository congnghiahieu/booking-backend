const ServiceModel = require('../../../model/Service');
const path = require('path');
const fsPromises = require('fs').promises;
const { checkValidMongoId } = require('../../../utils/checkValidMongoId');
const {
    checkFolderExists,
    deleteSingleImage,
    deleteAllImages,
} = require('../../../services/drive');
const { FOLDER_ID } = require('../../../config/driveApi');
/*
    DELETE /v1/services/images
*/

const deleteImagesByServiceId = async (req, res) => {
    const { serviceId, imageId, all } = req.body;

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

        const folderId = await checkFolderExists(FOLDER_ID.PUBLIC_IMGS_SERVICES, service.id);

        // Delete all image of hotel
        if (all == 'true' || all === true) {
            // Tạm thời không xoá ở local, chỉ xoá ở GG Drive
            // await fsPromises.rm(rmPath, { recursive: true, force: true });
            await deleteAllImages(folderId);
            service.imgsGG = [];
            service.imgsRel = [];
            const result = await service.save();
            console.log(result);
            return res.status(200).json({
                message: `Delete all images of service ${service.name} with ID ${service.id} successfully`,
            });
        }

        // Delete single image
        // Tạm thời không xoá ở local, chỉ xoá ở GG Drive
        // rmPath = path.join(rmPath, imageName);
        // await fsPromises.rm(rmPath, { force: true });
        await deleteSingleImage(imageId);
        const index = service.imgsGG.indexOf(imageId);
        service.imgsGG.splice(index, 1);
        service.imgsRel.splice(index, 1);
        const result = await service.save();
        console.log(result);

        return res.status(200).json({
            message: `Delete image ${imageId} of service ${service.name} with ID ${service.id} successfully`,
        });
    } catch (err) {
        console.log(err);
        return res.status(422).json({
            message: `Delete image for service with ID ${serviceId} failed`,
            isError: true,
        });
    }
};

module.exports = {
    deleteImagesByServiceId,
};
