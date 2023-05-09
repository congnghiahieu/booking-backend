const { driveService, auth } = require('../../config/driveApi');

const checkFolderExists = async (parentFolderId, folderName) => {
    const res = await driveService.files.list({
        includeRemoved: false,
        q: `'${parentFolderId}' in parents`,
        fields: 'nextPageToken, files(id, name)',
    });
    const folders = res.data.files;
    const folder = folders.find(item => item.name === folderName);
    if (folder) return folder.id;
    // If not exist, create
    const responseFolder = await driveService.files.create({
        auth,
        resource: {
            name: `${folderName}`,
            parents: [parentFolderId],
            mimeType: 'application/vnd.google-apps.folder',
        },
        field: 'id',
    });

    return responseFolder.data.id;
};

module.exports = { checkFolderExists };
