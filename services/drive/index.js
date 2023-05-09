const { checkFolderExists } = require('./checkFolderExists');
const { uploadFile } = require('./uploadFile');
const { deleteSingleImage, deleteAllImages } = require('./deleteFile');

module.exports = {
    checkFolderExists,
    uploadFile,
    deleteSingleImage,
    deleteAllImages,
};
