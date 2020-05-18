const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Post");

//    @Route  =>  POST /api/posts  || @Access => Private || Create a post
router.post(
	"/",
	auth,
	check("text", "text is required").not().isEmpty(),
	async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty())
			return res.status(400).json({ errors: errors.array() });

		try {
			const user = await User.findById(req.user.id).select("-password");
			if (!user) return res.status(400).json({ msg: "User not found" });

			const newPost = new Post({
				text: req.body.text,
				name: user.name,
				avatar: user.avatar,
				user: req.user.id,
			});

			await newPost.save();
			res.json({ post: newPost });
		} catch (error) {
			console.log(error);
			res.status(500).send("Server Error");
		}
	}
);

//    @Route  =>  GET /api/posts  || @Access => Private || Get all post
router.get("/", auth, async (req, res) => {
	try {
		const posts = await Post.find().sort({ date: -1 });
		res.json({ posts });
	} catch (error) {
		console.log(error);
		res.status(500).send("Srrver Error");
	}
});

//    @Route  =>  GET /api/posts  || @Access => Private || Get post by Id
router.get("/:post_id", auth, async (req, res) => {
	try {
		let posts = await Post.findById(req.params.post_id);
		res.json({ posts });
	} catch (error) {
		console.log(error);
		res.status(500).send("Server Error");
	}
});

//    @Route  =>  DELETE /api/posts  || @Access => Private || Delete post
router.delete("/:post_id", auth, async (req, res) => {
	try {
		let post = await Post.findById(req.params.post_id);

		// Check for right User
		if (post.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: "user not authorized" });
		}
		await post.remove();
		res.json({ msg: "Post removed" });
	} catch (error) {
		console.log(error);
		if (error.name === "CastError") {
			return res.status(401).json({ erros: { msg: "post not found" } });
		}
		res.status(500).send("Server Error");
	}
});

//    @Route  =>  DELETE /api/posts/like/:id  || @Access => Private || Like a post
router.put("/like/:id", auth, async (req, res) => {
	try {
		let post = await Post.findById(req.params.id);
		if (!post) return res.status(400).json({ msg: "Post not found" });

		if (
			post.likes.filter((like) => like.user.toString() === req.user.id)
				.length > 0
		)
			return res.json({ msg: "post already liked" });

		post.likes.unshift({ user: req.user.id });
		await post.save();

		res.json(post.likes);
	} catch (error) {
		console.log(error);
		res.status(500).send("Server Error");
	}
});

//    @Route  =>  DELETE /api/posts/unlike/:id  || @Access => Private || UnLike a post
router.put("/unlike/:id", auth, async (req, res) => {
	try {
		let post = await Post.findById(req.params.id);
		if (!post) return res.status(400).json({ msg: "Post not found" });

		if (
			post.likes.filter((like) => like.user.toString() === req.user.id)
				.length == 0
		)
			return res.json({ msg: "post has not yet liked" });

		let index = post.likes
			.map((like) => like.user.toString())
			.indexOf(req.user.id);

		post.likes.splice(index, 1);
		await post.save();

		res.json(post.likes);
	} catch (error) {
		console.log(error);
		res.status(500).send("Server Error");
	}
});

//    @Route  =>  POST /api/posts/comment/:id  || @Access => Private || comment on a post
router.post(
	"/comment/:id",
	auth,
	check("text", "text is required").not().isEmpty(),
	async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty())
			return res.status(400).json({ errors: errors.array() });

		try {
			const user = await User.findById(req.user.id).select("-password");
			const post = await Post.findById(req.params.id);

			if (!user) return res.status(400).json({ msg: "User not found" });
			if (!post) return res.status(400).json({ msg: "post not found" });

			let comment = {
				text: req.body.text,
				name: user.name,
				avatar: user.avatar,
				user: req.user.id,
			};

			post.comments.unshift(comment);
			await post.save();
			res.json(post.comments);
		} catch (error) {
			if (error.name === "CastError") {
				return res
					.status(401)
					.json({ erros: { msg: "post not found" } });
			}
			console.log(error);
			res.status(500).send("Server Error");
		}
	}
);

//    @Route  =>  DELETe /api/posts/comment/:id/:comment_id  || @Access => Private || delete comment on a post

router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) return res.status(400).json({ msg: "post not found" });

		let index = post.comments
			.map((com) => com.id)
			.indexOf(req.params.comment_id);

		if (index < 0)
			return res.status(400).json({ msg: "comment not found" });

		if (post.comments[index].user.toString() !== req.user.id)
			return res.status(401).json({ msg: "you are not authorized" });

		post.comments.splice(index, 1);
		await post.save();

		res.json(post.comments);
	} catch (error) {
		if (error.name === "CastError") {
			return res.status(401).json({ erros: { msg: "post not found" } });
		}
		console.log(error);
		res.status(500).send("Server Error");
	}
});
module.exports = router;
