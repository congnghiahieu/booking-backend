const fs = require('fs');
const { google } = require('googleapis');
const path = require('path');

const GOOGLE_API_FOLDER_ID = '1qDm12onUv-j4juR-EJ9c9HvT9IaUHwjd';

const auth = new google.auth.GoogleAuth({
    keyFile: './googleapis.json',
    scopes: ['https://www.googleapis.com/auth/drive'],
});
const driveService = new google.drive({
    version: 'v3',
    auth
})
const checkFolderExists = async (hotel) => {
    const folderName = hotel.id;
    console.log('Cchecking');
    console.log('\n');
    console.log(folderName);
    console.log('\n');

    const res = await driveService.files.list({
        includeRemoved: false,
        q: `'${GOOGLE_API_FOLDER_ID}' in parents`,
        fields: "nextPageToken, files(id, name)",
    })
    // console.log(JSON.stringify(res))
    fs.writeFile('./myjson.json', JSON.stringify(res), 'utf-8', () => {
        console.log('\n');
        console.log('Write file successfully')
    })
    console.log('\n');
    console.log('\n');
    console.log('\n');

    const folders = res.data.files;
    // console.log(`folders trong checkFolder la ${JSON.stringify(folders)}`)
    const folder = folders.find(item => item.name === folderName);
    // console.log(`folder ${JSON.stringify(folder)}`)
    if (folder) return folder.id;
    else {
        const responseFolder = await driveService.files.create({
            auth,
            resource: {
                name: `${hotel.id}`,
                parents: [GOOGLE_API_FOLDER_ID],
                mimeType: 'application/vnd.google-apps.folder',
            },

            field: 'id',
        })

        return responseFolder.data.id;
    }
};

module.exports = { checkFolderExists };