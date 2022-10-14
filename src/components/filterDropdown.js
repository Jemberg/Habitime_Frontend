import React, { useState, useEffect } from "react";
import { Dropdown } from "semantic-ui-react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const FilterDropdown = ({ filter, setFilter }) => {
  const [filterOptions, setFilterOptions] = useState([
    {
      key: "All",
      text: "All",
      value: "All",
      label: { color: "red", empty: true, circular: true },
    },
    {
      key: "Completed",
      text: "Completed",
      value: "Completed",
      label: { color: "green", empty: true, circular: true },
    },
    {
      key: "Active",
      text: "Not Completed",
      value: "Active",
      label: { color: "brown", empty: true, circular: true },
    },
    {
      key: "highPriority",
      text: "High Priority (3)",
      value: "highPriority",
      label: { color: "grey", empty: true, circular: true },
    },
    {
      key: "mediumPriority",
      text: "Medium Priority (2)",
      value: "mediumPriority",
      label: { color: "orange", empty: true, circular: true },
    },
    {
      key: "lowPriority",
      text: "Low Priority (1)",
      value: "lowPriority",
      label: { color: "violet", empty: true, circular: true },
    },
  ]);

  var myHeaders = new Headers();
  myHeaders.append("auth_token", Cookies.get("token"));
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  useEffect(() => {
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
        const catOptions = result.categories.map((category) => {
          return {
            key: category._id,
            text: category.name,
            value: category._id,
            label: { color: "black", empty: true, circular: true },
          };
        });
        setFilterOptions([...filterOptions, ...catOptions]);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, []);

  return (
    <Dropdown
      placeholder="Select Filter"
      fluid
      selection
      options={filterOptions}
      onChange={(e, result) => setFilter(result.value)}
      value={filter}
    />
  );
};

export default FilterDropdown;
