const HotelModel = require('../../model/Hotel');
const checkValidMongoId = require('../../utils/checkValidMongoId');

/*
    PUT /v1/hotels/update_info
*/

const updateHotelInfoById = async (req, res) => {
    const { id, name, title, phone, email, desc, nation, city, province, others, stars } = req.body;

    // Check for data fullfil
    if (!id) {
        return res.status(400).json({
            message: 'Bad request. Required hotel ID',
        });
    }

    // Check valid mongo ID
    const { isValid, errMsg, errCode } = checkValidMongoId(id);
    if (!isValid) return res.status(errCode).json(errMsg);

    try {
        // Check for exist hotel
        const hotel = await HotelModel.findById(id).exec();

        if (!hotel) {
            return res.status(400).json({ message: 'Bad request. Hotel not found' });
        }

        // Update new information
        if (name) hotel.name = name;
        if (title) hotel.title = title;
        if (phone) hotel.phone = phone;
        if (email) hotel.email = email;
        if (desc) hotel.desc = desc;
        if (stars) hotel.stars = stars;
        if (nation) hotel.location.nation = nation;
        if (city) hotel.location.city = city;
        if (province) hotel.location.province = province;
        if (others) hotel.location.others = others;

        const result = await hotel.save();

        console.log(result);

        return res.status(201).json({
            message: `Hotel ID ${hotel._id} updated sucessfully`,
        });
    } catch (err) {
        console.log(err);
        return res.status(422).json({
            message: `Update hotel with ID ${id} failed`,
            isError: true,
        });
    }
};

module.exports = {
    updateHotelInfoById,
};
