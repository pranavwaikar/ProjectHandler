import axios from 'axios';
import {
  GET_ADMIN_TASKS_LIST,
  GET_ADMIN_TASKS_LIST_ERROR,
  CREATE_NEW_TASK_ADMIN,
  CREATE_NEW_TASK_ADMIN_ERROR,
  GET_ADMIN_CURRENT_TASK,
  GET_ADMIN_CURRENT_TASK_ERROR,
  UPDATE_ADMIN_CURRENT_TASK_ERROR,
} from '../types';
import { setAlert } from '../alert';

// GET all tasks for admin
export const getAdminTasks = () => async (dispatch) => {
  try {
    const res = await axios.get(`/api/admin/tasks`);
    dispatch({
      type: GET_ADMIN_TASKS_LIST,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: GET_ADMIN_TASKS_LIST_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// GET task by id for admin
export const getAdminTaskById = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/admin/tasks/${id}`);
    dispatch({
      type: GET_ADMIN_CURRENT_TASK,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: GET_ADMIN_CURRENT_TASK_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// create new task under project
export const createNewTask = (formData) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.post(`/api/admin/tasks`, formData, config);
    dispatch({
      type: CREATE_NEW_TASK_ADMIN,
      payload: res.data,
    });

    dispatch(setAlert('Task Created!', 'success'));
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: CREATE_NEW_TASK_ADMIN_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// update task by id
export const updateAdminTaskById = (id, formData) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    await axios.put(`/api/admin/tasks/${id}`, formData, config);

    dispatch(setAlert('Task updated!', 'success'));
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: UPDATE_ADMIN_CURRENT_TASK_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};
