const HotelModel = require('../../model/Hotel');
const { getRan } = require('../../utils/random');

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
        nation,
        province,
        district,
        others,
        stars = 4,
        point = getRan(8, 10, 1),
    } = req.body;

    // Check for data fullfil
    if (!name || !title || !phone || !email || !desc || !nation || !province) {
        return res.status(400).json({
            message:
                'Bad request. Need full information includes: name, title, phone, email, desc, nation, province',
        });
    }

    try {
        // Check for duplicate hotel
        const duplicate = await HotelModel.findOne({ name }).lean().exec();

        if (duplicate) {
            return res.status(409).json({ message: 'Conflict. Duplicate hotel name or title' });
        }

        // Create new hotel
        const newHotel = await HotelModel.create({
            name,
            title,
            contact: {
                phone,
                email,
            },
            desc,
            location: {
                nation,
                province,
                district: district || '',
                others: others || '',
            },
            stars,
            point: point,
        });

        // console.log(newHotel);

        return res.status(201).json({
            message: 'New hotel created sucessfully',
        });
    } catch (err) {
        // console.log(err);
        return res.status(422).json({
            message: 'Create hotel failed',
            isError: true,
        });
    }
};

module.exports = {
    createHotel,
};
