import React from 'react';
import './App.css';
import Dashboard from './components/Dashboard'
import Header from './components/Layout/Header'
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import AddProject from './components/Project/AddProject';
import {Provider} from 'react-redux';
import store from './store'
import UpdateProject from './components/Project/UpdateProject';
import ProjectBoard from './components/ProjectBoard/ProjectBoard';
import AddProjectTask from './components/ProjectBoard/ProjectTasks/AddProjectTask';
import UpdateProjectTask from './components/ProjectBoard/ProjectTasks/UpdateProjectTask'
import Landing from './components/Layout/Landing';
import Register from './components/UserManagement/Register';
import Login from './components/UserManagement/Login';
import jwt_decode from 'jwt-decode';
import setJWTToken from "./SecurityUtils/setJwtToken";
import { SET_CURRENT_USER } from "./actions/types";
import {logout} from "./actions/SecurityAction";
import SecuredRoutes from "./SecurityUtils/SecureRoutes" 


// to avoid logging in for every reload page. the token is still in localstorage but not in the header as it has not extracted
const jwtToken = localStorage.jwtToken;

if(jwtToken){
  setJWTToken(jwtToken);
  const decoded_jwtToken = jwt_decode(jwtToken);
  store.dispatch({
    type: SET_CURRENT_USER,
    payload: decoded_jwtToken
  });

  const currentTime = Date.now() / 1000;
  if(decoded_jwtToken.exp < currentTime){
    store.dispatch(logout());
    window.location.href="/"
  }
}

function App() {
  return (
    <Provider store={store}>
    <Router>
    <div className="App">
    <Header/>
    {
      // public routes
    }
    <Route exact path="/" component={Landing}/>
    <Route exact path="/register" component={Register}/>
    <Route exact path="/login" component={Login}/>

    {
      //Private routes
    }

    <Switch>
      <SecuredRoutes exact path="/dashboard" component={Dashboard}/>
      <SecuredRoutes exact path="/addProject" component={AddProject}/>
      <SecuredRoutes exact path="/updateProject/:id" component={UpdateProject}/>
      <SecuredRoutes exact path="/projectBoard/:id" component={ProjectBoard}/>
      <SecuredRoutes exact path="/addProjectTask/:id" component={AddProjectTask}/>
      <SecuredRoutes exact path="/updateProjectTask/:backlog_id/:pt_id" component={UpdateProjectTask}/>
    </Switch>
    </div>
    </Router>
    </Provider>
  );
}

export default App;
