/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteAccount, getCurrentProfile } from '../../actions/profile';
import Spinner from '../layout/Spinner';
import { Link } from 'react-router-dom';

const Dashboard = ({
  getCurrentProfile,
  deleteAccount,
  auth: { user, role },
  profile: { profile, loading },
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user" /> Welcome {user && user.name}
      </p>
      {role === 'admin' ? (
        <Fragment>
          <p> You have Admin priviledges </p>
          <Link to="admin-panel" className="btn btn-primary my-1">
            Admin Panel - Projects
          </Link>
          <Link to="admin-panel/users" className="btn btn-primary my-1">
            Admin Panel - Users
          </Link>
        </Fragment>
      ) : (
        <Fragment>
          <p> You have member priviledges </p>
          <Link to="projects" className="btn btn-primary my-1">
            Projects view
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(
  Dashboard
);
