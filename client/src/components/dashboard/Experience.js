import React from "react";
import Moment from "react-moment";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { deleteExperience } from "../../actions/profile";

function Experience({ experience, deleteExperience }) {
   const experiences = experience.map((exp) => (
      <tr key={exp._id}>
         <td>{exp.company}</td>
         <td className="hide-sm">{exp.title}</td>
         <td>
            <Moment format="YYYY/MM/DD">{exp.from}</Moment> -{" "}
            {exp.to === null ? (
               " Now"
            ) : (
               <Moment format="YYYY/MM/DD">{exp.to}</Moment>
            )}
         </td>
         <td>
            <button
               className="btn btn-danger"
               style={{
                  width: "100px",
                  padding: "0.5rem",
                  marginTop: "2px",
                  textAlign: "center",
               }}
               onClick={() => deleteExperience(exp._id)}
            >
               Delete
            </button>
         </td>
      </tr>
   ));
   return (
      <>
         <h2 className="my-2">Experience Credentials</h2>
         <table className="table">
            <thead>
               <tr>
                  <th>Company</th>
                  <th className="hide-sm">Title</th>
                  <th className="hide-sm">Years</th>
                  <th />
               </tr>
            </thead>
            <tbody>{experiences}</tbody>
         </table>
      </>
   );
}
Experience.propTypes = {
   experience: PropTypes.array.isRequired,
   deleteExperience: PropTypes.func.isRequired,
};

export default connect(null, { deleteExperience })(Experience);
