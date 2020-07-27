import React, { useEffect } from "react";

import { connect } from "react-redux";

import PropTypes from "prop-types";

import { getCurrentProfile, deleteAccount } from "../../actions/profile";

import DashboardLinks from "./dashboardLinks.component";

import Experience from "./Experience";

import Spinner from "../layout/Spinner.component";

import { Link } from "react-router-dom";
import Education from "./Education";

// import { deleteAccount } from "../../actions/auth";

function Dashboard({
   auth: { user },
   profile: { profile, loading },
   getCurrentProfile,
   deleteAccount,
}) {
   useEffect(() => {
      getCurrentProfile();
   }, [getCurrentProfile]);

   return loading && profile === null ? (
      <Spinner />
   ) : (
      <>
         <h1 className="large text-primary">Dashboard</h1>
         <p className="lead">
            <i className="fa fa-user" aria-hidden="true"></i> Welcome{" "}
            {user && user.name}
         </p>
         {profile !== null ? (
            <>
               <DashboardLinks />
               <Experience experience={profile.experience} />
               <Education education={profile.education} />
               <div className="my-2">
                  <button className="btn btn-danger" onClick={deleteAccount}>
                     <i className="fa fa-user" /> Delete Account
                  </button>
               </div>
            </>
         ) : (
            <>
               <p> You have not created a profile, please add some info </p>
               <Link to="/create-profile" className="btn btn-primary my-1">
                  Create Profile
               </Link>
            </>
         )}
      </>
   );
}

Dashboard.propTypes = {
   getCurrentProfile: PropTypes.func.isRequired,
   auth: PropTypes.object.isRequired,
   profile: PropTypes.object.isRequired,
   deleteAccount: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   profile: state.profile,
   auth: state.auth,
});
export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(
   Dashboard
);
