const { getComments } = require('./getComment');
const { createComment } = require('./createComment');
const { updateCmtById } = require('./updateComment');
const { deleteComment } = require('./deleteComment');

module.exports = {
    getComments,
    createComment,
    updateCmtById,
    deleteComment,
};
