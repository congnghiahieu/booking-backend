const UserModel = require('../../model/User');
const mongoose = require('mongoose');
const rolesList = Object.values(require('../../config/rolesList'));
const checkValidMongoId = require('../../utils/checkValidMongoId');
const findDoc = require('../../utils/findDoc');
const HotelModel = require('../../model/Hotel');
const ServiceModel = require('../../model/Service');
/*
    PUT /v1/users/update_info
*/

const updateUserCartInfoById = async (req, res) => {
    const { id, hotelId,serviceId } = req.body;



    // Check for data fullfil
    if (!id || !hotelId || !serviceId) {
        return res.status(400).json({
            message: 'Bad request. Required users ID and hotel ID',
        });
    }

    // Check valid mongo ID
    const { isValid, errMsg, errCode } = checkValidMongoId(id, hotelId,serviceId);
    if (!isValid) return res.status(errCode).json(errMsg);

    try {
        // Check for exist hotel
        //const user = await UserModel.findById(id).exec();
        // const data = await Promise.all([findDoc('user', { _id: id }, UserModel, false)(), findDoc('hotel', { _id: hotelId }, HotelModel, false)()])
        let user;
        let hotel;
        let service; 
       await Promise.all([UserModel.findById(id).exec(),HotelModel.findById(hotelId).exec(),ServiceModel.findById(serviceId).exex()])
            .then(data => {
               user = data[0];
               hotel = data[1];
               service = data[2]; 
               
            })
        
        
    
        const cartItem ={
            hotelId: hotelId,
            name: hotel.name,
            location : `${hotel?.location?.nation}, ${hotel?.location?.city}`,
            image : hotel.imgs[0],
            stars: hotel.stars,
            cmtSum: hotel.cmtSum,
            count : hotel.bookedCount,
            totalRoom : service.totalRoom,
            serviceId : service._id,
            serviceName : service.name,
            servicePrice : service.price
        }
        user.cart.push(cartItem);

        const result = await user.save();

        console.log(result);

        return res.status(201).json({
            
            message: `User ID ${result._id} updated sucessfully`,
        });
    } catch (err) {
        console.log(err);
        return res.status(422).json({
            message: `. Update user info with ID ${id} failed`,
            isError: true,
        });
    }
};

module.exports = {
    updateUserCartInfoById,
};
