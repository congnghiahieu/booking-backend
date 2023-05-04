const fs = require('fs');
const {google} = require('googleapis');
const path = require('path');

const GOOGLE_API_FOLDER_ID = '1eryH-h-th3CQim1luJuH8XA5JNQ-dzLH';

 const deleteFolders =  async (hotelId) =>{
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: './googleapis.json',
            scopes: ['https://www.googleapis.com/auth/drive'],
        });
        const driveService = new google.drive({
            version: 'v3',
            auth 
        })

        driveService.files.delete({
            fileId: hotelId,
          }, (err, res) => {
            if (err) return console.log(`Lỗi: ${err}`);
            console.log(`Thư mục đã được xóa`);
          }).excecute()
        
        
    } catch (error) {
        console.log('Uploading files failed ' + error )
    }
}
deleteFolders('643d0dfaa4f50920d4b0b45b');
module.exports = {deleteFolders};
//  uploadFilesToGG();
