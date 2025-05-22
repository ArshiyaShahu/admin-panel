import React from 'react';
import { Link } from 'react-router-dom';

function CarTable({ cars, onDelete }) {
  return (
    <div className="table-card">
      <table className="modern-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Model Name</th>
            <th>Brand</th>
            <th>Class</th>
            <th>Price</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cars.map(model => (
            <tr key={model._id}>
              <td>
                <img
                  src={`http://localhost:4000/${model.images[0]}`}
                  width="60"
                  alt={model.modelName}
                  className="car-img"
                />
              </td>
              <td>{model.modelName}</td>
              <td>{model.brand}</td>
              <td>{model.class}</td>
              <td>₹{model.price}</td>
              <td>
                <span
                  className={`status-circle ${model.active ? 'active' : 'inactive'}`}
                ></span>
              </td>
              <td className="text-right">
                <Link to={`/edit/${model._id}`}>
                  <button className="btn edit-btn">Edit</button>
                </Link>
                <button className="btn delete-btn" onClick={() => onDelete(model._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CarTable;
