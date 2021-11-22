import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Register from '../auth/Register';
import Alert from '../layout/Alert';
import Login from '../auth/Login';
import Dashboard from '../dashboard/Dashboard';
import PrivateRoute from '../routing/PrivateRoute';
import CreateProfile from '../profile-forms/CreateProfile';
import EditProfile from '../profile-forms/EditProfile';
import AddExperince from '../profile-forms/AddExperince';
import AddEducation from '../profile-forms/AddEducation';
import Profiles from '../profiles/Profiles';
import Profile from '../profile/Profile';
import Posts from '../posts/Posts';
import NotFound from '../layout/NotFound';
import Panel from '../admin/Panel';
import Unauthorize from '../layout/Unauthorize';
import ProjectDisplay from '../admin/ProjectDisplay';
import TaskCreate from '../admin/TaskCreate';
import TaskUpdate from '../admin/TaskUpdate';
import UserDisplay from '../admin/UserDisplay';
import Projects from '../member/Projects';
import MemberProjectDisplay from '../member/MemberProjectDisplay';
import MemberTaskUpdate from '../member/MemberTaskUpdate';

const Routes = () => {
  return (
    <section className="container">
      <Alert />
      <Switch>
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/profiles" component={Profiles} />
        <Route exact path="/profile/:id" component={Profile} />
        <PrivateRoute
          exact
          path="/admin-panel/projects/:id"
          component={ProjectDisplay}
        />
        <PrivateRoute
          exact
          path="/admin-panel/projects/:id/tasks"
          component={TaskCreate}
        />
        <PrivateRoute
          exact
          path="/admin-panel/projects/:id/tasks/:taskid"
          component={TaskUpdate}
        />
        <PrivateRoute exact path="/admin-panel/users" component={UserDisplay} />
        <PrivateRoute exact path="/admin-panel" component={Panel} />
        <PrivateRoute exact path="/projects" component={Projects} />
        <PrivateRoute
          exact
          path="/projects/:id"
          component={MemberProjectDisplay}
        />
        <PrivateRoute
          exact
          path="/projects/:id/tasks/:taskid"
          component={MemberTaskUpdate}
        />
        <PrivateRoute exact path="/dashboard" component={Dashboard} />
        <PrivateRoute exact path="/create-profile" component={CreateProfile} />
        <PrivateRoute exact path="/edit-profile" component={EditProfile} />
        <PrivateRoute exact path="/add-experience" component={AddExperince} />
        <PrivateRoute exact path="/add-education" component={AddEducation} />
        <PrivateRoute exact path="/posts" component={Posts} />
        <PrivateRoute exact path="/unauthorize" component={Unauthorize} />
        <Route component={NotFound} />
      </Switch>
    </section>
  );
};

export default Routes;
