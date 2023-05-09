const { google } = require('googleapis');
const path = require('path');

const FOLDER_ID = {
    PUBLIC_IMGS_HOTELS: '1aWbBRLh8QWH814ILUgiWEO6F2ztHFI3J',
    PUBLIC_IMGS_SERVICES: '1SwwwBeHsc-n_fN8jgzDdspZb0ht1A-dj',
};

const auth = new google.auth.GoogleAuth({
    keyFile: `${path.join(__dirname, 'googleapis.json')}`,
    scopes: ['https://www.googleapis.com/auth/drive'],
});
const driveService = new google.drive({
    version: 'v3',
    auth,
});

module.exports = { driveService, auth, FOLDER_ID };
