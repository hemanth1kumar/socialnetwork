import React from "react";
import Moment from "react-moment";
import PropTypes from "prop-types";

const ProfileEducation = ({
   education: { school, degree, fieldofstudy, current, to, from, description },
}) => {
   return (
      <div>
         <h3 className="text-dark">{school}</h3>
         <p>
            {" "}
            <Moment format="YYYY/MM/DD">{from}</Moment> -
            {to ? <Moment format="YYYY/MM/DD">{to}</Moment> : " Now"}{" "}
         </p>
         <p>
            <strong>Position: </strong> {degree}
         </p>
         <p>
            <strong>Description: </strong> {fieldofstudy}
         </p>
      </div>
   );
};
ProfileEducation.propTypes = {
   education: PropTypes.array.isRequired,
};

export default ProfileEducation;
