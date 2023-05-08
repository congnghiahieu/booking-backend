const HotelModel = require('../../../model/Hotel');
const path = require('path');
const fsPromises = require('fs').promises;
const checkValidMongoId = require('../../../utils/checkValidMongoId');
const { deleteSingleImageGG } = require('./deleteSingleGG')
const { deleteAllImage } = require('./deleteAll');
const { checkFolderExists } = require('./checkFolder');
/*
    DELETE /v1/hotels/images/:id?image_name=...
    DELETE /v1/hotels/images/:id?image_name=all
*/

const deleteImagesByHotelId = async (req, res) => {
    const { id, imageId, deleteAll } = req.body;
    console.log(JSON.stringify(req.body));
    const { image_name: imageName } = req.query;

    if (!id || !imageName) {
        return res.status(400).json({
            message: 'Bad request. Required hotel ID',
        });
    }

    // Check valid mongo ID
    // const { isValid, errMsg, errCode } = checkValidMongoId(id);
    // if (!isValid) return res.status(errCode).json(errMsg);

    try {
        // Check for exist hotel
        const hotel = await HotelModel.findById(id).exec();

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
        const folderId = await checkFolderExists(hotel);

        // Delete all image of hotel
        if (deleteAll === 'true') {
            await fsPromises.rm(rmPath, { recursive: true, force: true });
            await deleteAllImage(folderId);
            hotel.imgs = [];
            await hotel.save();
            return res.status(200).json({
                message: `Delete all images of hotel ${hotel.name} with ID ${hotel.id} successfully`,
            });
        }
    
        // Delete single image
        rmPath = path.join(rmPath, imageName);
        await fsPromises.rm(rmPath, { force: true });
        await deleteSingleImageGG(imageId);
        hotel.imgs = hotel.imgs.filter(img => img !== (imageId));
        await hotel.save();

        return res.status(200).json({
            message: `Delete image ${imageName} of hotel ${hotel.name} with ID ${hotel.id} successfully`,
        });
    } catch (err) {
        console.log(err);
        return res.status(422).json({
            message: `Delete image for hotel with ID ${id} failed`,
            isError: true,
        });
    }
};

module.exports = {
    deleteImagesByHotelId,
};
