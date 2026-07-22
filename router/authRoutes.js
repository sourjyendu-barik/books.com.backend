const routes = require("express").Router();
const { googleDetails } = require("../controller/authController");
routes.post("/callback", googleDetails);

module.exports = routes;
