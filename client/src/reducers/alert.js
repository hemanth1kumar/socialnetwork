import { SET_ALERT, REMOVE_ALERT } from "../actions/types";

const initialState = [];

// Example of payload
// const payload = {
//     id:1,
//     msg:"Successfully logged in",
//     type:"success"
// }

export default (state = initialState, action) => {
   const { type, payload } = action;

   switch (type) {
      case SET_ALERT:
         let isValid = true;
         state.forEach((alert) => {
            if (alert.msg === payload.msg) isValid = false;
         });
         return isValid ? [...state, payload] : state;

      case REMOVE_ALERT:
         return state.filter((alert) => alert.id !== payload.id);
      default:
         return state;
   }
};
