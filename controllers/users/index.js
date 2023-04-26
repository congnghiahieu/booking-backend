const { getUsers } = require('./getUser');
const { updateUserInfoById } = require('./updateUser');
const { createUser } = require('./createUser');
const { deleteUserById } = require('./deleteUser');
const {updateUserFavInfoById} = require('./updateFav.js')
const {updateUserCartInfoById} = require('./updateCart.js')
const  {deleteCart} = require('./deleteCart.js')
const  {deleteFav} = require('./deleteFav.js')
module.exports = {
    getUsers,
    createUser,
    updateUserInfoById,
    deleteUserById,
    updateUserCartInfoById,
    updateUserFavInfoById,
    deleteCart,
    deleteFav,
    
};
