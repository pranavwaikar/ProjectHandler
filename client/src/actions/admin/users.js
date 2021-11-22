import axios from 'axios';
import {
  GET_ADMIN_USERS_LIST,
  GET_ADMIN_USERS_LIST_ERROR,
  CREATE_NEW_USER,
  CREATE_NEW_USER_ERROR,
} from '../types';
import { setAlert } from '../alert';
// GET all projects for admin
export const getAdminAllUsersList = () => async (dispatch) => {
  try {
    const res = await axios.get(`/api/admin/users`);
    dispatch({
      type: GET_ADMIN_USERS_LIST,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: GET_ADMIN_USERS_LIST_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// create new user
export const createNewUser = (formData) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.post(`/api/admin/users`, formData, config);
    dispatch({
      type: CREATE_NEW_USER,
      payload: res.data,
    });

    dispatch(setAlert('User Created!', 'success'));
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: CREATE_NEW_USER_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};
