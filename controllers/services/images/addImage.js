const ServiceModel = require('../../../model/Service');
const path = require('path');
const checkValidMongoId = require('../../../utils/checkValidMongoId');
const { checkFolderExists, uploadFile } = require('../../../services/drive');
const { FOLDER_ID } = require('../../../config/driveApi');

/*
    POST /v1/services/images
*/

const addImagesByServiceId = async (req, res) => {
    // Payload already checked in previous middlewares
    const { serviceId } = req.body;

    // Check for data fullfil
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

        const files = req.files;
        // Save imgs to local
        await Promise.all(
            Object.keys(files).map(key => {
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
                return files[key].mv(absPath);
            }),
        );
        // Save to DB relative path: "/public/imgs/services"
        Object.keys(files).forEach(key => {
            const relPath = path.join(
                'public',
                'imgs',
                `services`,
                `${service.id}`,
                files[key].name,
            );
            service.imgsRel.push(relPath);
        });

        // Find folder id
        const folderId = await checkFolderExists(FOLDER_ID.PUBLIC_IMGS_SERVICES, service.id);

        // Upload to google
        await Promise.all(
            Object.keys(files).map(key => {
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
                return uploadFile(absPath, folderId);
            }),
        ).then(ids => {
            service.imgsGG = [...service.imgsGG, ...ids];
        });
        const result = await service.save();
        console.log(result);

        return res.status(201).json({
            message: `Add images for service ${service.name} with ID ${service.id} successfully`,
        });
    } catch (err) {
        console.log(err);
        return res.status(422).json({
            message: `Add images for service with ID ${serviceId} failed`,
            isError: true,
        });
    }
};

module.exports = {
    addImagesByServiceId,
};
