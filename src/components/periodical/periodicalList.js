import Cookies from "js-cookie";
import React, { useEffect, useState, Fragment } from "react";
import { toast } from "react-toastify";

import Periodical from "./periodical";
import EditPeriodicalModal from "./editPeriodicalModal";

const PeriodicalList = ({ filter }) => {
  var myHeaders = new Headers();
  myHeaders.append("auth_token", Cookies.get("token"));
  myHeaders.append("Content-Type", "application/json");

  useEffect(() => {
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_API_URL}/periodical`, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        return response.json().then((error) => {
          throw new Error(error.error);
        });
      })
      .then((result) => {
        setPeriodicalList(result.periodicals);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, []);

  const [item, setItem] = useState({
    name: "",
  });

  const handleChange = (event) => {
    setItem({ ...item, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!item.name.trim()) {
      toast.error("Please enter a name for your periodical task!");
      return;
    }

    addPeriodical(item);
    setItem({ name: "" });
  };

  const onCompleteSubmit = (id, completed) => {
    const toastCompleted = completed ? "Completed" : "Uncompleted";
    toast.success(`Periodical has been ${toastCompleted}!`);
    editPeriodical(id, { completed: completed });
  };

  const [periodicalList, setPeriodicalList] = useState([]);

  const addPeriodical = async (item) => {
    var raw = JSON.stringify({
      name: item.name,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_API_URL}/periodical`, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        return response.json().then((error) => {
          throw new Error(error.error);
        });
      })
      .then((result) => {
        toast.success("Periodical has been created!");
        setPeriodicalList((oldList) => [...oldList, result.periodical]);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const removePeriodical = async (id) => {
    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_API_URL}/periodical/${id}`, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        return response.json().then((error) => {
          throw new Error(error.error);
        });
      })
      .then((result) => {
        toast.success("Periodical has been deleted!");
        setPeriodicalList((oldList) =>
          oldList.filter((item) => item._id !== id)
        );
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const editPeriodical = async (id, item) => {
    var raw = JSON.stringify({
      name: item.name,
      description: item.description,
      completed: item.completed,
      category: item.category,
      priority: item.priority,
      dueDate: item.dueDate /* .toUTCString() */,
      frequency: item.frequency,
    });

    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_API_URL}/periodical/${id}`, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        return response.json().then((error) => {
          throw new Error(error.error);
        });
      })
      .then((result) => {
        setPeriodicalList((oldList) =>
          oldList.filter((item) => item._id !== id)
        );
        setPeriodicalList((oldList) => [...oldList, result.periodical]);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const renderList = Array.from(periodicalList)
    .filter((periodical) => {
      switch (filter) {
        case "All":
          return periodical;
        case "Completed":
          if (periodical.completed === true) return periodical;
          break;
        case "Active":
          if (periodical.completed === false) return periodical;
          break;
        case "highPriority":
          if (periodical.priority === 3) return periodical;
          break;
        case "mediumPriority":
          if (periodical.priority === 2) return periodical;
          break;
        case "lowPriority":
          if (periodical.priority === 1) return periodical;
          break;
        default:
          if (periodical.category === filter) return periodical;
          break;
      }
    })
    .map((periodical) => (
      <Fragment key={periodical._id}>
        <div style={{ margin: "0px" }} className="ui segment">
          <div className="ui grid container stackable equal width">
            <div className="row">
              <div className="column left aligned">
                <Periodical key={periodical._id} item={periodical}></Periodical>
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
                    id={periodical._id}
                    checked={periodical.completed}
                    onChange={() => {}}
                    onClick={() => {
                      onCompleteSubmit(periodical._id, !periodical.completed);
                    }}
                    type="checkbox"
                  />
                  <label></label>
                </div>
                <EditPeriodicalModal
                  removePeriodical={() => removePeriodical(periodical._id)}
                  editPeriodical={(updatedItem) =>
                    editPeriodical(periodical._id, updatedItem)
                  }
                  itemProps={periodical}
                ></EditPeriodicalModal>
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
                  name="name"
                  value={item.name}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="right aligned column">
              <button className="fluid ui button" type="submit">
                Add Periodical
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

export default PeriodicalList;
