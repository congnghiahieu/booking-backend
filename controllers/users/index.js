const { getUsers } = require('./getUser');
const { updateUserInfoById } = require('./updateUser');
const { createUser } = require('./createUser');
const { deleteUserById } = require('./deleteUser');

module.exports = {
    getUsers,
    createUser,
    updateUserInfoById,
    deleteUserById,
};
