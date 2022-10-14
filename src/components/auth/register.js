import React, { useState, Fragment } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import { authenticate, checkAuthentication } from "./auth";

import Background from "../../assets/layered-waves-haikei.svg";
import Logo from "../../assets/logo_transparent.png";

const Register = () => {
  const [confirmPass, setConfirmPass] = useState("");
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleConfirmPass = (event) => {
    setConfirmPass(event.target.value);
  };

  const handleChange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Checks if password matches confirmPassword.
    if (credentials.password !== confirmPass) {
      setCredentials({
        username: "",
        email: "",
        password: "",
      });
      setConfirmPass("");
      toast.error("Passwords did not match, please try again.");
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      username: credentials.username,
      email: credentials.email,
      password: credentials.password,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_API_URL}/users`, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        return response.json().then((error) => {
          throw new Error(error.error);
        });
      })
      .then((result) => {
        authenticate(result, () => {
          setCredentials({ password: "", email: "", username: "" });
          setConfirmPass("");
        });
      })
      .catch((error) => {
        toast.error(error.message);
        setCredentials({ password: "", email: "", username: "" });
        setConfirmPass("");
      });
  };

  return (
    <Fragment>
      <Helmet>
        <style>
          {`body { background-image: url(${Logo}),url(${Background});
            background-color: #1c002b;
            background-repeat: no-repeat, no-repeat;
            background-position: top center, 0 0;
            background-size: 15rem, cover;
            color: white;
            }`}
        </style>
      </Helmet>
      {checkAuthentication() ? <Navigate to="/" /> : null}
      <div
        style={{ height: "95vh" }}
        className="ui middle aligned center aligned grid"
      >
        <div style={{ maxWidth: "450px" }} className="column">
          <div
            style={{ backgroundColor: "unset" }}
            className="ui stacked segment loginwindow"
          >
            <form className="ui form">
              <h1>Habitime</h1>
              <div className="field">
                <div className="ui equal width center aligned grid">
                  <div className="row">
                    <div className="column field left aligned">
                      <label style={{ color: "white" }}>Username</label>
                    </div>
                  </div>
                </div>
                <input
                  type="text"
                  name="username"
                  value={credentials.username || ""}
                  onChange={handleChange}
                  placeholder="Enter your username"
                />
              </div>
              <div className="field">
                <div className="ui equal width center aligned grid">
                  <div className="row">
                    <div className="column field left aligned">
                      <label style={{ color: "white" }}>Email</label>
                    </div>
                  </div>
                </div>
                <input
                  type="text"
                  name="email"
                  value={credentials.email || ""}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>
              <div className="field">
                <div className="ui equal width center aligned grid">
                  <div className="row">
                    <div className="column field left aligned">
                      <label style={{ color: "white" }}>Password</label>
                    </div>
                  </div>
                </div>
                <input
                  type="password"
                  name="password"
                  value={credentials.password || ""}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
              </div>
              <div className="field">
                <div className="ui equal width center aligned grid">
                  <div className="row">
                    <div className="column field left aligned">
                      <label style={{ color: "white" }}>Confirm Password</label>
                    </div>
                  </div>
                </div>
                <input
                  type="password"
                  name="confirmPass"
                  value={confirmPass || ""}
                  onChange={handleConfirmPass}
                  placeholder="Enter your password"
                />
              </div>
              <div className="ui equal width center aligned grid">
                <div className="row">
                  <div className="column left aligned">
                    <Link to="/login">
                      Already registered?
                      <br />
                      Login here!
                    </Link>
                  </div>
                  <ToastContainer />
                  <div className="column right aligned">
                    <button
                      className="ui button"
                      onClick={handleSubmit}
                      type="submit"
                    >
                      Register
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="footer">
        <h5 style={{ color: "white" }} className="ui header center aligned">
          Background generated by
          <a href="https://haikei.app/"> Haikei.app</a> <br />
          Logo made by Sina Mielenz
        </h5>
      </div>
    </Fragment>
  );
};

export default Register;
