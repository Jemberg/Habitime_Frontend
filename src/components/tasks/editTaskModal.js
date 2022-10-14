import React, { Fragment, useState } from "react";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import CategoryDropdown from "../categoryDropdown";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

Modal.setAppElement("#root");

const EditTaskModal = (props) => {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [task, setTask] = useState({});
  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  function closeModal() {
    setTask({});
    setIsOpen(false);
  }

  const handleChange = (event) => {
    setTask({ ...task, [event.target.name]: event.target.value });
  };

  const handleDesc = (value) => {
    setTask({ ...task, description: value });
  };

  const [category, setCategory] = useState("");

  const handleCategoryChange = (category) => {
    setTask({ ...task, category: category });
  };

  return (
    <Fragment>
      <button type="button" className="ui floated button" onClick={openModal}>
        <i style={{ margin: "0px" }} className="cog icon black"></i>
      </button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        contentLabel="Task editing."
      >
        <h1 className="ui header">{props.itemProps.name}</h1>
        <ToastContainer />
        <form className="ui form">
          <div className="field">
            <label>Name</label>
            <input
              onChange={handleChange}
              type="text"
              name="name"
              placeholder={props.itemProps.name}
            />
          </div>
          <div className="field">
            <label>Description</label>
            <SimpleMDE
              style={{ fontFamily: "inherit", fontSize: "inherit" }}
              name="description"
              onChange={handleDesc}
              value={props.itemProps.description}
            />
            ;
          </div>
          <div className="field">
            <label>Priority</label>
            <input
              onChange={handleChange}
              type="number"
              name="priority"
              min="1"
              max="3"
              placeholder={props.itemProps.priority}
            />
          </div>
          <div className="field">
            <label>Category</label>
            <CategoryDropdown
              defaultValue={props.itemProps.category}
              handleCategoryChange={handleCategoryChange}
            ></CategoryDropdown>
          </div>
          <div className="field">
            <label>Due Date</label>
            <input
              onChange={handleChange}
              type="date"
              name="dueDate"
              placeholder={props.itemProps.dueDate}
            />
          </div>
          <button
            type="button"
            className="ui button green"
            onClick={() => {
              handleCategoryChange();
              props.editTask(task);
              toast.success("Task has been edited!");
              closeModal();
            }}
          >
            Confirm Changes
          </button>
          <button
            type="button"
            className="ui button red"
            onClick={() => {
              props.removeTask();
              closeModal();
            }}
          >
            Delete
          </button>
          <button type="button" className="ui button" onClick={closeModal}>
            Cancel
          </button>
        </form>
      </Modal>
    </Fragment>
  );
};

export default EditTaskModal;
