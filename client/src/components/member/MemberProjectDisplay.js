import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { clearCurrentProject } from '../../actions/admin/projects';
import { Link } from 'react-router-dom';

import {
  getUserProjectById,
  getUserTaskListProjectById,
} from '../../actions/member/projects';

const createRowEntries = (projectsData) => {
  return projectsData.map((entry, index) => {
    return (
      <tr>
        <td key={entry._id} scope="row">
          {index}
        </td>
        <td>
          {' '}
          <Link to={`/projects/${entry.project.toString()}/tasks/${entry._id}`}>
            {' '}
            {entry.name}{' '}
          </Link>{' '}
        </td>
        <td> {entry.status} </td>
        <td> {entry.type} </td>
        <td> {entry.cost} </td>
        <td> {entry.noOfHours} </td>
        <td> {entry.hourlyRate} </td>
        <td> {entry.startDate} </td>
        <td> {entry.endDate} </td>
      </tr>
    );
  });
};

const sortByCostAscending = (projectsData) => {
  console.log(projectsData.sort((a, b) => a.cost - b.cost).slice());
  return projectsData.slice().sort((a, b) => a.cost - b.cost);
};

const sortByCostDescending = (projectsData) => {
  console.log(projectsData.sort((a, b) => b.cost - a.cost).slice());
  return projectsData.slice().sort((a, b) => b.cost - a.cost);
};

const defaultState = (projectsData) => {
  console.log(projectsData.slice());
  return projectsData.slice();
};

const filterStatus = (projectsData, filterValue) => {
  return projectsData.slice().filter((a) => a.status === filterValue);
};

const filterDelayed = (projectsData) => {
  return projectsData.slice().filter((entry) => {
    return new Date(entry.endDate) < new Date();
  });
};

const filterType = (projectsData, type) => {
  return projectsData.slice().filter((a) => a.type === type);
};

