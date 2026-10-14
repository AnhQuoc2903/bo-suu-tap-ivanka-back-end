const router = require("express").Router();

const { login, me } = require("../controllers/auth.controller");

const { requireAdmin } = require("../middlewares/auth.middleware");

router.post("/login", login);
router.get("/me", requireAdmin, me);

module.exports = router;
