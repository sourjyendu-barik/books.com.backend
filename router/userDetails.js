const routes = require("express").Router();
const { myData, logout } = require("../controller/authController");
routes.get("/me", myData);
routes.post("/logout", logout);
module.exports = routes;
