const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const axios = require("axios");

//    @Route  =>  GET /api/profile/me  || @Access => Private || Get My Profile
router.get("/me", auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.user.id,
		}).populate("user", ["name", "avatar"]);

		// If Profile Doesn't exist
		if (!profile)
			return res.status(400).json({ msg: "Profile doesn't exist" });

		res.json(profile);
	} catch (error) {
		console.log(error.message);
		res.status(500).send("Server Error");
	}
});

// @Route => Get /api/profile || @Access => Public	||	Get All Profiles
router.get("/", async (req, res) => {
	try {
		let profiles = await Profile.find().populate("user", [
			"name",
			"avatar",
		]);
		res.json(profiles);
	} catch (error) {
		console.log(error.message);
		res.status(500).send("Sever Error");
	}
});

// @Route => Get /api/profile/user/:user_id || @Access => Public || Get profile by user_id
router.get("/user/:user_id", async (req, res) => {
	try {
		let profile = await Profile.findOne({
			user: req.params.user_id,
		}).populate("user", ["name", "avatar"]);

		if (!profile) return res.status(400).json({ msg: "Profile not found" });

		res.json({ profile });
	} catch (error) {
		console.log(error.message);
		if (error.name === "CastError") {
			return res
				.status(400)
				.json({ erros: [{ msg: "Profile not found" }] });
		}

		res.status(500).send("Server Error");
	}
});

// @Route => Delete /api/profile || @Access => Private || Deleting profile
router.delete("/", auth, async (req, res) => {
	try {
		// remove user posts

		// Remove Profle
		await Profile.findOneAndRemove({ user: req.user.id });

		// Remove User
		await Profile.findOneAndRemove({ _id: req.user.id });

		res.json({ msg: "User Deleted" });
	} catch (error) {
		console.log(error.message);
		res.status(500).send("Server Error");
	}
});

// @Route => Post /api/profile/experience || @Access => Private || Add profile experience
router.post(
	"/experience",
	[
		auth,
		[
			check("title", "Title is required").not().isEmpty(),
			check("company", "Company is required").not().isEmpty(),
			check("location", "Location is required").not().isEmpty(),
			check("from", "From Date is required").not().isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const {
			title,
			location,
			company,
			from,
			to,
			current,
			description,
		} = req.body;

		const newExp = {
			title,
			location,
			company,
			from,
			to,
			current,
			description,
		};

		try {
			let profile = await Profile.findOne({ user: req.user.id });
			profile.experience.unshift(newExp);
			await profile.save();

			res.json({ profile });
		} catch (error) {
			console.log(error.message);
			res.status(500).send("Server Error");
		}
	}
);

// @Route => Delete /api/profile/experience || @Access => Private || Delete profile experience
router.delete("/experience/:exp_id", auth, async (req, res) => {
	try {
		let profile = await Profile.findOne({ user: req.user.id });

		if (!profile)
			return res
				.status(400)
				.json({ errors: [{ msg: "Profile not found" }] });

		let index = profile.experience
			.map((exp) => exp.id)
			.indexOf(req.params.exp_id);

		if (index !== -1) profile.experience.splice(index, 1);

		await profile.save();
		res.json({ profile });
	} catch (error) {
		console.log(error.message);
		res.status(500).send("Server Error");
	}
});

// @Route => Put /api/profile/experience || @Access => Private || Update profile experience
router.put("/experience/:exp_id", auth, async (req, res) => {
	try {
		let profile = await Profile.findOne({ user: req.user.id });
		let index = profile.experience
			.map((exp) => exp.id)
			.indexOf(req.params.exp_id);

		if (index !== -1) profile.experience[index] = 1;
	} catch (error) {
		console.log(error.message);
		res.status(500).send("Server Error");
	}
});

// @Route => Post /api/profile || @Access => Private || Creating a profile
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

			newProfile.social = {};

			if (youtube) newProfile.social.youtube = youtube;
			if (instagram) newProfile.social.instagram = instagram;
			if (facebook) newProfile.social.facebook = facebook;
			if (twitter) newProfile.social.twitter = twitter;

			let profile = await Profile.findOne({ user: req.user.id });

			if (profile) {
				//Update Profile
				profile = await Profile.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: newProfile },
					{ new: true }
				);

				return res.json(profile);
			}

			profile = new Profile(newProfile);
			await profile.save();
			return res.json({ profile });
		} catch (error) {
			console.log(error.message);
			res.status(500).send("Server Error");
		}
	}
);

