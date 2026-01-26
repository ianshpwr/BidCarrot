const authService = require("../services/auth.service.js");

exports.signup = async (req, res) => {
  const response = await authService.signup(req.body);
  res.json(response);
};

exports.login = async (req, res) => {
  const response = await authService.login(req.body);
  res.json(response);
};
