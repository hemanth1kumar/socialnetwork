const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");

//    @Route  =>  GET /api/profile/me  || @Access => Private
router.get("/me", auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.user.id,
		}).populate("user", ["name", "avatar"]);

		// If Profile Doesn't exist
		if (!profile)
			return res.status(400).json([{ msg: "Profile doesn't exist" }]);

		res.json(profile);
	} catch (error) {
		console.log(error.message);
		res.status(500).send("Server Error");
	}
});

// @Route => Post /api/profile || @Access => Private
router.post(
	"/",
	[
		auth,
		[
			check("status", "status is required").not().isEmpty(),
			check("skills", "skills are required").not().isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty())
			return res.status(400).json([{ errors: errors.array() }]);

		try {
			let user = await User.findById(req.user.id);

			// Check if User exists
			if (!user)
				return res.status(400).json([{ msg: "User doesn't exist" }]);

			let {
				company,
				website,
				location,
				status,
				skills,
				bio,
				githubusername,
				experience,
				education,
				youtube,
				instagram,
				facebook,
				twitter,
			} = req.body;

			let newProfile = {};

			newProfile.user = req.user.id;

			if (company) newProfile.company = company;
			if (website) newProfile.website = website;
			if (location) newProfile.location = location;
			if (status) newProfile.status = status;

			if (bio) newProfile.bio = bio;
			if (githubusername) newProfile.githubusername = githubusername;

			if (skills) {
				newProfile.skills = skills
					.split(",")
					.map((skill) => skill.trim());
			}

			console.log(newProfile);
		} catch (error) {
			console.log(error.message);
			res.status(500).send("Server Error");
		}
	}
);

module.exports = router;
