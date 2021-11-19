import {
  GET_ADMIN_TASKS_LIST,
  GET_ADMIN_TASKS_LIST_ERROR,
} from '../../actions/types';

const initialState = {
  tasks: [],
  loading: true,
  error: {},
};

const tasks = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_ADMIN_TASKS_LIST:
      return {
        ...state,
        tasks: payload,
        loading: false,
      };
    case GET_ADMIN_TASKS_LIST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return { ...state };
  }
};

export default tasks;
