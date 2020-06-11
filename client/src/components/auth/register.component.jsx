import React, { useState } from "react";

import { Link, Redirect } from "react-router-dom";

import { connect } from "react-redux";

import { setAlert } from "../../actions/alert";

import { register } from "../../actions/auth";

import { PASSWORD_MISMATCH } from "../../messages";

import PropTypes from "prop-types";

function Register({ setAlert, register, isAuthenticated }) {
   const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
      password2: "",
   });

   const { name, email, password, password2 } = formData;

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
   };

   const onSubmit = async (e) => {
      e.preventDefault();

      if (password !== password2) {
         setAlert(PASSWORD_MISMATCH, "danger");
      } else {
         register({ name, email, password });
      }
   };

   if (isAuthenticated) {
      return <Redirect to="/dashboard" />;
   }

   return (
      <>
         <section className="container">
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead">
               <i className="fas fa-user"></i> Create Your Account
            </p>
            <form className="form" onSubmit={(e) => onSubmit(e)}>
               <div className="form-group">
                  <input
                     type="text"
                     placeholder="Name"
                     name="name"
                     value={name}
                     onChange={handleChange}
                     required
                  />
               </div>
               <div className="form-group">
                  <input
                     type="email"
                     placeholder="Email Address"
                     name="email"
                     value={email}
                     onChange={handleChange}
                  />
                  <small className="form-text">
                     This site uses Gravatar so if you want a profile image, use
                     a Gravatar email
                  </small>
               </div>
               <div className="form-group">
                  <input
                     type="password"
                     placeholder="Password"
                     name="password"
                     minLength="6"
                     value={password}
                     onChange={handleChange}
                  />
               </div>
               <div className="form-group">
                  <input
                     type="password"
                     placeholder="Confirm Password"
                     name="password2"
                     minLength="6"
                     value={password2}
                     onChange={handleChange}
                  />
               </div>
               <input
                  type="submit"
                  className="btn btn-primary"
                  value="Register"
               />
            </form>
            <p className="my-1">
               Already have an account? <Link to="/login">Sign In</Link>
            </p>
         </section>
      </>
   );
}

Register.propTypes = {
   setAlert: PropTypes.func.isRequired,
   register: PropTypes.func.isRequired,
   isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
   isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { setAlert, register })(Register);
