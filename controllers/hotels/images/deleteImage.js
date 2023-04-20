const HotelModel = require('../../../model/Hotel');
const path = require('path');
const fsPromises = require('fs').promises;
const checkValidMongoId = require('../../../utils/checkValidMongoId');

/*
    DELETE /v1/hotels/images/:id?image_name=...
    DELETE /v1/hotels/images/:id?image_name=all
*/

const deleteImagesByHotelId = async (req, res) => {
    const { id } = req.params;
    const { image_name: imageName } = req.query;

    if (!id || !imageName) {
        return res.status(400).json({
            message: 'Bad request. Required hotel ID',
        });
    }

    // Check valid mongo ID
    const { isValid, errMsg, errCode } = checkValidMongoId(id);
    if (!isValid) return res.status(errCode).json(errMsg);

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

        // Delete all image of hotel
        if (imageName == 'all') {
            await fsPromises.rm(rmPath, { recursive: true, force: true });
            hotel.imgs = [];
            await hotel.save();
            return res.status(200).json({
                message: `Delete all images of hotel ${hotel.name} with ID ${hotel.id} successfully`,
            });
        }

        // Delete single image
        rmPath = path.join(rmPath, imageName);
        await fsPromises.rm(rmPath, { force: true });
        hotel.imgs = hotel.imgs.filter(img => !img.includes(imageName));
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
