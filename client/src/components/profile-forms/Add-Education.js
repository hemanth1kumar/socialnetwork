import React, { useState } from "react";

import { connect } from "react-redux";

import { addEducation } from "../../actions/profile";

import { Link, withRouter } from "react-router-dom";

import PropTypes from "prop-types";

function AddEducation({ addEducation, history }) {
   const [formData, setFormData] = useState({
      school: "",
      degree: "",
      fieldofstudy: "",
      from: "",
      to: "",
      current: false,
      description: "",
   });

   const {
      school,
      degree,
      fieldofstudy,
      to,
      from,
      current,
      description,
   } = formData;

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      addEducation(formData, history);
   };

   return (
      <>
         <h1 className="large text-primary">Add Any Education</h1>
         <p className="lead">
            <i className="fas fa-code-branch"></i> Add any school or bootcamp
            that you have attended
         </p>
         <small>* = required field</small>
         <form className="form" onSubmit={(e) => handleSubmit(e)}>
            <div className="form-group">
               <h4>School or bootcamp</h4>
               <input
                  type="text"
                  placeholder="* School or Bootcamp"
                  name="school"
                  value={school}
                  onChange={handleChange}
                  required
               />
            </div>
            <div className="form-group">
               <h4>Degree</h4>
               <input
                  type="text"
                  placeholder="* Degree or Certificate"
                  name="degree"
                  value={degree}
                  onChange={handleChange}
                  required
               />
            </div>
            <div className="form-group">
               <h4>Field of Study</h4>
               <input
                  type="text"
                  placeholder="Field Of Study"
                  name="fieldofstudy"
                  value={fieldofstudy}
                  onChange={handleChange}
               />
            </div>
            <div className="form-group">
               <h4>From Date</h4>
               <input
                  type="date"
                  name="from"
                  value={from}
                  onChange={handleChange}
               />
            </div>
            <div className="form-group">
               <p>
                  <input
                     type="checkbox"
                     name="current"
                     value=""
                     checked={current}
                     value={current}
                     onChange={() =>
                        setFormData({ ...formData, current: !current })
                     }
                  />{" "}
                  Current School or Bootcamp
               </p>
            </div>
            <div className="form-group">
               <h4>To Date</h4>
               <input
                  type="date"
                  name="to"
                  value={to}
                  onChange={handleChange}
                  disabled={current ? true : null}
               />
            </div>
            <div className="form-group">
               <textarea
                  name="description"
                  cols="30"
                  rows="5"
                  placeholder="Program Description"
                  value={description}
                  onChange={handleChange}
               ></textarea>
            </div>

            <input type="submit" className="btn btn-primary my-1" />
            <Link className="btn btn-light my-1" to="/dashboard">
               Go Back
            </Link>
         </form>
      </>
   );
}
AddEducation.propTypes = {
   addEducation: PropTypes.func.isRequired,
};

export default withRouter(connect(null, { addEducation })(AddEducation));
