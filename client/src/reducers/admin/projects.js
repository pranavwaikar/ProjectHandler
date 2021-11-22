import {
  GET_ADMIN_PROJECTS_LIST,
  GET_ADMIN_PROJECTS_LIST_ERROR,
  GET_ADMIN_PROJECT_DETAILS,
  GET_ADMIN_PROJECT_DETAILS_ERROR,
  UPDATE_ADMIN_PROJECT_DETAILS,
  UPDATE_ADMIN_PROJECT_DETAILS_ERROR,
  GET_ADMIN_PROJECT_TASKS_DETAILS,
  GET_ADMIN_PROJECT_TASKS_DETAILS_ERROR,
  CLEAR_PROJECTS,
  CLEAR_PROJECTS_ERROR,
  GET_ADMIN_CURRENT_TASK,
  GET_ADMIN_CURRENT_TASK_ERROR,
  UPDATE_ADMIN_CURRENT_TASK,
  UPDATE_ADMIN_CURRENT_TASK_ERROR,
  GET_USER_PROJECTS_LIST,
  GET_USER_PROJECTS_LIST_ERROR,
  GET_USER_PROJECT_DETAILS,
  GET_USER_PROJECT_DETAILS_ERROR,
  GET_USER_PROJECT_TASK_LIST,
  GET_USER_PROJECT_TASK_LIST_ERROR,
  GET_USER_CURRENT_TASK,
  GET_USER_CURRENT_TASK_ERROR,
  START_USER_TASK,
  START_USER_TASK_ERROR,
  FINISH_USER_TASK,
  FINISH_USER_TASK_ERROR,
} from '../../actions/types';

const initialState = {
  projects: [],
  loading: true,
  error: {},
  currentProject: {},
  currentProjectLoading: true,
  currentProjectTasks: [],
  currentProjectTasksLoading: true,
  currentTask: {},
  currentTaskLoading: true,
};

const projects = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_ADMIN_PROJECTS_LIST:
    case GET_USER_PROJECTS_LIST:
      return {
        ...state,
        projects: payload,
        loading: false,
      };
    case GET_ADMIN_PROJECTS_LIST_ERROR:
    case GET_USER_PROJECTS_LIST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case GET_ADMIN_PROJECT_DETAILS:
    case UPDATE_ADMIN_PROJECT_DETAILS:
    case GET_USER_PROJECT_DETAILS:
      return {
        ...state,
        currentProject: payload,
        currentProjectLoading: false,
      };
    case GET_ADMIN_PROJECT_DETAILS_ERROR:
    case UPDATE_ADMIN_PROJECT_DETAILS_ERROR:
    case GET_USER_PROJECT_DETAILS_ERROR:
      return {
        ...state,
        error: payload,
        currentProjectLoading: false,
      };
    case GET_ADMIN_PROJECT_TASKS_DETAILS:
    case GET_USER_PROJECT_TASK_LIST:
      return {
        ...state,
        currentProjectTasks: payload,
        currentProjectTasksLoading: false,
      };
    case GET_ADMIN_PROJECT_TASKS_DETAILS_ERROR:
    case GET_USER_PROJECT_TASK_LIST_ERROR:
      return {
        ...state,
        error: payload,
        currentProjectTasksLoading: false,
      };
    case UPDATE_ADMIN_CURRENT_TASK:
    case GET_ADMIN_CURRENT_TASK:
    case GET_USER_CURRENT_TASK:
    case START_USER_TASK:
    case FINISH_USER_TASK:
      return {
        ...state,
        currentTask: payload,
        currentTaskLoading: false,
      };
    case UPDATE_ADMIN_CURRENT_TASK_ERROR:
    case GET_ADMIN_CURRENT_TASK_ERROR:
    case GET_USER_CURRENT_TASK_ERROR:
    case START_USER_TASK_ERROR:
    case FINISH_USER_TASK_ERROR:
      return {
        ...state,
        error: payload,
        currentTaskLoading: false,
      };
    case CLEAR_PROJECTS:
    case CLEAR_PROJECTS_ERROR:
      return {
        ...state,
        ...initialState,
      };
    default:
      return { ...state };
  }
};

export default projects;
