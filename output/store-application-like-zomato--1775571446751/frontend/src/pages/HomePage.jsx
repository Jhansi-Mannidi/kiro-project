import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Card, CardContent, Typography } from '@material-ui/core';

const HomePage = () => {
  const [stores, setStores] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('https://your-backend-url.com/stores')
      .then(response => response.json())
      .then(data => setStores(data));
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h5">
              Search for a store
            </Typography>
            <input type="search" value={searchQuery} onChange={handleSearch} placeholder="Enter store name or location" />
          </CardContent>
        </Card>
      </Grid>
      {stores.filter(store => store.name.toLowerCase().includes(searchQuery.toLowerCase())).map((store) => (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={store.id}>
          <Link to={`/store/${store.id}`}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h5">
                  {store.name}
                </Typography>
                <Typography variant="body1" component="p">
                  {store.location}
                </Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
};

export default HomePage;