import {
   REGISTER_SUCCESS,
   REGISTER_FAIL,
   LOGIN_SUCCESS,
   LOGIN_FAIL,
   USER_LOADED,
   AUTH_ERROR,
   LOGOUT,
   CLEAR_PROFILE,
} from "./types";

import { REGISTRATION_SUCCESSFULL, LOGIN_SUCCESSSFULL } from "../messages";

import axios from "axios";

import { setAlert } from "./alert";

import setAuthToken from "../utils/setAuthToken";

export const loadUser = () => async (dispatch) => {
   if (localStorage.token) {
      setAuthToken(localStorage.token);
   }

   try {
      const res = await axios.get("/api/auth");

      // console.log("load user response", res.data);

      dispatch({
         type: USER_LOADED,
         payload: res.data,
      });
   } catch (error) {
      dispatch({
         type: AUTH_ERROR,
      });
   }
};

export const register = ({ name, email, password }) => async (dispatch) => {
   const config = {
      headers: {
         "Content-Type": "application/json",
      },
   };

   const body = JSON.stringify({ name, email, password });

   try {
      const res = await axios.post("/api/user", body, config);

      dispatch({
         type: REGISTER_SUCCESS,
         payload: res.data,
      });

      dispatch(loadUser());

      dispatch(setAlert(REGISTRATION_SUCCESSFULL, "success"));
   } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
         errors.forEach((error) => {
            dispatch(setAlert(error.msg, "danger"));
         });
      }
      dispatch({
         type: REGISTER_FAIL,
      });
   }
};

export const login = (email, password) => async (dispatch) => {
   const config = {
      headers: {
         "Content-Type": "application/json",
      },
   };

   const body = JSON.stringify({ email, password });

   try {
      const res = await axios.post("/api/auth", body, config);
      console.log("login response", res.data);

      dispatch({
         type: LOGIN_SUCCESS,
         payload: res.data,
      });

      dispatch(loadUser());

      dispatch(setAlert(LOGIN_SUCCESSSFULL, "success"));
   } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
         errors.forEach((error) => {
            dispatch(setAlert(error.msg, "danger"));
         });
      }
      dispatch({
         type: LOGIN_FAIL,
      });
   }
};

export const logout = () => (dispatch) => {
   dispatch({ type: CLEAR_PROFILE });
   dispatch({ type: LOGOUT });
};
