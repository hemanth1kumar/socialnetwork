import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getProfiles } from "../../actions/profile";
import Spinner from "../layout/Spinner.component";
import ProfileItem from "./ProfileItem";

const Profiles = ({ getProfiles, profile: { profiles, loading } }) => {
   useEffect(() => {
      getProfiles();
   }, [getProfiles]);

   return (
      <>
         {loading ? (
            <Spinner />
         ) : (
            <>
               <h1 className="large text-primary">Developers</h1>
               <p className="lead">
                  <i className="fa fa-connectdevelop" /> Browse and Connect with
                  Developers
               </p>
               <div className="profiles">
                  {profiles.length > 0 ? (
                     profiles.map((profile) => (
                        <ProfileItem key={profile._id} profile={profile} />
                     ))
                  ) : (
                     <h4>No Profile Found</h4>
                  )}
               </div>
            </>
         )}
      </>
   );
};

Profiles.propTypes = {
   getProfiles: PropTypes.func.isRequired,
   profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
   profile: state.profile,
});
export default connect(mapStateToProps, { getProfiles })(Profiles);
