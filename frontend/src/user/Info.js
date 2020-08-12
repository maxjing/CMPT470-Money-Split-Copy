import React, { useState, useContext, useEffect, Fragment } from "react";
import { withFormik, FieldArray, Formik } from "formik";
import { UserContext } from "./UserContext";
import Alert from "./Alert";
import axios from "axios";
const Info = () => {
  const { loggedIn, username, setLoggedIn, setUserName } = useContext(
    UserContext
  );

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    if (loggedIn) {
      fetch("http://localhost:8080/user/current_user/", {
        method: "GET",
        headers: {
          Authorization: `JWT ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((resp) => {
          resp.username && setEmail(resp.username);
          resp.first_name && setFirstName(resp.first_name);
          resp.last_name && setLastName(resp.last_name);
        })
    }
  }, []);

  return (
    <Fragment>
    <title>MoneySplit | My Account</title>
    <div className="container">
      <h3>My Account</h3>
      <Formik
        enableReinitialize
        initialValues={{
          email: email,
          firstName: firstName,
          lastName: lastName,
        }}
        onSubmit={async (values, actions) => {
          actions.setSubmitting(false);
          fetch("http://localhost:8080/user/update/", {
            method: "POST",

            headers: {
              Authorization: `JWT ${localStorage.getItem("token")}`,
            },
          })
            .then((res) => res.json())
            .then((resp) => {
              resp.username && setEmail(resp.username);
              resp.first_name && setFirstName(resp.first_name);
              resp.last_name && setLastName(resp.last_name);
            })
        }}
        render={({ values, handleChange, handleSubmit }) => (
          <form>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={values.email}
                onChange={handleChange}
                disabled={true}
              />
            </div>
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="firstName"
                className="form-control"
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
                disabled={true}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">First Name</label>
              <input
                type="lastName"
                className="form-control"
                name="lastName"
                value={values.lastName}
                onChange={handleChange}
                disabled={true}
              />
            </div>
            {/* <button className="btn btn-primary" type="submit">
              Submit
            </button> */}
          </form>
        )}
      ></Formik>
    </div>
    </Fragment>
  );
};

export default Info;
