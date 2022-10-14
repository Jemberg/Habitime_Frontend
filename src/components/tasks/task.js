import React, { Fragment } from "react";
import ReactMarkdown from "react-markdown";

const Task = ({ item }) => {
  const localDate = new Date(item.dueDate);
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };

  return (
    <Fragment>
      <h2>{item.name}</h2>
      <ReactMarkdown>{item.description}</ReactMarkdown>
      {localDate < new Date() && (
        <label className="ui label red basic label">
          Due: {localDate.toLocaleDateString("en-EN", options)}
        </label>
      )}
      {localDate > new Date() && (
        <label className="ui label basic label">
          Due: {localDate.toLocaleDateString("en-EN", options)}
        </label>
      )}
    </Fragment>
  );
};

export default Task;
