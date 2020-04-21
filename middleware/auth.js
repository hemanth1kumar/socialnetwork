const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
	const token = req.header("x-auth-token");

	if (!token)
		return res
			.status(401)
			.json([{ msg: "No authorization, token required" }]);

	try {
		const decoded = jwt.verify(token, config.get("jwtToken"));
		req.user = decoded.user;
		next();
	} catch (error) {
		console.log(error.message);
		res.status(401).json([{ msg: "Token not valid" }]);
	}
};