const MemberProjectDisplay = ({
  role,
  currentProject,
  currentProjectLoading,
  currentProjectTasks,
  currentProjectTasksLoading,
  error,
  users,
  usersLoading,
  getUserProjectById,
  getUserTaskListProjectById,
  clearCurrentProject,
  match,
}) => {
  useEffect(() => {
    getUserProjectById(match.params.id);
    getUserTaskListProjectById(match.params.id);
    return () => {
      clearCurrentProject();
    };
  }, [getUserProjectById, getUserTaskListProjectById, match.params.id]);

  const [formData, setFormData] = useState({
    noOfHours: '',
    cost: '',
    _id: '',
    name: '',
    status: '',
    description: '',
    users: [],
    date: '',
  });

  const [taskData, setTaskData] = useState([]);
  const [filterValue, setFilterValue] = useState('NONE');

  const onChangeFilterChange = (e) => {
    setFilterValue(e.target.value);
  };

  useEffect(() => {
    switch (filterValue) {
      case 'NONE':
        setTaskData(defaultState(currentProjectTasks));
        break;
      case 'SORT_COST_DES':
        setTaskData(sortByCostDescending(currentProjectTasks));
        break;
      case 'SORT_COST_ASC':
        setTaskData(sortByCostAscending(currentProjectTasks));
        break;
      case 'STATUS_NOT_STARTED':
        setTaskData(filterStatus(currentProjectTasks, 'NOT_STARTED'));
        break;
      case 'STATUS_STARTED':
        setTaskData(filterStatus(currentProjectTasks, 'STARTED'));
        break;
      case 'STATUS_FINISHED':
        setTaskData(filterStatus(currentProjectTasks, 'FINISHED'));
        break;
      case 'DELAYED':
        setTaskData(filterDelayed(currentProjectTasks));
        break;
      case 'TYPE_MANDATORY':
        setTaskData(filterType(currentProjectTasks, 'MANDATORY_TASK'));
        break;
      case 'TYPE_NORMAL':
        setTaskData(filterType(currentProjectTasks, 'NORMAL_TASK'));
        break;
      default:
        break;
    }
  }, [filterValue, currentProjectTasks]);

  useEffect(() => {
    if (currentProject._id) {
      setFormData(currentProject);
    }
  }, [currentProject]);

  useEffect(() => {
    if (currentProjectTasksLoading === false) {
      if (currentProjectTasks.length > 0) {
        setTaskData(currentProjectTasks);
      }
    }
  }, [currentProjectTasks, currentProjectTasksLoading]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
  };

  if (currentProjectLoading && currentProjectTasksLoading && usersLoading) {
    return <Spinner />;
  }
  //   if (error.msg) {
  //     return <p> ERROR FETCHING!! -- {error.msg} -- {error.status} </p>
  //   }

  return (
    <Fragment>
      <h1 className="large text-primary">Project Details</h1>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <label for="name">Name</label>
          <input
            type="text"
            placeholder="Project Name"
            name="name"
            value={formData.name}
            onChange={(e) => onChange(e)}
            disabled
          />
        </div>
        <div className="form-group">
          <label for="description">Description</label>
          <input
            type="text"
            placeholder="Description"
            name="description"
            value={formData.description}
            onChange={(e) => onChange(e)}
            disabled
          />
        </div>
        <div className="form-group">
          <label for="status">Status</label>
          <input
            type="text"
            placeholder="Status"
            name="status"
            value={formData.status}
            onChange={(e) => onChange(e)}
            disabled
          />
        </div>
        <div className="form-group">
          <label for="date">Creation Date</label>
          <input
            type="text"
            placeholder="Date"
            name="date"
            value={new Date(Date.parse(formData.date)).toString()}
            onChange={(e) => onChange(e)}
            disabled
          />
        </div>
        <div className="form-group">
          <label for="cost">Cost</label>
          <input
            type="text"
            placeholder="Cost"
            name="cost"
            value={formData.cost}
            onChange={(e) => onChange(e)}
            disabled
          />
        </div>
        <div className="form-group">
          <label for="noOfHours">Number of hours</label>
          <input
            type="text"
            placeholder="Number of hours"
            name="noOfHours"
            value={formData.noOfHours}
            onChange={(e) => onChange(e)}
            disabled
          />
        </div>

        <Link className="btn btn-light my-1" to="/projects">
          Go Back
        </Link>
      </form>

      <h2> Tasks </h2>

      <select
        class="form-select"
        value={filterValue}
        onChange={(e) => onChangeFilterChange(e)}
      >
        <option value="NONE">Filters</option>
        <option value="SORT_COST_DES">Sort by cost: High to Low</option>
        <option value="SORT_COST_ASC">Sort by cost: Low to High</option>
        <option value="STATUS_NOT_STARTED">Status: Not started</option>
        <option value="STATUS_STARTED">Status: Started</option>
        <option value="STATUS_FINISHED">Status: Finished</option>
        <option value="TYPE_MANDATORY">Type: Mandatory</option>
        <option value="TYPE_NORMAL">Type: Normal</option>
        <option value="DELAYED">Running late</option>
      </select>

      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Status</th>
            <th scope="col">type</th>
            <th scope="col">Cost</th>
            <th scope="col">Hours spent</th>
            <th scope="col">Hourly Rate</th>
            <th scope="col">Start Date</th>
            <th scope="col">End Date</th>
          </tr>
        </thead>
        <tbody>{createRowEntries(taskData)}</tbody>
      </table>
    </Fragment>
  );
};

MemberProjectDisplay.propTypes = {
  role: PropTypes.string.isRequired,
  currentProject: PropTypes.object.isRequired,
  currentProjectLoading: PropTypes.bool.isRequired,
  currentProjectTasks: PropTypes.array.isRequired,
  currentProjectTasksLoading: PropTypes.bool.isRequired,
  error: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired,
  usersLoading: PropTypes.bool.isRequired,
  getUserProjectById: PropTypes.func.isRequired,
  getUserTaskListProjectById: PropTypes.func.isRequired,
  clearCurrentProject: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  role: state.auth.role,
  currentProject: state.adminProjects.currentProject,
  currentProjectLoading: state.adminProjects.currentProjectLoading,
  currentProjectTasks: state.adminProjects.currentProjectTasks,
  currentProjectTasksLoading: state.adminProjects.currentProjectTasksLoading,
  error: state.adminProjects.error,
  users: state.adminUsers.users,
  usersLoading: state.adminUsers.loading,
});

export default connect(mapStateToProps, {
  getUserProjectById,
  getUserTaskListProjectById,
  clearCurrentProject,
})(MemberProjectDisplay);
