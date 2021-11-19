import axios from 'axios';
import {
  GET_ADMIN_PROJECTS_LIST,
  GET_ADMIN_PROJECTS_LIST_ERROR,
  GET_ADMIN_PROJECT_DETAILS,
  GET_ADMIN_PROJECT_DETAILS_ERROR,
  GET_ADMIN_PROJECT_TASKS_DETAILS,
  GET_ADMIN_PROJECT_TASKS_DETAILS_ERROR,
  UPDATE_ADMIN_PROJECT_DETAILS,
  UPDATE_ADMIN_PROJECT_DETAILS_ERROR,
  CLEAR_PROJECTS,
  CLEAR_PROJECTS_ERROR,
  CREATE_NEW_PROJECT_ADMIN,
  CREATE_NEW_PROJECT_ADMIN_ERROR,
} from '../types';
import { setAlert } from '../alert';

// GET all projects for admin
export const getAdminProjects = () => async (dispatch) => {
  try {
    const res = await axios.get(`/api/admin/projects`);
    dispatch({
      type: GET_ADMIN_PROJECTS_LIST,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: GET_ADMIN_PROJECTS_LIST_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// GET all projects for admin
export const getAdminProjectById = (projectId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/admin/projects/${projectId}`);
    dispatch({
      type: GET_ADMIN_PROJECT_DETAILS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: GET_ADMIN_PROJECT_DETAILS_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// update project by id
export const updateAdminProjectById = (formData) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.put(
      `/api/admin/projects/${formData._id}`,
      formData,
      config
    );
    dispatch({
      type: UPDATE_ADMIN_PROJECT_DETAILS,
      payload: res.data,
    });

    dispatch(setAlert('Project updated!', 'success'));
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: UPDATE_ADMIN_PROJECT_DETAILS_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// GET all project' tasksfor admin
export const getAdminTaskListProjectById = (projectId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/admin/projects/${projectId}/tasks`);
    dispatch({
      type: GET_ADMIN_PROJECT_TASKS_DETAILS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: GET_ADMIN_PROJECT_TASKS_DETAILS_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// assign user to a project
export const assignUserToProjectByID =
  (projectId, userId) => async (dispatch) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const res = await axios.put(
        `/api/admin/projects/${projectId}/assign/${userId}`,
        {},
        config
      );
      dispatch({
        type: UPDATE_ADMIN_PROJECT_DETAILS,
        payload: res.data,
      });

      dispatch(setAlert('User Added!', 'success'));
    } catch (error) {
      const errors = error.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }

      dispatch({
        type: UPDATE_ADMIN_PROJECT_DETAILS_ERROR,
        payload: {
          msg: error.response.statusText,
          status: error.response.status,
        },
      });
    }
  };

// clear current projects details
export const clearCurrentProject = () => async (dispatch) => {
  try {
    dispatch({
      type: CLEAR_PROJECTS,
      payload: {},
    });
  } catch (error) {
    dispatch({
      type: CLEAR_PROJECTS_ERROR,
      payload: {
        msg: error,
        status: error,
      },
    });
  }
};

// create new project
export const createNewProject = (formData) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.post(`/api/admin/projects`, formData, config);
    dispatch({
      type: CREATE_NEW_PROJECT_ADMIN,
      payload: res.data,
    });

    dispatch(setAlert('Project Created!', 'success'));
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: CREATE_NEW_PROJECT_ADMIN_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};
