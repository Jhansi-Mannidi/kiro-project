import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/employees')
      .then(response => response.json())
      .then(data => {
        setEmployees(data);
        setLoading(false);
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>Clock In/Out</h1>
      <p>Current Employees:</p>
      <ul>
        {employees.map(employee => (
          <li key={employee.id}>
            {employee.name} ({employee.role})
            <Link to={`/employees/${employee.id}`}>View</Link>
          </li>
        ))}
      </ul>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <button>
          <Link to="/clockin">Clock In/Out</Link>
        </button>
      )}
    </div>
  );
}

export default HomePage;