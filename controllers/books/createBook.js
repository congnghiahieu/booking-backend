const BookModel = require('../../model/Book');
const UserModel = require('../../model/User');
const HotelModel = require('../../model/Hotel');
const ServiceModel = require('../../model/Service');
const checkValidMongoId = require('../../utils/checkValidMongoId');
const findDoc = require('../../utils/findDoc');

/*
  POST /v1/books
*/

const createBook = async (req, res) => {
    const { userId, hotelId, serviceId, start, end } = req.body;

    // Check for data fullfil
    if (!userId || !hotelId || !serviceId) {
        return res.status(400).json({
            message: 'Bad request. Need full information includes: user id, hotel id, service id',
        });
    }

    // Check valid mongo ID
    const { isValid, errMsg, errCode } = checkValidMongoId(userId, hotelId, serviceId);
    if (!isValid) return res.status(errCode).json(errMsg);

    try {
        // Check valid info

        // Valid date time
        if (!start) start = Date.now();
        // 2100-12-31
        if (!end) end = Date.UTC(2100, 11, 31);

        // Check valid date value
        if (new Date(start) > new Date(end)) {
            return res.status(400).json({
                message: 'Bad request. Start date greater than end date',
            });
        }

        // Check user, hotel and service exist
        await Promise.all([
            findDoc('user', { _id: userId }, UserModel)(),
            findDoc('hotel', { _id: hotelId }, HotelModel)(),
            findDoc('service', { _id: serviceId, hotelId: hotelId }, ServiceModel)(),
        ]);

        // Create Book
        const newBook = await BookModel.create({
            userId,
            hotelId,
            serviceId,
            period: {
                start,
                end,
            },
        });

        console.log(newBook);

        return res.status(201).json({
            message: 'New book created sucessfully',
        });
    } catch (err) {
        console.log(err);
        return res.status(422).json({
            message: `Create book failed. ${err.message}`,
            isError: true,
        });
    }
};

module.exports = {
    createBook,
};
