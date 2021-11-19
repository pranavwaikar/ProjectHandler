import axios from 'axios';
import { GET_ADMIN_USERS_LIST, GET_ADMIN_USERS_LIST_ERROR } from '../types';

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
