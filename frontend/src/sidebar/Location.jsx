import React from "react";
import InputField from "../Components/InputField";

function Location({ handleChange }) {
  return (
    <div>
      <h4 className="text-lg font-medium mb-2">Job Location</h4>

      <div>
        <label className="sidebar-label-container">
          <input
            type="radio"
            name="test"
            id="test"
            value="All"
            onChange={handleChange}
          
          />
          <span className="checkmark"></span>All
        </label>

        <InputField
          handleChange={handleChange}
          value="london"
          title="London"
          name="test"
        />
        
        <InputField
          handleChange={handleChange}
          value="san Francisco"
          title="San Francisco"
          name="test"
        />
        
        <InputField
          handleChange={handleChange}
          value="banglore"
          title="Banglore"
          name="test"
        />
        
        <InputField
          handleChange={handleChange}
          value="Boston"
          title="Boston"
          name="test"
        />
        <InputField
          handleChange={handleChange}
          value="Mahesana"
          title="Mahesana"
          name="test"
        />
      </div>
    </div>
  );
}

export default Location;
