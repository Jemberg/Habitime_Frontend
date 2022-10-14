import Cookies from "js-cookie";
import React, { useEffect, useState, Fragment } from "react";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";

import { checkAuthentication, logOut } from "../auth/auth";
import Task from "./task";
import EditTaskModal from "./editTaskModal";

const TaskList = ({ filter }) => {
  var myHeaders = new Headers();
  myHeaders.append("auth_token", Cookies.get("token"));
  myHeaders.append("Content-Type", "application/json");

  const [item, setItem] = useState({
    name: "",
  });

  useEffect(() => {
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_API_URL}/tasks`, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        return response.json().then((error) => {
          if (response.status === 401) {
            logOut(() => {});
          }
          throw new Error(error.error);
        });
      })
      .then((result) => {
        setTaskList(result.tasks);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, []);

  const handleChange = (event) => {
    setItem({ ...item, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!item.name.trim()) {
      toast.error("Please enter a name for your task!");
      return;
    }

    addTask(item);
    setItem({ name: "" });
  };

  const onCompleteSubmit = (id, completed) => {
    const toastCompleted = completed ? "Completed" : "Uncompleted";
    toast.success(`Task has been ${toastCompleted}!`);
    editTask(id, { completed: completed });
  };

  const [taskList, setTaskList] = useState([]);

  const addTask = async (item) => {
    var raw = JSON.stringify({
      name: item.name,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_API_URL}/tasks`, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        return response.json().then((error) => {
          throw new Error(error.error);
        });
      })
      .then((result) => {
        toast.success("Task has been created!");
        setTaskList((oldList) => [...oldList, result.task]);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const removeTask = async (id) => {
    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_API_URL}/tasks/${id}`, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        return response.json().then((error) => {
          throw new Error(error.error);
        });
      })
      .then(() => {
        toast.success("Task has been deleted!");
        setTaskList((oldList) => oldList.filter((item) => item._id !== id));
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const editTask = async (id, item) => {
    var raw = JSON.stringify({
      name: item.name,
      description: item.description,
      completed: item.completed,
      category: item.category,
      priority: item.priority,
      dueDate: item.dueDate,
    });

    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_API_URL}/tasks/${id}`, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        return response.json().then((error) => {
          throw new Error(error.error);
        });
      })
      .then((result) => {
        // Delete task, then add updated task back in, this is not very efficient lol.
        setTaskList((oldList) => oldList.filter((item) => item._id !== id));
        setTaskList((oldList) => [...oldList, result.task]);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const renderList = Array.from(taskList)
    .filter((task) => {
      switch (filter) {
        case "All":
          return task;
        case "Completed":
          if (task.completed === true) return task;
          break;
        case "Active":
          if (task.completed === false) return task;
          break;
        case "highPriority":
          if (task.priority === 3) return task;
          break;
        case "mediumPriority":
          if (task.priority === 2) return task;
          break;
        case "lowPriority":
          if (task.priority === 1) return task;
          break;
        default:
          if (task.category === filter) return task;
          break;
      }
    })
    .map((task) => (
      <Fragment key={task._id}>
        <div style={{ margin: "0px" }} className="ui segment">
          <div className="ui grid container stackable equal width">
            <div className="row">
              <div className="column left aligned">
                <Task key={task._id} item={task}></Task>
              </div>
            </div>
            <div className="row">
              <div className="column right aligned">
                <div
                  style={{
                    transform: "scale(2)",
                    bottom: "-3px",
                    paddingRight: "5px",
                  }}
                  className="ui checkbox"
                >
                  <input
                    id={task._id}
                    checked={task.completed}
                    onChange={() => {}}
                    onClick={() => {
                      onCompleteSubmit(task._id, !task.completed);
                    }}
                    type="checkbox"
                  />
                  <label></label>
                </div>
                <EditTaskModal
                  removeTask={() => removeTask(task._id)}
                  editTask={(updatedItem) => editTask(task._id, updatedItem)}
                  itemProps={task}
                ></EditTaskModal>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    ));

  return (
    <Fragment>
      <form onSubmit={handleSubmit}>
        <div className="ui grid container equal width">
          <div className="column row">
            <div className="left aligned column">
              <div className="fluid ui input">
                <input
                  type="text"
                  value={item.name}
                  name="name"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="right aligned column">
              <button className="fluid ui button" type="submit">
                Add Task
              </button>
            </div>
          </div>
        </div>
      </form>
      <div className="ui raised segments">
        <div>{renderList}</div>
      </div>
    </Fragment>
  );
};

export default TaskList;
