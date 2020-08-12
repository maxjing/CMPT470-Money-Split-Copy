import React, { useState, useEffect, useContext, Fragment } from "react";
import { Link } from "react-router-dom";
import Alert from "./Alert";
import { UserContext } from "./UserContext";
import axios from "axios";

const SignUp = (props) => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordShow, setPasswordShow] = useState(false);
  const [error, setError] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      setError("All fields are required");
    } else if (password.length < 6) {
      setError("Password length has to be greater than 6");
    } else {
      axios
        .post("http://localhost:8080/user/create/", {
          user: {
            first_name: firstName,
            last_name: lastName,
            username: email,
            password: password,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            if (response.data.message.username) {
              setError(response.data.message.username[0]);
            } else {
              alert("Sign up successful!")
              props.history.push("/user/login");
            }
          } else {
            setError("Error " + response.status);
          }
        })
        .catch((error) => {
          //console.log(error);
        });
    }
  };

  return (
    <Fragment>
    <title>MoneySplit | Sign Up</title>
    <div className="container">
      <div className="row mt-5 mb-5">
        <div className="col-md-5 m-auto">
          <div className="card card-body">
            <form onSubmit={(e) => handleSignUp(e)}>
              <h1 className="text-center mb-3">
                <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 16 16"
                  className="bi bi-person-plus"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M11 14s1 0 1-1-1-4-6-4-6 3-6 4 1 1 1 1h10zm-9.995-.944v-.002.002zM1.022 13h9.956a.274.274 0 0 0 .014-.002l.008-.002c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664a1.05 1.05 0 0 0 .022.004zm9.974.056v-.002.002zM6 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm4.5 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"
                  />
                  <path
                    fillRule="evenodd"
                    d="M13 7.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0v-2z"
                  />
                </svg>{" "}
                Sign Up
              </h1>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  required
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="Email"
                  onChange={handleEmailChange}
                />
              </div>
              <div className="row">
                <div className="form-group col-md-6">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    required
                    type="name"
                    id="firstName"
                    name="firstName"
                    className="form-control"
                    placeholder="First Name"
                    onChange={handleFirstNameChange}
                  />
                </div>

                <div className="form-group col-md-6">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    required
                    type="name"
                    id="lastName"
                    name="lastName"
                    className="form-control"
                    placeholder="Last Name"
                    onChange={handleLastNameChange}
                  />
                </div>
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
                    placeholder="Password"
                    onChange={handlePasswordChange}
                  />
                </div>
              </div>
              {error && <Alert type="danger" des={error} />}
              <button type="submit" className="btn btn-primary btn-block">
                Register
              </button>
              <p className="lead mt-4">
                <Link className="nav-link" to="/user/login">
                  Have An Account? Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
    </Fragment>
  );
};

export default SignUp;
