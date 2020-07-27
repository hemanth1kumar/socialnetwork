import axios from "axios";

import { GET_PROFILE, GET_PROFILES, PROFILE_ERROR, UPDATE_PROFILE, CLEAR_PROFILE, ACCOUNT_DELETED, GET_REPOS } from "./types";

import { setAlert } from "./alert";

export const getCurrentProfile = () => async (dispatch) => {
	try {
		const res = await axios.get("/api/profile/me");
		dispatch({ type: GET_PROFILE, payload: res.data });
	} catch (error) {
		console.log(error);

		dispatch({
			type: PROFILE_ERROR,
			payload: {
				msg: error.response.statusText,
				status: error.response.status,
			},
		});
	}
};

// Create or Update Profile
export const createProfile = (formData, history, edit = false) => async (dispatch) => {
	try {
		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};

		const res = await axios.post("/api/profile", formData, config);

		dispatch({ type: GET_PROFILE, payload: res.data });

		dispatch(setAlert(edit ? "Profile Updated" : "Profile Created", "success"));

		if (!edit) {
			history.push("/dashboard"); // Cannot use Redirect in actions as in components so using history
		}
	} catch (err) {
		const errors = err.response.data.errors;
		console.log("errors", err.response.data.errors);

		if (errors) {
			errors.forEach((error) => {
				dispatch(setAlert(error.msg, "danger"));
			});
		}
	}
};

// Get All Profiles
export const getProfiles = () => async (dispatch) => {
	// dispatch({ type: CLEAR_PROFILE });
	try {
		const res = await axios.get("/api/profile");
		dispatch({ type: GET_PROFILES, payload: res.data });
	} catch (error) {
		console.log(error);

		// dispatch({
		//    type: PROFILE_ERROR,
		//    payload: {
		//       msg: error.response.statusText,
		//       status: error.response.status,
		//    },
		// });
	}
};

// Get Profile by user ID
export const getProfileById = (user_id) => async (dispatch) => {
	try {
		const res = await axios.get(`/api/profile/user/${user_id}`);
		dispatch({ type: GET_PROFILE, payload: res.data });
	} catch (error) {
		dispatch({
			type: PROFILE_ERROR,
			payload: {
				msg: error.response.statusText,
				status: error.response.status,
			},
		});
	}
};

// Get Github Repos by ID
export const getGithubRepos = (githubUserName) => async (dispatch) => {
	try {
		const res = await axios.get(`/api/profile/github/${githubUserName}`);
		dispatch({ type: GET_REPOS, payload: res.data });
	} catch (error) {
		// console.log(error);
		dispatch({
			type: PROFILE_ERROR,
			payload: {
				msg: error.response.statusText,
				status: error.response.status,
			},
		});
	}
};

// Add experience
export const addExperience = (formData, history) => async (dispatch) => {
	try {
		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};

		const res = await axios.post("/api/profile/experience", formData, config);

		console.log("resp", res);

		dispatch({ type: UPDATE_PROFILE, payload: res.data });

		dispatch(setAlert("Experience Added", "success"));

		history.push("/dashboard"); // Cannot use Redirect in actions as in components so using history
	} catch (err) {
		const errors = err.response.data.errors;
		console.log("errors", err.response.data.errors);

		if (errors) {
			errors.forEach((error) => {
				dispatch(setAlert(error.msg, "danger"));
			});
		}
		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

// Add Education
export const addEducation = (formData, history) => async (dispatch) => {
	try {
		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};

		const res = await axios.post("/api/profile/education", formData, config);

		dispatch({ type: UPDATE_PROFILE, payload: res.data });

		dispatch(setAlert("Education Added", "success"));

		history.push("/dashboard"); // Cannot use Redirect in actions as in components so using history
	} catch (err) {
		console.log("rep", err);

		const errors = err.response.data.errors;
		console.log("errors", err.response.data.errors);

		if (errors) {
			errors.forEach((error) => {
				dispatch(setAlert(error.msg, "danger"));
			});
		}
		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

// Delete Experience
export const deleteExperience = (id) => async (dispatch) => {
	try {
		const res = await axios.delete(`/api/profile/experience/${id}`);

		dispatch({ type: UPDATE_PROFILE, payload: res.data });

		dispatch(setAlert("Experience removed", "success"));
	} catch (err) {
		const errors = err.response.data.errors;
		if (errors) {
			errors.forEach((error) => {
				dispatch(setAlert(error.msg, "danger"));
			});
		}
		// dispatch({
		//    type: PROFILE_ERROR,
		//    payload: { msg: err.response.statusText, status: err.response.status },
		// });
	}
};

// Delete Education
export const deleteEducation = (id) => async (dispatch) => {
	try {
		const res = await axios.delete(`/api/profile/education/${id}`);

		dispatch({ type: UPDATE_PROFILE, payload: res.data });

		dispatch(setAlert("Education removed", "success"));
	} catch (err) {
		const errors = err.response.data.errors;
		if (errors) {
			errors.forEach((error) => {
				dispatch(setAlert(error.msg, "danger"));
			});
		}
		// dispatch({
		//    type: PROFILE_ERROR,
		//    payload: { msg: err.response.statusText, status: err.response.status },
		// });
	}
};

// Delete Account & profile
export const deleteAccount = (id) => async (dispatch) => {
	if (window.confirm("Are you sure ? This cannot be undone")) {
		try {
			await axios.delete(`/api/profile`);

			dispatch({ type: CLEAR_PROFILE });
			dispatch({ type: ACCOUNT_DELETED });

			dispatch(setAlert("Account deleted permanently", "success"));
		} catch (err) {
			dispatch({
				type: PROFILE_ERROR,
				payload: {
					msg: err.response.statusText,
					status: err.response.status,
				},
			});
		}
	}
};
