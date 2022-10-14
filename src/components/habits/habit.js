import React, { Fragment } from "react";
import ReactMarkdown from "react-markdown";

const Habit = ({ item }) => {
  const localDate = new Date(item.nextReset);
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };

  return (
    <Fragment>
      <h2>{item.name}</h2>
      <ReactMarkdown>{item.description}</ReactMarkdown>
      <label className="ui label basic label">
        {item.resetFrequency}, Next Reset:{" "}
        {localDate.toLocaleDateString("en-EN", options)}
      </label>
    </Fragment>
  );
};

export default Habit;
