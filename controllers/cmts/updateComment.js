const CommentModel = require('../../model/Comment');
const checkValidMongoId = require('../../utils/checkValidMongoId');

/*
  PUT /v1/cmts/update_cmt
*/

const updateCmtById = async (req, res) => {
    const { id, title, content, point } = req.body;

    // Check for data fullfil
    if (!id) {
        return res.status(400).json({
            message: 'Bad request. Required comment ID',
        });
    }

    // Check valid mongo ID
    const { isValid, errMsg, errCode } = checkValidMongoId(id);
    if (!isValid) return res.status(errCode).json(errMsg);

    try {
        // Check for exist comment
        const cmt = await CommentModel.findById(id).exec();

        if (!cmt) {
            return res.status(400).json({ message: `Bad request. Comment with ${id} not found` });
        }

        // Update new information
        if (title) cmt.title = title;
        if (content) cmt.content = content;
        if (point) cmt.point = point;

        const result = await cmt.save();

        console.log(result);

        return res.status(201).json({
            message: `Comment ID ${result._id} updated sucessfully`,
        });
    } catch (err) {
        console.log(err);
        return res.status(422).json({
            message: `Update comment with ${id} failed`,
            isError: true,
        });
    }
};

module.exports = {
    updateCmtById,
};
