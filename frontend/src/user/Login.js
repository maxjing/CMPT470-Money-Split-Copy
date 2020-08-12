import React, { useState, useContext, Fragment } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import Alert from "./Alert";

const Login = (props) => {
  const { setLoggedIn, setUserName } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitError, setSubmitError] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = (e, data) => {
    e.preventDefault();
    fetch("http://localhost:8080/user/token-auth/", {
      crossDomain: true,
      withCredentials: true,
      async: true,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.user) {
          localStorage.setItem("token", json.token);
          setLoggedIn(true);
          setUserName(json.user.username);
          props.history.push("/");
          window.location.reload(false)
        } else {
          setSubmitError("Your email or password is incorrect");
        }
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  return (
    <Fragment>
    <title>MoneySplit | Log In</title>
    <div className="container">
      <div className="row mt-5 mb-5">
        <div className="col-md-5 m-auto">
          <div className="card card-body">
            <form
              onSubmit={(e) =>
                handleLogin(e, {
                  username: email,
                  password: password,
                })
              }
            >
              <h1 className="text-center mb-3">
                <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 16 16"
                  className="bi bi-person"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M13 14s1 0 1-1-1-4-6-4-6 3-6 4 1 1 1 1h10zm-9.995-.944v-.002.002zM3.022 13h9.956a.274.274 0 0 0 .014-.002l.008-.002c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664a1.05 1.05 0 0 0 .022.004zm9.974.056v-.002.002zM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
                  />
                </svg>{" "}
                Login
              </h1>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  required
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter Email"
                  onChange={handleEmailChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-group flex-nowrap">
                  <input
                    required
                    type="password"
                    id="password"
                    name="password"
                    className="form-control"
                    placeholder="Enter Password"
                    onChange={handlePasswordChange}
                  />
                </div>
              </div>
              {submitError && (
                <Alert type="danger" des={submitError} show={false} />
              )}
              <button type="submit" className="btn btn-primary btn-block">
                Login
              </button>
              <div className="lead mt-4">
                <Link to="/user/signup">No Account? Register</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </Fragment>
  );
};

export default Login;
