import React, { Component, useContext } from "react";
import "./App.css";
import GroupList from "./group/GroupList";
import GroupCreate from "./group/GroupCreate";
import GroupDetail from "./group/GroupDetail";
import ExpenseDetail from "./expense/ExpenseDetail";
import NewExpense from "./expense/NewExpense";
import ExpensePayment from "./expense/ExpensePayment";
import Payments from "./expense/payments";
import PayAnon from "./expense/PayAnon";
import Dashboard from "./dashboard";
import Login from "./user/Login";
import SignUp from "./user/Signup";
import Info from "./user/Info";
import {
  BrowserRouter as Router,
  Link,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { UserContext } from "./user/UserContext";

const Nav = () => {
  const { loggedIn, username, setLoggedIn, setUserName } = useContext(
    UserContext
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setUserName("");
  };

  return (
    <nav className="Nav navbar navbar-expand-md navbar-light bg-light">
      <Link className="navbar-brand" to="/">
        MoneySplit
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        {/*{% if user.is_authenticated %}*/}
        {loggedIn && (
          <ul className="navbar-nav mr-auto">
            <Link to="/">
              <li className="nav-item active">
                <div className="nav-link">Dashboard</div>
              </li>
            </Link>
            <Link to="/group">
              <li className="nav-item">
                <div className="nav-link">Groups</div>
              </li>
            </Link>
            <Link to="/expense/payments">
              <li className="nav-item">
                <div className="nav-link">Payment History</div>
              </li>
            </Link>
          </ul>
        )}

        {(!loggedIn || !username) && (
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/user/login">
                Log In
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/user/signup">
                Sign Up
              </Link>
            </li>
          </ul>
        )}
        {loggedIn && username && (
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/user/info">
                Welcome&nbsp;
                <strong>{username}</strong>
              </Link>
            </li>
            <li className="nav-item">
              <button className="btn btn-primary" onClick={handleLogout}>
                Log Out
              </button>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: localStorage.getItem("token") ? true : false,
      username: "",
    };
  }

  setLoggedIn = (loggedIn) => {
    this.setState({ loggedIn });
  };

  setUserName = (username) => {
    this.setState({ username });
  };

  componentDidMount() {
    if (this.state.loggedIn) {
      fetch("http://localhost:8080/user/current_user/", {
        method: "GET",
        headers: {
          Authorization: `JWT ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((resp) => {
          resp.username && this.setState({ username: resp.username });
        });
    }
  }

  render() {
    const App = () => (
      <div>
        <UserContext.Provider
          value={{
            loggedIn: this.state.loggedIn,
            username: this.state.username,
            setLoggedIn: this.setLoggedIn,
            setUserName: this.setUserName,
          }}
        >
          <Nav />
          <Switch>
            <Route path="/user/login" exact component={Login} />
            <Route path="/user/signup" exact component={SignUp} />
            <Route path="/expense/pay/:id" exact component={PayAnon} />
            <AuthedRoute path="/user/info" exact component={Info} />
            <AuthedRoute exact path="/" component={Dashboard} />
            <AuthedRoute path="/group" exact component={GroupList} />
            <AuthedRoute path="/group/create" exact component={GroupCreate} />
            <AuthedRoute path="/group/:id" exact component={GroupDetail} />
            <AuthedRoute path="/expense/payments" exact component={Payments} />
            <AuthedRoute path="/expense/:id" exact component={ExpenseDetail} />
            <AuthedRoute path="/expense/:id/new" exact component={NewExpense} />
            <AuthedRoute
              path="/expense/:id/pay/"
              exact
              component={ExpensePayment}
            />
          </Switch>
        </UserContext.Provider>
      </div>
    );
    return (
      <Router>
        <App />
      </Router>
    );
  }
}

class AuthedRoute extends Component {
  render() {
    const { component: Component, ...props } = this.props;
    const loggedIn = localStorage.getItem("token") ? true : false;
    return (
      <Route
        {...props}
        render={(props) =>
          loggedIn ? <Component {...props} /> : <Redirect to="/user/login" />
        }
      />
    );
  }
}

export default App;
