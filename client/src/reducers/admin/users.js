import {
  GET_ADMIN_USERS_LIST,
  GET_ADMIN_USERS_LIST_ERROR,
} from '../../actions/types';

const initialState = {
  users: [],
  loading: true,
  error: {},
};

const projects = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_ADMIN_USERS_LIST:
      return {
        ...state,
        users: payload,
        loading: false,
      };
    case GET_ADMIN_USERS_LIST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return { ...state };
  }
};

export default projects;
