const fs = require('fs');
const { driveService } = require('../../config/driveApi');
const path = require('path');

const uploadFile = async (filePath, folderId) => {
    try {
        const fileMetaData = {
            name: path.basename(filePath),
            parents: [folderId],
        };
        const media = {
            mimeType: 'image/jpeg/png',
            body: fs.createReadStream(filePath),
        };
        const responseFile = await driveService.files.create({
            resource: fileMetaData,
            media: media,
            field: 'id',
        });
        return responseFile.data.id;
    } catch (error) {
        // console.log('Create folder failed ' + error);
    }
};

module.exports = { uploadFile };
