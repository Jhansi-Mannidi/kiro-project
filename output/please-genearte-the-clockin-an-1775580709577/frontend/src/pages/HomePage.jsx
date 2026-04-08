import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const response = await fetch('/api/employees');
        const data = await response.json();
        setEmployees(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
    fetchEmployees();
  }, []);

  return (
    <div className="home-page">
      <h1>Clock In/Out</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {employees.map((employee) => (
            <li key={employee.id}>
              <Link to={`/employees/${employee.id}`}>
                {employee.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HomePage;