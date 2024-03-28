import React from 'react';
import { Button, Navbar as BootstrapNavbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { actions } from '../slices';

const Navbar = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const logOut = () => dispatch(actions.logout());

  return (
    <BootstrapNavbar bg="white" expand="lg" className="shadow-sm">
      <div className="container">
        <BootstrapNavbar.Brand as={Link} to="/">Hexlet Chat</BootstrapNavbar.Brand>
        {!!auth.token && <Button onClick={logOut}>Выйти</Button>}
      </div>
    </BootstrapNavbar>
  );
};

export default Navbar;
