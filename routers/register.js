const router = require("express").Router();
const { registerNewUser } = require("../controllers/registerController");

router.post("/", registerNewUser);

module.exports = router;
