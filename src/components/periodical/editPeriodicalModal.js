import React, { Fragment, useState } from "react";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import { Dropdown } from "semantic-ui-react";
import SimpleMDE from "react-simplemde-editor";

import CategoryDropdown from "../categoryDropdown";

Modal.setAppElement("#root");

const EditPeriodicalModal = (props) => {
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  function closeModal() {
    setPeriodical(null);
    setIsOpen(false);
  }

  const [periodical, setPeriodical] = useState({});

  const handleChange = (event) => {
    setPeriodical({ ...periodical, [event.target.name]: event.target.value });
  };

  const handleCategoryChange = (category) => {
    setPeriodical({ ...periodical, category: category });
  };

  const handleFrequencyChange = (event, data) => {
    // event.preventDefault();
    setPeriodical({ ...periodical, frequency: data.value });
  };

  const handleDesc = (value) => {
    setPeriodical({ ...periodical, description: value });
  };

  const frequencyOptions = [
    {
      key: "Daily",
      text: "Daily",
      value: "Daily",
    },
    {
      key: "Weekly",
      text: "Weekly",
      value: "Weekly",
    },
    {
      key: "Monthly",
      text: "Monthly",
      value: "Monthly",
    },
  ];

  return (
    <Fragment>
      <button type="button" className="ui button" onClick={openModal}>
        <i style={{ margin: "0px" }} className="cog icon black"></i>
      </button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        contentLabel="Periodical editing."
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
            <label>Frequency</label>
            <Dropdown
              placeholder={props.itemProps.frequency}
              fluid
              selection
              options={frequencyOptions}
              onChange={handleFrequencyChange}
            />
          </div>
          <button
            type="button"
            className="ui button green"
            onClick={(e) => {
              e.preventDefault();
              props.editPeriodical(periodical);
              toast.success("Periodical has been edited!");
              closeModal();
            }}
          >
            Confirm Changes
          </button>
          <button
            type="button"
            className="ui button red"
            onClick={() => {
              props.removePeriodical();
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

export default EditPeriodicalModal;
