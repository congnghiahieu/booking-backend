const { getUsers } = require('./getUser');
const { updateUserInfoById } = require('./updateUser');
const { createUser } = require('./createUser');
const { deletUserById } = require('./deleteUser');

module.exports = {
    getUsers,
    createUser,
    updateUserInfoById,
    deletUserById,
};
