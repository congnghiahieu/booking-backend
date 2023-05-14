const HotelModel = require('../../../model/Hotel');
const path = require('path');
const { checkValidMongoId } = require('../../../utils/checkValidMongoId');
const { checkFolderExists, uploadFile } = require('../../../services/drive');
const { FOLDER_ID } = require('../../../config/driveApi');

/*
    POST /v1/hotels/images
*/

const addImagesByHotelId = async (req, res) => {
    // Payload already checked in previous middlewares
    const { hotelId } = req.body;
    console.log(req.body);

    // Check for data fullfil
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
                    `hotels`,
                    `${hotel.id}`,
                    files[key].name,
                );
                return files[key].mv(absPath);
            }),
        );
        // Save to DB relative path: "/public/imgs/hotels"
        Object.keys(files).forEach(key => {
            const relPath = path.join('public', 'imgs', `hotels`, `${hotel.id}`, files[key].name);
            hotel.imgsRel.push(relPath);
        });

        // Find folder id
        const folderId = await checkFolderExists(FOLDER_ID.PUBLIC_IMGS_HOTELS, hotel.id);

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
                    `hotels`,
                    `${hotel.id}`,
                    files[key].name,
                );
                return uploadFile(absPath, folderId);
            }),
        ).then(ids => {
            hotel.imgsGG = [...hotel.imgsGG, ...ids];
        });
        const result = await hotel.save();
        console.log(result);

        return res.status(201).json({
            message: `Add images for hotel ${hotel.name} with ID ${hotel.id} successfully`,
        });
    } catch (err) {
        console.log(err);
        return res.status(422).json({
            message: `Add images for hotel with ID ${hotelId} failed`,
            isError: true,
        });
    }
};

module.exports = {
    addImagesByHotelId,
};
