const fs = require('fs');
const { google } = require('googleapis');
const path = require('path');



const auth = new google.auth.GoogleAuth({
    keyFile: './googleapis.json',
    scopes: ['https://www.googleapis.com/auth/drive'],
});
const driveService = new google.drive({
    version: 'v3',
    auth
})
const createFiles = async (filePath, folderId) => {
    try {
            
                
                const fileMetaData = {
                    name: path.basename(filePath),
                    parents: [folderId],
                }
                const media = {
                    mimeType: 'image/jpeg/png',
                    body: fs.createReadStream(filePath),
                }
                const responseFile = await driveService.files.create({
                    resource: fileMetaData,
                    media: media,
                    field: 'id',

                })
                console.log(responseFile.data.id);
                return responseFile.data.id;
    }
    catch (error) {
        console.log('Create folder failed ' + error)
    }
}


module.exports = { createFiles};

