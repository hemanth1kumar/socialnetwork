import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Navbar from "./components/layout/Navbar.component";

import Landing from "./components/layout/Landing.component";

import Register from "./components/auth/register.component";

import Login from "./components/auth/login.component";

import { Provider } from "react-redux";

import store from "./store";

import Alert from "./components/layout/alert.component";

import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";

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
               </Switch>
            </section>
         </Router>
      </Provider>
   );
}

export default App;
