import * as React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h2>Home</h2>
      <Link to="m1/user">m1/user</Link>
      <Button type="primary">
        <Link to="/login">Login</Link>
      </Button>
      <Link to="/usersss">404</Link>
    </div>
  );
};

export default Home;
