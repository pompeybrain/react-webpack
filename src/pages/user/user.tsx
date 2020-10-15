import * as React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

const User = () => {
  return (
    <div>
      <h2>User</h2>
      <Button type="primary">
        <Link to="/">Home</Link>
      </Button>
    </div>
  );
};

export default User;
