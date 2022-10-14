import Cookies from "js-cookie";
import React, { useEffect, useState, Fragment } from "react";
import { toast } from "react-toastify";

import Habit from "./habit";
import EditHabitModal from "./editHabitModal";

const HabitList = ({ filter }) => {
  var myHeaders = new Headers();
  myHeaders.append("auth_token", Cookies.get("token"));
  myHeaders.append("Content-Type", "application/json");

  useEffect(() => {
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_API_URL}/habits`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`There was an error: ${response.text()}`);
        } else return response.json();
      })
      .then((result) => {
        setHabitList(result.habits);
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
      toast.error("Please enter a name for your habit!");
      return;
    }

    addHabit(item);
    setItem({ name: "" });
  };

  const [habitList, setHabitList] = useState([]);

  const addHabit = async (item) => {
    var raw = JSON.stringify({
      name: item.name,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_API_URL}/habits`, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        return response.json().then((error) => {
          throw new Error(error.error);
        });
      })
      .then((result) => {
        toast.success("Habit has been created!");
        setHabitList((oldList) => [...oldList, result.habit]);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const removeHabit = async (id) => {
    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_API_URL}/habits/${id}`, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        return response.json().then((error) => {
          throw new Error(error.error);
        });
      })
      .then((result) => {
        toast.success(`Habit ${result.habit.name} has been deleted!`);
        setHabitList((oldList) => oldList.filter((item) => item._id !== id));
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const editHabit = async (id, item) => {
    var raw = JSON.stringify({
      name: item.name,
      description: item.description,
      category: item.category,
      counter: item.counter,
      priority: item.priority,
      goal: item.goal,
      resetFrequency: item.resetFrequency,
    });

    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_API_URL}/habits/${id}`, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        return response.json().then((error) => {
          throw new Error(error.error);
        });
      })
      .then((result) => {
        toast.success(`Habit ${result.habit.name} has been edited!`);

        setHabitList((oldList) => oldList.filter((item) => item._id !== id));
        setHabitList((oldList) => [...oldList, result.habit]);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const onPositiveHabit = (habit) => {
    editHabit(habit._id, { counter: habit.counter + 1 });
  };

  const onNegativeHabit = (habit) => {
    editHabit(habit._id, { counter: habit.counter - 1 });
  };

  const renderList = habitList
    .filter((habit) => {
      switch (filter) {
        case "All":
          return habit;
        case "Completed":
          if (habit.goal <= habit.counter) return habit;
          break;
        case "Active":
          if (habit.goal >= habit.counter) return habit;
          break;
        case "highPriority":
          if (habit.priority === 3) return habit;
          break;
        case "mediumPriority":
          if (habit.priority === 2) return habit;
          break;
        case "lowPriority":
          if (habit.priority === 1) return habit;
          break;
        default:
          if (habit.category === filter) return habit;
          break;
      }
    })
    .map((habit) => (
      <Fragment key={habit._id}>
        <div style={{ margin: "0px" }} className="ui segment">
          <div className="ui grid container stackable equal width">
            <div className="row">
              <div className="column left aligned">
                <Habit key={habit._id} item={habit}></Habit>
              </div>
            </div>
            <div className="row">
              <div className="column right aligned">
                <div className="column wide">
                  <EditHabitModal
                    removeHabit={() => removeHabit(habit._id)}
                    editHabit={(updatedItem) =>
                      editHabit(habit._id, updatedItem)
                    }
                    itemProps={habit}
                  ></EditHabitModal>
                  <button
                    type="button"
                    onClick={() => {
                      onNegativeHabit(habit);
                    }}
                    className="right floated ui button red"
                  >
                    <i
                      style={{ margin: "0px" }}
                      className="minus circle icon black"
                    ></i>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onPositiveHabit(habit);
                    }}
                    className="right floated ui button green"
                  >
                    <i
                      style={{ margin: "0px" }}
                      className="plus circle icon black"
                    ></i>
                  </button>
                  <label></label>
                </div>
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
                Add Habit
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

export default HabitList;
