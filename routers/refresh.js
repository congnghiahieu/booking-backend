const router = require("express").Router();
const refreshNewToken = require("../controllers/refreshTokenController");

router.get("/", refreshNewToken);

module.exports = router;
