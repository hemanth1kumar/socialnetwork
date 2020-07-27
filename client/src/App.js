import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Navbar from "./components/layout/Navbar.component";

import Landing from "./components/layout/Landing.component";

import Register from "./components/auth/register.component";

import Login from "./components/auth/login.component";

import Dashboard from "./components/dashboard/dashboard.component";

import CreateProfile from "./components/profile-forms/CreateProfile.component";

import EditProfile from "./components/profile-forms/EditProfie";

import PrivateRoute from "./components/routing/privateRoute.component";

import { Provider } from "react-redux";

import store from "./store";

import Alert from "./components/layout/alert.component";

import { loadUser } from "./actions/auth";

import setAuthToken from "./utils/setAuthToken";
import AddExperience from "./components/profile-forms/Add-Experience";
import AddEducation from "./components/profile-forms/Add-Education";
import Profiles from "./components/profiles/Profiles";
import Profile from "./components/profile/Profile";
import Posts from "./components/posts/Posts";
import Post from "./components/post/post";

if (localStorage.token) {
	setAuthToken(localStorage.token);
}

function App() {
	useEffect(() => {
		store.dispatch(loadUser());
	}, []);

	return (
		<Provider store={store}>
			<Router>
				<Navbar />
				<Route exact path="/" component={Landing} />
				<section className="container">
					<Alert />
					<Switch>
						<Route exact path="/register" component={Register} />
						<Route exact path="/login" component={Login} />
						<Route exact path="/profiles" component={Profiles} />
						<Route exact path="/profile/:id" component={Profile} />
						<PrivateRoute exact path="/dashboard" component={Dashboard} />
						<PrivateRoute exact path="/create-profile" component={CreateProfile} />
						<PrivateRoute exact path="/edit-profile" component={EditProfile} />
						<PrivateRoute exact path="/add-experience" component={AddExperience} />
						<PrivateRoute exact path="/add-education" component={AddEducation} />
						<PrivateRoute exact path="/posts" component={Posts} />
						<PrivateRoute exact path="/posts/:id" component={Post} />
					</Switch>
				</section>
			</Router>
		</Provider>
	);
}

export default App;
