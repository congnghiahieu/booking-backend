const UserModel = require('../../model/User');
const mongoose = require('mongoose');
const rolesList = Object.values(require('../../config/rolesList'));
const checkValidMongoId = require('../../utils/checkValidMongoId');
const findDoc = require('../../utils/findDoc');
const HotelModel = require('../../model/Hotel');
const ServiceModel = require('../../model/Service');

/*
  DELETE /v1/users
*/

const deleteFav = async (req, res) => {
    const { id,hotelId } = req.body;

    // Check for fullfil information
    if (!id || !hotelId ) {
        return res.status(400).json({
            message: 'Bad request. Required users ID, hotel ID, and service ID',
        });
    }

    // Check valid mongo ID
    const { isValid, errMsg, errCode } = checkValidMongoId(id,hotelId);
    if (!isValid) return res.status(errCode).json(errMsg);

    try {
        // Check for exist hotel
        let user;
        let hotel;
        let service; 
       await Promise.all([UserModel.findById(id).exec(),HotelModel.findById(hotelId).exec()])
            .then(data => {
               user = data[0];
               hotel = data[1];
            
               
            })

            user.fav = user.fav.filter(c => c.hotelId !== hotelId);
            const result = await user.save();


        console.log(result);

        return res.status(200).json({
            message: `this fav item has been deleted successfully`,
        });
    } catch (err) {
        console.log(err);
        return res.status(422).json({
            message: `Delete user by id ${id} failed`,
            isError: true,
        });
    }
};

module.exports = {
    deleteFav
};
