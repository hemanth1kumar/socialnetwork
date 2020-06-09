import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Navbar from "./components/layout/Navbar.component";

import Landing from "./components/layout/Landing.component";

import Register from "./components/auth/register.component";
import Login from "./components/auth/login.component";

function App() {
   return (
      <Router>
         <Navbar />
         <Route exact path="/" component={Landing} />
         <section className="container">
            <Switch>
               <Route exact path="/register" component={Register} />
               <Route exact path="/login" component={Login} />
            </Switch>
         </section>
      </Router>
   );
}

export default App;
