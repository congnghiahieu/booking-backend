const BookModel = require('../../model/Book');
const UserModel = require('../../model/User');
const HotelModel = require('../../model/Hotel');
const ServiceModel = require('../../model/Service');
const { checkValidMongoId } = require('../../utils/checkValidMongoId');
const findDoc = require('../../utils/findDoc');
const makeTrans = require('../../utils/makeTrans');
const { add } = require('date-fns');
const { BOOK_STATUS } = require('../../config/bookConst');

/*
  POST /v1/books
*/

/* Tạo 1 book đồng thời cũng tạo 1 trans*/
const createBook = async (req, res) => {
    // Book info
    const { userId, cusInfo, hotelId, serviceId, start, end, room } = req.body;

    // Check for data fullfil
    // Fullfil customer info
    const { cusName, cusEmail, cusPhone } = cusInfo;
    if (!userId || !hotelId || !serviceId || !cusName || !cusEmail || !cusPhone) {
        return res.status(400).json({
            message:
                'Bad request. Need full information includes: user id, customer name, customer email, customer phone number, hotel id, service id',
        });
    }

    // Check valid mongo ID
    const { isValid, errMsg, errCode } = checkValidMongoId(userId, hotelId, serviceId);
    if (!isValid) {
        return res.status(errCode).json(errMsg);
    }

    let transRes;

    try {
        // Check valid info
        // Check valid date value
        if (!start) start = new Date();
        // YYYY-MM-DD
        if (!end) end = add(start, { days: 1 });
        if (new Date(start) > new Date(end)) {
            return res.status(400).json({
                message: 'Bad request. Start date greater than end date',
            });
        }

        // Check user, hotel and service exist

        const [user, hotel, service] = await Promise.all([
            findDoc('user', userId, UserModel)(),
            findDoc('hotel', hotelId, HotelModel)(),
            findDoc('service', serviceId, ServiceModel)(),
        ]);

        // console.log(user instanceof mongoose.Document);
        // console.log(user.constructor.name);
        // console.log(hotel instanceof mongoose.Document);
        // console.log(hotel.constructor.name);
        // console.log(service instanceof mongoose.Document);
        // console.log(service.constructor.name);

        // Kiểm tra service xem còn phòng không
        if (service.availableRooms <= 0) {
            return res.status(409).json({
                message: 'Service fullly booked',
            });
        }

        // Create Book
        // Trạng thái của 1 book. Book không bao giờ bị xoá. Chỉ có các trạng thái sau:
        // Bị huỷ
        // Đã hoàn thành
        // Đang trong quá trình
        // Chuẩn bị diễn ra
        const newBook = await BookModel.create({
            userId,
            cusInfo: {
                cusName,
                cusEmail,
                cusPhone,
            },
            hotelId,
            serviceId,
            isPaid: true,
            status: BOOK_STATUS.INCOMMING,
            period: {
                start,
                end,
            },
            room: room,
        });

        // Trans info
        const { card, value, transType } = req.body;
        // Tạo giao dịch
        // Hiện tại giao dịch mặc định là loại giao dịch đặt phòng và trạng thái thành công
        transRes = await makeTrans(userId, card, value, transType);
        if (transRes.isError) {
            await newBook.deleteOne();
            return res.status(transRes.errCode).json({
                message: transRes.errMsg,
            });
        }

        // Khi xoá 1 lượt đặt phòng thì khôi phục lại số phòng cho service
        // Hotel số lượt từng đặt vẫn giữ nguyên, số lượt đặt hiện tại thì trừ 1
        // History user book giữ nguyên, hiện tại trừ 1
        // Nếu tạo book và giao dịch thành công
        newBook.transactionId = transRes.transaction.id;
        service.availableRooms -= 1;
        hotel.bookedCount += 1;

        await Promise.all([
            newBook.save(),
            transRes.transaction.save(),
            user.save(),
            hotel.save(),
            service.save(),
        ]);

        return res.status(201).json({
            message: 'New book created sucessfully',
        });
    } catch (err) {
        console.log(err);
        await transRes?.transaction?.deleteOne();
        return res.status(422).json({
            message: `Create book failed. ${err.message}`,
            isError: true,
        });
    }
};

module.exports = {
    createBook,
};
