import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import Spinner from '../layout/Spinner';
import Select from 'react-select';
import { getAdminAllUsersList, createNewUser } from '../../actions/admin/users';

const createRowEntries = (projectsData) => {
  return projectsData.map((entry, index) => {
    return (
      <tr>
        <th key={entry._id} scope="row">
          {index}
        </th>

        <td>{entry.name}</td>
        <td> {entry.email} </td>
        <td> {entry.role} </td>
        <td> {entry.position} </td>
      </tr>
    );
  });
};

const defaultState = (projectsData) => {
  console.log(projectsData.slice());
  return projectsData.slice();
};

const filterStatus = (projectsData, filterValue) => {
  return projectsData.slice().filter((a) => a.role === filterValue);
};

const UserDisplay = ({
  role,
  users,
  loading,
  error,
  getAdminAllUsersList,
  createNewUser,
}) => {
  const [filterValue, setFilterValue] = useState('NONE');
  const [projectData, setProjectData] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    position: '',
  });

  const taskTypeOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'member', label: 'Member' },
  ];
  const [dropdownValue, setDropdownValue] = useState({ value: '', label: '' });

  const onDropdownChange = (e) => {
    setDropdownValue({ ...e });
    setFormData({ ...formData, role: e.value });
  };

  const onChangeFilterChange = (e) => {
    setFilterValue(e.target.value);
  };

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    createNewUser(formData);
    getAdminAllUsersList();
  };

  useEffect(() => {
    getAdminAllUsersList();
  }, [getAdminAllUsersList, users]);

  useEffect(() => {
    if (loading === false) {
      setProjectData(users);
    }
  }, [users, loading]);

  useEffect(() => {
    switch (filterValue) {
      case 'NONE':
        setProjectData(defaultState(users));
        break;
      case 'ADMIN_USER':
        setProjectData(filterStatus(users, 'admin'));
        break;
      case 'MEMBER_USER':
        setProjectData(filterStatus(users, 'member'));
        break;
      default:
        break;
    }
  }, [filterValue, users]);

  if (role !== 'admin') {
    return <Redirect to="/unauthorize" />;
  }

  if (loading) {
    return <Spinner />;
  }

  // if (error.msg) {
  //   return <p> ERROR FETCHING!! -- {error.msg} -- {error.status} </p>
  // }

  return (
    <Fragment>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <label for="name">Name</label>
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={formData.name}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <label for="name">Email</label>
          <input
            type="text"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <label for="description">Password</label>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <label for="description">Position</label>
          <input
            type="text"
            placeholder="Position"
            name="position"
            value={formData.position}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <label for="task type">User type</label>
          <Select
            options={taskTypeOptions}
            onChange={(e) => onDropdownChange(e)}
            value={dropdownValue}
          />
        </div>

        <input
          type="submit"
          value="Create Project"
          className="btn btn-primary"
        />
        <Link to="/dashboard" className="btn btn-primary my-1">
          Go back
        </Link>
      </form>
      <h2> Users </h2>

      <select
        class="form-select"
        value={filterValue}
        onChange={(e) => onChangeFilterChange(e)}
      >
        <option value="NONE">Filters</option>
        <option value="ADMIN_USER">Sort by role: Admin</option>
        <option value="MEMBER_USER">Sort by role: Members</option>
      </select>

      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Role</th>
            <th scope="col">Position</th>
          </tr>
        </thead>
        <tbody>{createRowEntries(projectData)}</tbody>
      </table>
    </Fragment>
  );
};

UserDisplay.propTypes = {
  role: PropTypes.string.isRequired,
  users: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object.isRequired,
  getAdminAllUsersList: PropTypes.func.isRequired,
  createNewUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  role: state.auth.role,
  users: state.adminUsers.users,
  loading: state.adminUsers.loading,
  error: state.adminUsers.error,
});

export default connect(mapStateToProps, {
  getAdminAllUsersList,
  createNewUser,
})(UserDisplay);
