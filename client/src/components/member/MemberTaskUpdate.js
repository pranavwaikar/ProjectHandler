import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { clearCurrentProject } from '../../actions/admin/projects';

import { Link } from 'react-router-dom';

import {
  getUserTaskById,
  startUserTaskById,
  finishUserTaskById,
} from '../../actions/member/task';

const MemberTaskUpdate = ({
  currentTask,
  currentTaskLoading,
  getUserTaskById,
  clearCurrentProject,
  startUserTaskById,
  finishUserTaskById,
  match,
}) => {
  useEffect(() => {
    getUserTaskById(match.params.taskid);
    return () => {
      clearCurrentProject();
    };
  }, [getUserTaskById, match.params.taskid]);

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

  const [noOfHours, setNoOfHours] = useState({
    noOfHours: '',
  });

  const onChangeTask = (e) => setNoOfHours({ [e.target.name]: e.target.value });

  const onSubmitTask = async (e) => {
    e.preventDefault();
    finishUserTaskById(match.params.taskid, noOfHours);
    getUserTaskById(match.params.taskid);
  };

  const onStartTask = () => {
    startUserTaskById(match.params.taskid);
    getUserTaskById(match.params.taskid);
  };

  useEffect(() => {
    if (currentTaskLoading === false) {
      setFormData({ ...formData, project: match.params.id });
      setFormData({ ...currentTask });
    }
  }, [currentTask, currentTaskLoading, match.params.id, getUserTaskById]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    // updateAdminTaskById(match.params.taskid, formData);
  };

  if (currentTaskLoading) {
    return <Spinner />;
  }
  //   if (error.msg) {
  //     return <p> ERROR FETCHING!! -- {error.msg} -- {error.status} </p>
  //   }

  return (
    <Fragment>
      <h1 className="large text-primary">Task details</h1>
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
          <label for="status">Number of hours</label>
          <input
            type="text"
            placeholder="Number of hours"
            name="noOfHours"
            value={formData.noOfHours}
            onChange={(e) => onChange(e)}
            disabled
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
          <label for="status">Type</label>
          <input
            type="text"
            placeholder="Type"
            name="type"
            value={formData.type}
            onChange={(e) => onChange(e)}
            disabled
          />
        </div>

        <div className="form-group">
          <label for="status">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={(e) => onChange(e)}
            disabled
          />
        </div>

        <div className="form-group">
          <label for="status">End date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={(e) => onChange(e)}
            disabled
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
        {formData.status === 'NOT_STARTED' ? (
          <button className="btn btn-primary" onClick={onStartTask}>
            {' '}
            START TASK{' '}
          </button>
        ) : (
          <></>
        )}

        <Link
          className="btn btn-light my-1"
          to={`/projects/${match.params.id}`}
        >
          Go Back
        </Link>
      </form>

      {formData.status === 'STARTED' ? (
        <Fragment>
          <h1 className="large text-primary"> Finish the task </h1>
          <form className="form" onSubmit={(e) => onSubmitTask(e)}>
            <div className="form-group">
              <label for="status">Number of hours</label>
              <input
                type="number"
                placeholder="Number of hours"
                name="noOfHours"
                value={noOfHours.noOfHours}
                onChange={(e) => onChangeTask(e)}
              />
            </div>

            <input type="submit" value="End Task" className="btn btn-primary" />
          </form>
        </Fragment>
      ) : (
        <></>
      )}
    </Fragment>
  );
};

MemberTaskUpdate.propTypes = {
  currentTask: PropTypes.object.isRequired,
  currentTaskLoading: PropTypes.bool.isRequired,
  getUserTaskById: PropTypes.func.isRequired,
  clearCurrentProject: PropTypes.func.isRequired,
  startUserTaskById: PropTypes.func.isRequired,
  finishUserTaskById: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  currentTask: state.adminProjects.currentTask,
  currentTaskLoading: state.adminProjects.currentTaskLoading,
});

export default connect(mapStateToProps, {
  getUserTaskById,
  clearCurrentProject,
  startUserTaskById,
  finishUserTaskById,
})(MemberTaskUpdate);
