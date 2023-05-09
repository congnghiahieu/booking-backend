const HotelModel = require('../../../model/Hotel');
const path = require('path');
const fsPromises = require('fs').promises;
const checkValidMongoId = require('../../../utils/checkValidMongoId');
const {
    checkFolderExists,
    deleteSingleImage,
    deleteAllImages,
} = require('../../../services/drive');
const { FOLDER_ID } = require('../../../config/driveApi');

/*
    DELETE /v1/hotels/images
*/

const deleteImagesByHotelId = async (req, res) => {
    const { hotelId, imageId, all } = req.body;

    if (!hotelId) {
        return res.status(400).json({
            message: 'Bad request. Required hotel ID',
        });
    }

    // Check valid mongo ID
    const { isValid, errMsg, errCode } = checkValidMongoId(hotelId);
    if (!isValid) return res.status(errCode).json(errMsg);

    try {
        // Check for exist hotel
        const hotel = await HotelModel.findById(hotelId).exec();
        if (!hotel) {
            return res.status(400).json({ message: 'Bad request. Hotel not found' });
        }

        let rmPath = path.join(
            __dirname,
            '../',
            '../',
            '../',
            'public',
            'imgs',
            'hotels',
            `${hotel.id}`,
        );
        const folderId = await checkFolderExists(FOLDER_ID.PUBLIC_IMGS_HOTELS, hotel.id);

        // Delete all image of hotel
        if (all === 'true' || all === true) {
            // Tạm thời không xoá ở local, chỉ xoá ở GG Drive
            // await fsPromises.rm(rmPath, { recursive: true, force: true });
            await deleteAllImages(folderId);
            hotel.imgsGG = [];
            hotel.imgsRel = [];
            await hotel.save();
            return res.status(200).json({
                message: `Delete all images of hotel ${hotel.name} with ID ${hotel.id} successfully`,
            });
        }

        // Delete single image
        // Tạm thời không xoá ở local, chỉ xoá ở GG Drive
        // rmPath = path.join(rmPath, imageName);
        // await fsPromises.rm(rmPath, { force: true });
        await deleteSingleImage(imageId);
        const index = hotel.imgsGG.indexOf(imageId);
        hotel.imgsGG.splice(index, 1);
        hotel.imgsRel.splice(index, 1);
        const result = await hotel.save();
        console.log(result);

        return res.status(200).json({
            message: `Delete image ${imageId} of hotel ${hotel.name} with ID ${hotel.id} successfully`,
        });
    } catch (err) {
        console.log(err);
        return res.status(422).json({
            message: `Delete image for hotel with ID ${hotelId} failed`,
            isError: true,
        });
    }
};

module.exports = {
    deleteImagesByHotelId,
};
