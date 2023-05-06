const HotelModel = require('../../../model/Hotel');
const path = require('path');
const checkValidMongoId = require('../../../utils/checkValidMongoId');
const { uploadFilesToGG } = require('./addImageGG')
const { createFiles } = require('./createFiles')
const {checkFolderExists} = require('./checkFolder');
/*
    POST /v1/hotels/images/:id
*/

const addImagesByHotelId = async (req, res) => {
    // Payload already checked in previous middlewares
    const { id } = req.params;

    // Check for data fullfil
    if (!id) {
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
                `hotels`,
                `${hotel.id}`,
                files[key].name,
            );

            files[key].mv(absPath, err => {
                if (err) return res.status(500).json({ status: 'error', message: err });
            });
            const relPath = path.join('public', 'imgs', `hotels`, `${hotel.id}`, files[key].name);

            //hotel.imgs.push(relPath);
        });

        const folderId = await checkFolderExists(hotel);
       
       
        await Promise.all(Object.keys(files).map(key => {
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

            return createFiles(absPath, folderId);
        })).then(ids => {
            hotel.imgs = [...hotel.imgs, ...ids]
        })
        const saved = await hotel.save();



        return res.status(201).json({
            message: `Add images for hotel ${hotel.name} with ID ${hotel.id} successfully`,
        });
    } catch (err) {
        console.log(err);
        return res.status(422).json({
            message: `Add images for hotel with ID ${id} failed`,
            isError: true,
        });
    }
};

module.exports = {
    addImagesByHotelId,
};
