const fs = require('fs');
const {google} = require('googleapis');
const path = require('path');


 const deleteSingleImageGG =  async (fileId) =>{
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: './googleapis.json',
            scopes: ['https://www.googleapis.com/auth/drive'],
        });
        const driveService = new google.drive({
            version: 'v3',
            auth 
        })

       await driveService.files.delete({fileId}).excecute()

    

        
        
    } catch (error) {
        console.log('Uploading files failed ' + error )
    }
}

module.exports = {deleteSingleImageGG};

