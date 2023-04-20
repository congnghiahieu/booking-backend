const fsPromsises = require('fs/promises');
const path = require('path');

const exec = async () => {
    const filePath =
        '/public/imgs/services/643d133234bf5fd13da20af3/xuan-nguyen-ricmOR_T2rM-unsplash.jpg';
    console.log(path.basename(filePath));
    console.log(path.dirname(filePath));
    console.log(path.extname(filePath));
    console.log(path.isAbsolute(filePath));
    console.log(path.normalize(filePath));
    console.log(path.parse(filePath));
    console.log(path.format(path.parse(filePath)));
};

exec();
