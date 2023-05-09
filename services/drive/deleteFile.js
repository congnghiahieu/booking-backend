const { driveService } = require('../../config/driveApi');

const deleteSingleImage = async fileId => {
    try {
        await driveService.files.delete({ fileId });
    } catch (error) {
        console.log(`Delete file with ID ${fileId} failed ` + error);
    }
};

const deleteAllImages = async folderId => {
    try {
        let res = await driveService.files.list({
            q: `'${folderId}' in parents and trashed = false`,
            fields: 'files(id, name)',
        });

        const files = res.data.files;

        await Promise.all(
            files.map(file => {
                return driveService.files.delete({ fileId: file.id });
            }),
        );
        console.log('All deleted successfully');
    } catch (error) {
        console.log('Delete all files failed ' + error);
    }
};

module.exports = { deleteSingleImage, deleteAllImages };
