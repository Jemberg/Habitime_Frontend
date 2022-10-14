import React, { Fragment } from "react";
import { Link, Navigate } from "react-router-dom";
import { logOut } from "./auth/auth";
import { askForNotificationPermission } from "../push-notifications";

const Layout = ({ children }) => {
  const navBar = () => (
    <div
      style={{ backgroundColor: "#4e0a7b" }}
      className="ui secondary large menu"
    >
      <Link to="/" style={{ color: "white" }} className="white text item">
        Home
      </Link>
      <Link
        to="/settings"
        style={{ color: "white" }}
        className="white text item"
      >
        Settings
      </Link>

      <div className="right menu">
        <div
          className="big ui basic icon button"
          onClick={() => {
            askForNotificationPermission();
          }}
        >
          <i className="bell icon" style={{ color: "white" }}></i>
        </div>
        <Link
          to="/login"
          onClick={() => {
            logOut(() => {
              <Navigate to="/login"></Navigate>;
            });
          }}
          style={{ color: "white" }}
          className="item"
        >
          Logout
        </Link>
      </div>
    </div>
  );

  return (
    <Fragment>
      {navBar()}
      <div className="container">{children}</div>
    </Fragment>
  );
};

export default Layout;
