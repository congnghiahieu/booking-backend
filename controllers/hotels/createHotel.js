const HotelModel = require('../../model/Hotel');
const path = require('path');

/*
  POST /v1/hotels
*/

const createHotel = async (req, res) => {
    const { name, title, phone, email, desc, nation, city, province, others, stars = 4 } = req.body;

    // Check for data fullfil
    if (!name || !title || !phone || !email || !desc || !nation || !city) {
        return res.status(400).json({
            message:
                'Bad request. Need full information includes: name, title, phone, email, desc, nation, city',
        });
    }
    // imgs already checked at previous middlewares

    try {
        // Check for duplicate hotel
        const duplicate = await HotelModel.findOne({ name }).lean().exec();

        if (duplicate) {
            return res.status(409).json({ message: 'Conflict. Duplicate hotel name or title' });
        }

        // Create new hotel
        const newHotel = new HotelModel({
            name,
            title,
            contact: {
                phone,
                email,
            },
            desc,
            location: {
                nation,
                city,
                province: province || '',
                others: others || '',
            },
            stars,
        });

        const files = req.files;
        let imgsPath = [];
        // Save img
        Object.keys(files).forEach(key => {
            const absPath = path.join(
                __dirname,
                '../',
                '../',
                'public',
                'imgs',
                `hotels`,
                `${newHotel.id}`,
                files[key].name,
            );
            files[key].mv(absPath, err => {
                if (err) return res.status(500).json({ status: 'error', message: err });
            });
            const relPath = path.join(
                'public',
                'imgs',
                `hotels`,
                `${newHotel.id}`,
                files[key].name,
            );
            imgsPath.push(relPath);
        });

        newHotel.imgs = imgsPath;
        await newHotel.save();

        return res.status(201).json({
            message: 'New hotel created sucessfully',
        });
    } catch (err) {
        console.log(err);
        return res.status(422).json({
            message: 'Create hotel failed',
            isError: true,
        });
    }
};

module.exports = {
    createHotel,
};
