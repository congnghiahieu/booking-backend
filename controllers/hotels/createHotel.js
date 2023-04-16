const HotelModel = require('../../model/Hotel');

/*
  POST /v1/hotels
*/

const createHotel = async (req, res) => {
    const {
        name,
        title,
        phone,
        email,
        desc,
        thumbnails,
        nation,
        city,
        province,
        others,
        stars = 4,
    } = req.body;

    // Check for data fullfil
    if (!name || !title || !phone || !email || !desc || !nation || !city) {
        return res.status(400).json({
            message:
                'Bad request. Need full information includes: name, title, phone, email, desc, nation, city',
        });
    }

    // Check for hotel thumbnails
    if (!Array.isArray(thumbnails) || !thumbnails?.length) {
        return res.status(400).json({
            message: 'Bad request. Need thumnail images as a non-empty array',
        });
    }

    try {
        // Check for duplicate hotel
        const duplicate = await HotelModel.findOne({ name }).lean().exec();

        if (duplicate) {
            return res.status(409).json({ message: 'Conflict. Duplicate hotel name or title' });
        }

        // Create hotel
        const newHotel = await HotelModel.create({
            name,
            title,
            contact: {
                phone,
                email,
            },
            desc,
            thumbnails,
            location: {
                nation,
                city,
                province: province || '',
                others: others || '',
            },
            stars,
        });

        console.log(newHotel);

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
