const fs = require('fs');
const {google} = require('googleapis');
const path = require('path');

const GOOGLE_API_FOLDER_ID = '1eryH-h-th3CQim1luJuH8XA5JNQ-dzLH';

 const uploadFilesToGG =  async (filePath,hotelId) =>{
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: './googleapis.json',
            scopes: ['https://www.googleapis.com/auth/drive'],
        });
        const driveService = new google.drive({
            version: 'v3',
            auth 
        })

        const fileMetaData = {
            name : path.basename(filePath),
            parents: [GOOGLE_API_FOLDER_ID], 
        }
        const media = {
            mimeType: 'image/jpeg/png',
            body: fs.createReadStream(filePath),
        }
        const response = await driveService.files.create({
                resource: fileMetaData,
                media: media,
                field: 'id',

        })
        console.log(response.data.id);
        return response.data.id;
        
        
    } catch (error) {
        console.log('Uploading files failed ' + error )
    }
}
module.exports = {uploadFilesToGG};
//  uploadFilesToGG();