// @Route => Put /api/profile/education || @Access => Private || Add profile Education
router.post(
	"/education",
	auth,
	[
		check("school", "School is required").not().isEmpty(),
		check("degree", "Degree is required").not().isEmpty(),
		check("fieldofstudy", "Field of Study is required").not().isEmpty(),
		check("from", "From is required").not().isEmpty(),
	],
	async (req, res) => {
		let errors = validationResult(req);
		if (!errors.isEmpty())
			return res.status(400).json({ errors: errors.array() });

		let {
			school,
			degree,
			fieldofstudy,
			from,
			to,
			current,
			description,
		} = req.body;

		let newEducation = {
			school,
			degree,
			fieldofstudy,
			from,
			to,
			current,
			description,
		};

		try {
			let profile = await Profile.findOne({ user: req.user.id });
			if (!profile)
				return res.status(404).json({ msg: "Profile Not Found" });

			let education = profile.education;
			education.unshift(newEducation);

			profile.education = education;
			await profile.save();
			res.json(profile);
		} catch (error) {
			console.log(error);
			res.status(500).send("Server Errro");
		}
	}
);

// @Route => Put /api/profile/education || @Access => Private || update profile Education
router.put(
	"/education/:edu_id",
	auth,
	[
		check("school", "School is required").not().isEmpty(),
		check("degree", "Degree is required").not().isEmpty(),
		check("fieldofstudy", "Field of Study is required").not().isEmpty(),
		check("from", "From is required").not().isEmpty(),
	],
	async (req, res) => {
		let errors = validationResult(req);
		if (!errors.isEmpty())
			return res.status(400).json({ errors: errors.array() });

		let {
			school,
			degree,
			fieldofstudy,
			from,
			to,
			current,
			description,
		} = req.body;

		let newEducation = {
			school,
			degree,
			fieldofstudy,
			from,
			to,
			current,
			description,
		};

		try {
			let profile = await Profile.findOne({ user: req.user.id });
			if (!profile)
				return res.status(404).json({ msg: "Profile Not Found" });

			let edu_id = req.params.edu_id;
			let index = profile.education.map((edu) => edu.id).indexOf(edu_id);

			if (index < 0)
				return res.status(400).json({ msg: "education not found" });

			profile.education[index] = newEducation;
			await profile.save();
			res.json(profile);
		} catch (error) {
			console.log(error);
			res.status(500).send("Server Errro");
		}
	}
);

// @Route => Delete /api/profile/education || @Access => Private || Delete profile Education
router.delete("/education/:edu_id", auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id });
		if (!profile) res.status(400).json({ msg: "Profile not found" });

		let edu_id = req.params.edu_id;
		let index = profile.education
			.map((education) => education.id)
			.indexOf(edu_id);

		if (index < 0)
			return res.status(400).json({ msg: "education not found" });

		profile.education.splice(index, 1);

		await profile.save();
		res.json({ profile });
	} catch (error) {
		console.log(error);
		res.status(500).send("Server Error");
	}
});

// @Route => Get /api/profile/github:username || @Access => Private || Get Github Pofiles
// router.get("/github/:username", auth, async (req, res) => {
// 	try {
// 		const options = {
// 			uri: `https://github.com/users/${
// 				req.params.username
// 			}/repos?per_page=5&sort=created:asc&client_id=${config.get(
// 				"githubClientId"
// 			)}&client_secret=${config.get("githubClientSecret")}`,
// 			method: "GET",
// 			headers: {
// 				"user-agent": "node.js",
// 			},
// 		};
// 		request(options, (err, response, body) => {
// 			if (err) console.log("github error", err);
// 			if (response.statusCode !== 200) {
// 				return res.status(404).json({ msg: "No Github Profile found" });
// 			}

// 			// res.json(JSON.parse(body));
// 			console.log(body);
// 			res.send(body);
// 		});
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).send("Server Error");
// 	}
// });

router.get("/github/:username", auth, async (req, res) => {
	try {
		let response = await axios.get(
			`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
		);
		res.json({ repos: response.data });
	} catch (error) {
		console.log(error);
		res.status(500).send("Server Error");
	}
});
module.exports = router;
