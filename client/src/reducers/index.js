import { combineReducers } from 'redux';

import alert from './alert';
import auth from './auth';
import profile from './profile';
import post from './post';
import adminProjects from './admin/projects';
import adminTasks from './admin/tasks';
import adminUsers from './admin/users';

export default combineReducers({
  alert,
  auth,
  profile,
  post,
  adminProjects,
  adminTasks,
  adminUsers,
});
