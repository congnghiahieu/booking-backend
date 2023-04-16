const ServiceModel = require('../../model/Service');
const HotelModel = require('../../model/Hotel');
const checkValidMongoId = require('../../utils/checkValidMongoId');

/*
  DELETE /v1/services?id
  DELETE /v1/services?hotel_id
*/

const deleteServices = async (req, res) => {
    const { id, hotel_id: hotelId } = req.query;

    // Check only accept one params
    let paramsCount = 0;
    let curModel = null;
    let curId = null;

    if (id) {
        paramsCount++;
        curId = id;
        curModel = ServiceModel;
    }

    if (hotelId) {
        paramsCount++;
        curId = hotelId;
        curModel = HotelModel;
    }

    if (paramsCount != 1) {
        // Check valid query params
        return res.status(400).json({
            message: 'Bad request. Need exactly one in 2 params: id, hotel_id',
        });
    }

    // Check valid mongo ID
    const { isValid, errMsg, errCode } = checkValidMongoId(curId);
    if (!isValid) return res.status(errCode).json(errMsg);

    try {
        // Check for exist service or hotel
        const cur = await curModel.findById(curId).exec();

        if (!cur) {
            return res.status(400).json({
                message: `Bad request. ${id ? 'Service' : 'Hotel'} with ${curId} not found`,
            });
        }

        let result;

        // If delete one service
        if (id) {
            result = await cur.deleteOne();
            return res.status(200).json({
                message: `Service name ${result.name} with ID ${result._id} deleted successfully`,
            });
        }

        // If delete service by hotel id
        result = await ServiceModel.deleteMany({
            hotelId,
        })
            .lean()
            .exec();

        console.log(result);

        return res.status(200).json({
            message: `All service of hotel ${cur.name} ${cur._id} deleted successfully`,
            deleted: result.deletedCount,
        });
    } catch (err) {
        console.log(err);

        const errMsg = `Delete ${
            hotelId ? `all services of hotel` : 'service'
        } with ID ${curId} failed`;

        return res.status(422).json({
            message: errMsg,
            isError: true,
        });
    }
};

module.exports = {
    deleteServices,
};
