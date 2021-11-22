import axios from 'axios';
import {
  GET_USER_CURRENT_TASK,
  GET_USER_CURRENT_TASK_ERROR,
  START_USER_TASK,
  START_USER_TASK_ERROR,
  FINISH_USER_TASK,
  FINISH_USER_TASK_ERROR,
} from '../types';
import { setAlert } from '../alert';

// GET task by id for admin
export const getUserTaskById = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/tasks/${id}`);
    dispatch({
      type: GET_USER_CURRENT_TASK,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: GET_USER_CURRENT_TASK_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// Start task by id
export const startUserTaskById = (id) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.put(`/api/tasks/${id}/start`, {}, config);
    dispatch({
      type: START_USER_TASK,
      payload: res.data,
    });

    dispatch(setAlert('Task Started!', 'success'));
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: START_USER_TASK_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// End task by id
export const finishUserTaskById = (id, formData) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.put(`/api/tasks/${id}/finish`, formData, config);
    dispatch({
      type: FINISH_USER_TASK,
      payload: res.data,
    });

    dispatch(setAlert('Task Finished!', 'success'));
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: FINISH_USER_TASK_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};
