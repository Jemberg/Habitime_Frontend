import React, { Fragment, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import { checkAuthentication, logOut } from "./auth/auth";
import Layout from "../components/layout";
import Cookie from "js-cookie";

const Settings = () => {
  const [categoryList, setCategoryList] = useState({});
  const [newCategory, setNewCategory] = useState({});
  const [credentials, setCredentials] = useState({});

  const [userStatistics, setUserStatistics] = useState({});

  let navigate = useNavigate();

  const handleChange = (event) => {
    console.log(credentials);
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };

  const handleSubmit = () => {
    setCredentials({
      username: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleCategoryChange = (event) => {
    setNewCategory({ ...newCategory, [event.target.name]: event.target.value });
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();

    if (!credentials.password.trim() || !credentials.confirmPassword.trim()) {
      toast.error("One of the password fields is empty, please try again.");
      setCredentials({});
      return;
    }

    if (credentials.password !== credentials.confirmPassword) {
      setCredentials({});
      toast.error("Passwords did not match, please try again.");
      return;
    }

    updateUser(credentials);
    handleSubmit();
  };

  const handleCategorySubmit = (event) => {
    event.preventDefault();

    if (!newCategory.name.trim()) {
      toast.error("Please enter a name for your category!");
      return;
    }

    addCategory(newCategory);
    setNewCategory({ name: "" });
  };

  var myHeaders = new Headers();
  myHeaders.append("auth_token", Cookie.get("token"));
  myHeaders.append("Content-Type", "application/json");

  useEffect(() => {
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_API_URL}/categories`, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        return response.json().then((error) => {
          throw new Error(error.error);
        });
      })
      .then((result) => {
        setCategoryList(result.categories);
      })
      .catch((error) => {
        toast.error(error.message);
      });

    fetch(`${process.env.REACT_APP_API_URL}/users/me`, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        return response.json().then((error) => {
          throw new Error(error.error);
        });
      })
      .then((result) => {
        setUserStatistics(result.user);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, []);

  const updateUser = async (credentials) => {
    var raw = JSON.stringify({
      username: credentials.username,
      password: credentials.password,
      email: credentials.email,
    });

    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_API_URL}/users/me`, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        return response.json().then((error) => {
          throw new Error(error.error);
        });
      })
      .then((result) => {
        toast.success("User has been updated!");
        localStorage.setItem("user", JSON.stringify(result.user));
        setCredentials(() => [result.credentials]);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const addCategory = async (category) => {
    var raw = JSON.stringify({
      name: newCategory.name,
      color: newCategory.color,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_API_URL}/categories`, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        return response.json().then((error) => {
          throw new Error(error.error);
        });
      })
      .then((result) => {
        toast.success("Category has been created!");
        setCategoryList((oldList) => [...oldList, result.category]);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const removeCategory = async (id) => {
    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_API_URL}/categories/${id}`, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        return response.json().then((error) => {
          throw new Error(error.error);
        });
      })
      .then((result) => {
        toast.success(`Category ${result.category.name} has been deleted`);
        setCategoryList((oldList) => oldList.filter((item) => item._id !== id));
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const deleteAccount = async () => {
    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_API_URL}/users/me`, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        return response.json().then((error) => {
          throw new Error(error.error);
        });
      })
      .then((result) => {
        toast.success("User account has been deleted!");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const logOutAll = async () => {
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_API_URL}/users/logoutAll`, requestOptions)
      .then((response) => {
        if (response.ok) {
          return;
        }

        return response.json().then((error) => {
          throw new Error(error.error);
        });
      })
      .then(() => {
        toast.success("All devices successfully logged out!");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  };

  const renderList = Array.from(categoryList).map((category) => (
    <Fragment key={category._id}>
      <div className="ui middle aligned divided list">
        <div className="item">
          <div className="right floated content">
            <div
              value={category._id}
              onClick={() => {
                removeCategory(category._id);
              }}
              className="ui button red"
            >
              Delete
            </div>
          </div>
          <div className="content">{category.name}</div>
        </div>
      </div>
    </Fragment>
  ));

  return (
    <Layout>
      <Fragment>
        {!checkAuthentication() ? <Navigate to="/login" /> : null}
        <div className="ui grid container stackable equal width">
          <div className="row">
            <div className="column">
              <h2 className="ui header">Change Username</h2>
              <form className="ui form">
                <div className="field">
                  <label>Username: {checkAuthentication().username}</label>
                  <input
                    onChange={handleChange}
                    type="text"
                    name="username"
                    value={credentials.username}
                    placeholder="Please enter a new username"
                  />
                </div>
                <button
                  className="ui button green"
                  onClick={(e) => {
                    e.preventDefault();
                    updateUser(credentials);
                    handleSubmit();
                  }}
                >
                  Confirm New Username
                </button>
              </form>

              <h2 className="ui header">Change E-mail Address</h2>
              <form className="ui form">
                <div className="field">
                  <label>E-mail Address: {checkAuthentication().email}</label>
                  <input
                    onChange={handleChange}
                    type="email"
                    name="email"
                    value={credentials.email}
                    placeholder="Please enter a new email"
                  />
                </div>
                <button
                  className="ui button green"
                  onClick={(e) => {
                    e.preventDefault();
                    updateUser(credentials);
                    handleSubmit();
                  }}
                >
                  Confirm New E-mail Address
                </button>
              </form>

              <h2 className="ui header">Change Password</h2>
              <form className="ui form">
                <div className="field">
                  <label>New Password</label>
                  <input
                    onChange={handleChange}
                    type="password"
                    name="password"
                    value={credentials.password}
                    placeholder="Please enter new password"
                  />
                  <label>Confirm New Password</label>
                  <input
                    onChange={handleChange}
                    type="password"
                    name="confirmPassword"
                    value={credentials.confirmPassword}
                    placeholder="Please confirm new password"
                  />
                </div>
                <button
                  className="ui button green"
                  onClick={(e) => {
                    handlePasswordSubmit(e);
                  }}
                >
                  Confirm New Password
                </button>
              </form>
            </div>
            <div className="column">
              <h2 className="ui header">Category Options</h2>
              <form className="ui form" action="">
                <div className="field">
                  <label>Add New Category</label>
                  <input
                    onChange={handleCategoryChange}
                    type="text"
                    name="name"
                    value={newCategory.name}
                    placeholder="University"
                  />
                </div>
                <button
                  className="ui button green"
                  onClick={handleCategorySubmit}
                >
                  Add New Category
                </button>
              </form>
              <h2 className="ui header">Currently Available Categories:</h2>
              {renderList}
            </div>
            <div className="column">
              <h2 className="ui header">Account Options</h2>
              <div className="field"></div>
              <button
                className="ui button red"
                onClick={() => {
                  deleteAccount();
                  logOut(() => {
                    navigate("/login");
                  });
                }}
              >
                Delete Account
              </button>
              <button
                className="ui button red"
                onClick={() => {
                  logOutAll();
                  logOut(() => {
                    navigate("/login");
                  });
                }}
              >
                Log Out All Devices
              </button>
              <h2 className="ui header">User Statistics:</h2>
              <table className="ui celled table">
                <tbody>
                  <tr>
                    <td>Tasks Done This Week</td>
                    <td>{userStatistics.doneTasks}</td>
                  </tr>
                  <tr>
                    <td>Periodical Tasks Done This Week</td>
                    <td>{userStatistics.doneRecurring}</td>
                  </tr>
                  <tr>
                    <td>Habits Done This Week</td>
                    <td>{userStatistics.doneHabits}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <ToastContainer />
      </Fragment>
    </Layout>
  );
};

export default Settings;
