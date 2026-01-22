// AdminPage.js
import React, { useState } from "react";
import axios from "axios";

const AdminPage = () => {
  const [formData, setFormData] = useState({
    projectName: "",
    address: "",
    latitude: "",
    longitude: "",
    status: "",
    year: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/projects", formData);
      alert("Project added successfully!");
      setFormData({
        projectName: "",
        address: "",
        latitude: "",
        longitude: "",
        status: "",
        year: "",
      });
    } catch (err) {
      console.error(err);
      alert("Error adding project");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Add New Project</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => (
          <div className="mb-3" key={key}>
            <label className="form-label">{key}</label>
            <input
              type={key === "latitude" || key === "longitude" ? "number" : "text"}
              step="any"
              className="form-control"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit" className="btn btn-success">
          Add Project
        </button>
      </form>
    </div>
  );
};

export default AdminPage;
