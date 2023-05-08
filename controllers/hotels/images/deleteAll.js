const fs = require('fs');
const {google} = require('googleapis');
const path = require('path');
const {checkFolderExists} = require('./checkFolder');

 const deleteAllImage =  async (folderId) =>{
    try {
        //console.log(folderId );
        const auth = new google.auth.GoogleAuth({
            keyFile: './googleapis.json',
            scopes: ['https://www.googleapis.com/auth/drive'],
        });
        const driveService = new google.drive({
            version: 'v3',
            auth 
        })
     
        let res = await driveService.files.list({
            q: `'${folderId}' in parents and trashed = false`,
            fields: 'files(id, name)'
          });

        const files = res.data.files;
          

        await Promise.all(files.map(file => {
            return  driveService.file.delete({fileId:file.id})
        }));
        console.log("successfully deleted all")
    //    for (let file of files) {
    //     await driveService.files.delete({fileId: file.id});
    //    }

    

        
        
    } catch (error) {
        console.log('Uploading files failed ' + error )
    }
}

module.exports = {deleteAllImage};

