const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");

//    @Route  =>  GET /api/auth  || @Access => Private (token req) || Gives User details
router.get("/", auth, async (req, res) => {
	try {
		let user = await User.findById(req.user.id).select("-password");
		if (!user) return res.status(400).send("'user not valid");
		res.json(user);
	} catch (error) {
		console.log(error.message);
		res.status(500).send("Server Error");
	}
});

//    @Route  =>  POST /api/auth  || @Access => Public  || Login Route (returns token)
router.post(
	"/",
	[
		check("email", "Please include a valid email").isEmail(),
		check("password", "Please include a valid password").not().isEmpty(),
	],
	async (req, res) => {
		//Checking for errors
		const errors = validationResult(req);

		if (!errors.isEmpty())
			return res.status(400).json({ errors: errors.array() });

		try {
			let { email, password } = req.body;

			// Checking DB for user
			let user = await User.findOne({ email });

			if (!user) {
				return res
					.status(400)
					.json({ errors: [{ msg: "No Such User Exists" }] });
			}

			// Checking for valid password
			let isValid = await bcrypt.compare(password, user.password);

			if (!isValid) {
				return res
					.status(400)
					.json({ errors: [{ msg: "Invalid Credentials" }] });
			}

			// JWT token
			const payload = {
				user: {
					id: user.id,
				},
			};

			jwt.sign(
				payload,
				config.get("jwtToken"),
				{ expiresIn: 360000 },
				(err, token) => {
					if (err) throw err;
					res.json({ token });
				}
			);
		} catch (error) {
			console.log(error.message);
		}
	}
);

module.exports = router;
