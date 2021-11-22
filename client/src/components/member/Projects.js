import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Spinner from '../layout/Spinner';
import { getAllUserProjects } from '../../actions/member/projects';

const createRowEntries = (projectsData) => {
  return projectsData.map((entry, index) => {
    return (
      <tr>
        <th key={entry._id} scope="row">
          {index}
        </th>

        <td>
          {' '}
          <Link to={`/projects/${entry._id}`}> {entry.name} </Link>{' '}
        </td>
        <td> {entry.status} </td>
        <td> {entry.cost} </td>
        <td> {entry.noOfHours} </td>
        <td> {entry.users.length} </td>
      </tr>
    );
  });
};

const sortByCostAscending = (projectsData) => {
  return projectsData.slice().sort((a, b) => a.cost - b.cost);
};

const sortByCostDescending = (projectsData) => {
  return projectsData.slice().sort((a, b) => b.cost - a.cost);
};

const sortByNoOfHourAscending = (projectsData) => {
  return projectsData.slice().sort((a, b) => a.noOfHours - b.noOfHours);
};

const sortByNoOfHourDescending = (projectsData) => {
  return projectsData.slice().sort((a, b) => b.noOfHours - a.noOfHours);
};

const sortByMemberCountAscending = (projectsData) => {
  return projectsData.slice().sort((a, b) => a.users.length - b.users.length);
};

const sortByMemberCountDescending = (projectsData) => {
  return projectsData.slice().sort((a, b) => b.users.length - a.users.length);
};

const defaultState = (projectsData) => {
  console.log(projectsData.slice());
  return projectsData.slice();
};

const filterStatus = (projectsData, filterValue) => {
  return projectsData.slice().filter((a) => a.status === filterValue);
};

const Projects = ({ role, projects, loading, error, getAllUserProjects }) => {
  const [filterValue, setFilterValue] = useState('NONE');
  const [projectData, setProjectData] = useState([]);

  const onChangeFilterChange = (e) => {
    setFilterValue(e.target.value);
  };

  useEffect(() => {
    getAllUserProjects();
  }, [getAllUserProjects, projects]);

  useEffect(() => {
    if (loading === false) {
      setProjectData(projects);
    }
  }, [projects, loading]);

  useEffect(() => {
    switch (filterValue) {
      case 'NONE':
        setProjectData(defaultState(projects));
        break;
      case 'SORT_COST_DES':
        setProjectData(sortByCostDescending(projects));
        break;
      case 'SORT_COST_ASC':
        setProjectData(sortByCostAscending(projects));
        break;
      case 'STATUS_NOT_STARTED':
        setProjectData(filterStatus(projects, 'NOT_STARTED'));
        break;
      case 'STATUS_STARTED':
        setProjectData(filterStatus(projects, 'STARTED'));
        break;
      case 'STATUS_FINISHED':
        setProjectData(filterStatus(projects, 'FINISHED'));
        break;
      case 'SORT_HOURS_SPENT_DES':
        setProjectData(sortByNoOfHourDescending(projects));
        break;
      case 'SORT_HOURS_SPENT_ASC':
        setProjectData(sortByNoOfHourAscending(projects, 'MANDATORY_TASK'));
        break;
      case 'SORT_MEMBER_COUNT_DES':
        setProjectData(sortByMemberCountDescending(projects, 'NORMAL_TASK'));
        break;
      case 'SORT_MEMBER_COUNT_ASC':
        setProjectData(sortByMemberCountAscending(projects, 'NORMAL_TASK'));
        break;
      default:
        break;
    }
  }, [filterValue, projects]);

  if (loading) {
    return <Spinner />;
  }

  // if (error.msg) {
  //   return <p> ERROR FETCHING!! -- {error.msg} -- {error.status} </p>
  // }

  return (
    <Fragment>
      <h2> Projects </h2>

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
        <option value="SORT_HOURS_SPENT_DES">
          Sort by number of hours spent: High to Low
        </option>
        <option value="SORT_HOURS_SPENT_ASC">
          Sort by number of hours spent:: Low to High
        </option>
        <option value="SORT_MEMBER_COUNT_DES">
          Sort by number of members: High to Low
        </option>
        <option value="SORT_MEMBER_COUNT_ASC">
          Sort by number of members: Low to High
        </option>
      </select>

      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Status</th>
            <th scope="col">Cost</th>
            <th scope="col">Hours spent</th>
            <th scope="col">Number of members</th>
          </tr>
        </thead>
        <tbody>{createRowEntries(projectData)}</tbody>
      </table>
    </Fragment>
  );
};

Projects.propTypes = {
  role: PropTypes.string.isRequired,
  projects: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired,
  error: PropTypes.object.isRequired,
  getAllUserProjects: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  role: state.auth.role,
  projects: state.adminProjects.projects,
  loading: state.adminProjects.loading,
  error: state.adminProjects.error,
});

export default connect(mapStateToProps, {
  getAllUserProjects,
})(Projects);
