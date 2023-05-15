const path = require('path');

const fileExtLimiter = allowedExts => {
    return (req, res, next) => {
        const files = req.files;
        const uploadFilesExts = [];
        Object.keys(files).forEach(key => {
            uploadFilesExts.push(path.extname(files[key].name));
        });
        // console.log(`Allowed files extensions: ${allowedExts.join(", ")}`);
        // console.log(`Upload files extensions: ${uploadFilesExts.join(", ")}`);

        const allowed = uploadFilesExts.every(ext => allowedExts.includes(ext));
        if (!allowed) {
            const message = `Upload failed. Only ${allowedExts.join(', ')} files allowed.`;

            // 422: Unprocessable content
            return res.status(422).json({ status: 'error', message });
        }

        next();
    };
};

module.exports = fileExtLimiter;
