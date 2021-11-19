import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import {
  getAdminProjectById,
  clearCurrentProject,
} from '../../actions/admin/projects';

import { Link, Redirect } from 'react-router-dom';
import { getAdminAllUsersList } from '../../actions/admin/users';
import Select from 'react-select';
import {
  updateAdminTaskById,
  getAdminTaskById,
} from '../../actions/admin/tasks';

const TaskUpdate = ({
  role,
  currentProject,
  currentProjectLoading,
  currentTask,
  currentTaskLoading,
  error,
  users,
  usersLoading,
  getAdminProjectById,
  getAdminAllUsersList,
  clearCurrentProject,
  updateAdminTaskById,
  getAdminTaskById,
  match,
}) => {
  useEffect(() => {
    getAdminProjectById(match.params.id);
    getAdminAllUsersList();
    getAdminTaskById(match.params.taskid);
    return () => {
      clearCurrentProject();
    };
  }, [
    getAdminProjectById,
    getAdminAllUsersList,
    getAdminTaskById,
    updateAdminTaskById,
    match.params.id,
    match.params.taskid,
  ]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: '',
    type: '',
    hourlyRate: '',
    noOfHours: '',
    cost: '',
    _id: '',
    user: '',
    project: '',
    startDate: '',
    endDate: '',
  });

  const [projectUserData, setProjectUserData] = useState([]);
  const [dropdownValue, setDropdownValue] = useState({ value: '', label: '' });
  const [dropdownValueTaskType, setDropdownValueTaskType] = useState({
    value: '',
    label: '',
  });
  const [dropdownValueProject, setDropdownValueProject] = useState({
    value: '',
    label: '',
  });

  const taskTypeOptions = [
    { value: 'MANDATORY_TASK', label: 'Mandatory task' },
    { value: 'NORMAL_TASK', label: 'Normal task' },
  ];

  useEffect(() => {
    if (
      usersLoading === false &&
      currentProjectLoading === false &&
      currentTaskLoading === false
    ) {
      if (users.length > 0) {
        const userIds = currentProject.users.map((entry) =>
          entry.user.toString()
        );
        const projectUsers = users.filter((entry) =>
          userIds.includes(entry._id)
        );
        const labelMapping = projectUsers.map((entry) => {
          return {
            label: entry.name,
            value: entry._id,
          };
        });
        setProjectUserData(labelMapping);
        setDropdownValue({
          value: currentTask.user.toString(),
          label: users.find(
            (entry) => entry._id === currentTask.user.toString()
          ).name,
        });
      }
      setDropdownValueProject({
        value: match.params.id,
        label: currentProject.name,
      });
      setDropdownValueTaskType({
        value: currentTask.type,
        label:
          currentTask.type === 'MANDATORY_TASK'
            ? 'Mandatory task'
            : 'Normal task',
      });
      setFormData({ ...formData, project: match.params.id });
      setFormData({ ...currentTask });
    }
  }, [
    users,
    currentProject,
    currentTask,
    currentProjectLoading,
    currentTaskLoading,
    match.params.id,
    usersLoading,
  ]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    updateAdminTaskById(match.params.taskid, formData);
  };

  const onDropdownChange = (e) => {
    setDropdownValue({ ...e });
    setFormData({ ...formData, user: e.value });
  };

  const onDropdownChangeTaskType = (e) => {
    setDropdownValueTaskType({ ...e });
    setFormData({ ...formData, type: e.value });
  };

  if (role !== 'admin') {
    return <Redirect to="/unauthorize" />;
  }

  if (currentProjectLoading && usersLoading) {
    return <Spinner />;
  }
  //   if (error.msg) {
  //     return <p> ERROR FETCHING!! -- {error.msg} -- {error.status} </p>
  //   }

  return (
    <Fragment>
      <h1 className="large text-primary">Create new task</h1>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <label for="name">Name</label>
          <input
            type="text"
            placeholder="Task Name"
            name="name"
            value={formData.name}
            onChange={(e) => onChange(e)}
            required
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
            required
          />
        </div>
        <div className="form-group">
          <label for="status">Hourly rate</label>
          <input
            type="text"
            placeholder="hourlyRate"
            name="hourlyRate"
            value={formData.hourlyRate}
            onChange={(e) => onChange(e)}
            disabled={formData.status === 'FINISHED' ? true : false}
          />
        </div>
        <div className="form-group">
          <label for="status">Number of hours</label>
          <input
            type="text"
            placeholder="Number of hours"
            name="hourlyRate"
            value={formData.noOfHours}
            onChange={(e) => onChange(e)}
            disabled
          />
        </div>
        <div className="form-group">
          <label for="status">Cost</label>
          <input
            type="text"
            placeholder="cost"
            name="cost"
            value={formData.cost}
            onChange={(e) => onChange(e)}
            disabled
          />
        </div>
        <div className="form-group">
          <label for="status">Status</label>
          <input
            type="text"
            placeholder="status"
            name="status"
            value={formData.status}
            onChange={(e) => onChange(e)}
            disabled
          />
        </div>

        <div className="form-group">
          <label for="task type">Task type</label>
          <Select
            options={taskTypeOptions}
            onChange={(e) => onDropdownChangeTaskType(e)}
            value={dropdownValueTaskType}
          />
        </div>

        <div className="form-group">
          <label for="status">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={(e) => onChange(e)}
          />
        </div>

        <div className="form-group">
          <label for="status">End date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={(e) => onChange(e)}
          />
        </div>

        <div className="form-group">
          <label for="assignee">Project</label>
          <Select options={dropdownValueProject} value={dropdownValueProject} />
        </div>

        <div className="form-group">
          <label for="assignee">Assign to</label>
          <Select
            options={projectUserData}
            onChange={(e) => onDropdownChange(e)}
            value={dropdownValue}
          />
        </div>

        <div className="form-group">
          <label for="status">Actual start date</label>
          <input
            type="text"
            placeholder="Actual start date"
            name="status"
            value={formData.actualStartDate}
            onChange={(e) => onChange(e)}
            disabled
          />
        </div>

        <div className="form-group">
          <label for="status">Actual end date</label>
          <input
            type="text"
            placeholder="Actual end date"
            name="status"
            value={formData.actualEndDate}
            onChange={(e) => onChange(e)}
            disabled
          />
        </div>

        <input type="submit" value="Update Task" className="btn btn-primary" />
        <Link
          className="btn btn-light my-1"
          to={`/admin-panel/projects/${match.params.id}`}
        >
          Go Back
        </Link>
      </form>
    </Fragment>
  );
};

TaskUpdate.propTypes = {
  role: PropTypes.string.isRequired,
  currentProject: PropTypes.object.isRequired,
  currentProjectLoading: PropTypes.bool.isRequired,
  currentTask: PropTypes.object.isRequired,
  currentTaskLoading: PropTypes.bool.isRequired,
  error: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired,
  usersLoading: PropTypes.bool.isRequired,
  getAdminProjectById: PropTypes.func.isRequired,
  getAdminAllUsersList: PropTypes.func.isRequired,
  updateAdminTaskById: PropTypes.func.isRequired,
  getAdminTaskById: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  role: state.auth.role,
  currentProject: state.adminProjects.currentProject,
  currentProjectLoading: state.adminProjects.currentProjectLoading,
  currentTask: state.adminProjects.currentTask,
  currentTaskLoading: state.adminProjects.currentTaskLoading,
  error: state.adminProjects.error,
  users: state.adminUsers.users,
  usersLoading: state.adminUsers.loading,
});

export default connect(mapStateToProps, {
  getAdminProjectById,
  getAdminAllUsersList,
  clearCurrentProject,
  updateAdminTaskById,
  getAdminTaskById,
})(TaskUpdate);
