import axios from 'axios';
import {
  GET_USER_PROJECTS_LIST,
  GET_USER_PROJECTS_LIST_ERROR,
  GET_USER_PROJECT_DETAILS,
  GET_USER_PROJECT_DETAILS_ERROR,
  GET_USER_PROJECT_TASK_LIST,
  GET_USER_PROJECT_TASK_LIST_ERROR,
} from '../types';

// GET all projects for admin
export const getAllUserProjects = () => async (dispatch) => {
  try {
    const res = await axios.get(`/api/projects`);
    dispatch({
      type: GET_USER_PROJECTS_LIST,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: GET_USER_PROJECTS_LIST_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// GET all projects for cureent user
export const getUserProjectById = (projectId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/projects/${projectId}`);
    dispatch({
      type: GET_USER_PROJECT_DETAILS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: GET_USER_PROJECT_DETAILS_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// GET all projects and task lists for current user
export const getUserTaskListProjectById = (projectId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/projects/${projectId}/tasks`);
    dispatch({
      type: GET_USER_PROJECT_TASK_LIST,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: GET_USER_PROJECT_TASK_LIST_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};
