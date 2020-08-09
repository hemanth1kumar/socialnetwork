import axios from "axios";
import { setAlert } from "./alert";
import { GET_POSTS, POST_ERROR, UPDATE_LIKES, DELETE_POST, ADD_POST, GET_POST, ADD_COMMENT, REMOVE_COMMENT } from "./types";

// Get Posts
export const getPosts = () => async (dispatch) => {
	try {
		const res = await axios.get("/api/posts");
		dispatch({
			type: GET_POSTS,
			payload: res.data,
		});
	} catch (error) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: error.response.statusText, status: error.response.status },
		});
	}
};

// Add Like
export const addLike = (postId) => async (dispatch) => {
	try {
		const res = await axios.put(`/api/posts/like/${postId}`);
		if (typeof res.data === "object" && !Array.isArray(res.data)) {
			dispatch(setAlert(res.data.msg, "danger"));
		} else {
			dispatch({
				type: UPDATE_LIKES,
				payload: { id: postId, likes: res.data },
			});
		}
	} catch (error) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: error.response.statusText, status: error.response.status },
		});
	}
};

// Remove Like
export const removeLike = (postId) => async (dispatch) => {
	try {
		const res = await axios.put(`/api/posts/unlike/${postId}`);
		console.log(res.data);
		if (typeof res.data === "object" && !Array.isArray(res.data)) {
			dispatch(setAlert(res.data.msg, "danger"));
		} else {
			dispatch({
				type: UPDATE_LIKES,
				payload: { id: postId, likes: res.data },
			});
		}
	} catch (error) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: error.response.statusText, status: error.response.status },
		});
	}
};

// Delete Post
export const deletePost = (postId) => async (dispatch) => {
	try {
		const res = await axios.delete(`/api/posts/${postId}`);

		dispatch({
			type: DELETE_POST,
			payload: postId,
		});
		dispatch(setAlert("Post Removed", "success"));
	} catch (error) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: error.response.statusText, status: error.response.status },
		});
	}
};

// Add Post
export const addPost = (formData) => async (dispatch) => {
	try {
		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};

		const res = await axios.post("/api/posts", formData, config);

		dispatch({
			type: ADD_POST,
			payload: res.data,
		});
		dispatch(setAlert("Post Created", "success"));
	} catch (error) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: error.response.statusText, status: error.response.status },
		});
	}
};

// Get post
export const getPost = (id) => async (dispatch) => {
	try {
		const res = await axios.get(`/api/posts/${id}`);

		dispatch({
			type: GET_POST,
			payload: res.data,
		});
	} catch (error) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: error.response.statusText, status: error.response.status },
		});
	}
};

// Add commment
export const addComment = (postId, formData) => async (dispatch) => {
	try {
		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};

		const res = await axios.post(`/api/posts/comment/${postId}`, formData, config);

		dispatch({
			type: ADD_COMMENT,
			payload: res.data,
		});
		// dispatch(setAlert("added comment", "success"));
	} catch (error) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: error.response.statusText, status: error.response.status },
		});
	}
};

// Delete comment
export const deleteComment = (postId, commentId) => async (dispatch) => {
	try {
		const res = await axios.delete(`/api/posts/comment/${postId}/${commentId}`);

		dispatch({
			type: REMOVE_COMMENT,
			payload: commentId,
		});
		dispatch(setAlert("comment removed", "success"));
	} catch (error) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: error.response.statusText, status: error.response.status },
		});
	}
};