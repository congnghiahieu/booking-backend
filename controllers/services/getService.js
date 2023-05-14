const ServiceModel = require('../../model/Service');
const HotelModel = require('../../model/Hotel');
const { checkValidMongoId } = require('../../utils/checkValidMongoId');
const pagingFind = require('../../utils/pagingFind');

/*
  GET /v1/services
  GET /v1/services?id=...
  GET /v1/services?hotel_id=...
*/

const getServices = async (req, res) => {
    const { id, hotel_id: hotelId, page, per_page } = req.query;

    // Check only accept one params
    let paramsCount = 0;
    let curId = null;
    let curModel = null;

    if (id) {
        paramsCount++;
        curModel = ServiceModel;
        curId = id;
    }

    if (hotelId) {
        paramsCount++;
        curId = hotelId;
        curModel = HotelModel;
    }

    if (paramsCount > 1) {
        // Check valid query params
        return res.status(400).json({
            message:
                'Bad request. Can use at most one in 2 params: id, hotel_id or no param to get all services',
        });
    }

    // Check valid mongo ID
    if (curId) {
        const { isValid, errMsg, errCode } = checkValidMongoId(curId);
        if (!isValid) return res.status(errCode).json(errMsg);
    }

    try {
        // If no param use, find all
        if (!curId) {
            const serviceList = await pagingFind(page, per_page, ServiceModel);
            return res.status(200).json(serviceList);
        }

        // If 1 param use (id or hotel_id)
        // Check for exist service or hotel
        const cur = await curModel.findById(curId).lean().exec();
        if (!cur) {
            return res.status(400).json({
                message: `Bad request. ${id ? 'service' : 'hotel'} with ${curId} not found`,
            });
        }

        // If find one service by id only
        if (id) return res.status(200).json(cur);

        // If find service by hotel id
        const serviceList = await pagingFind(page, per_page, ServiceModel, { hotelId: hotelId });
        return res.status(200).json(serviceList);
    } catch (err) {
        console.log(err);

        const errMsg = `Get ${id ? 'service' : 'services'} ${hotelId ? 'of hotel' : ''} ${
            curId ? `with ID ${curId}` : ''
        } failed`;

        return res.status(422).json({
            message: errMsg,
            isError: true,
        });
    }
};

module.exports = {
    getServices,
};
