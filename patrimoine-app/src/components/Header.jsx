import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';

const Header = () => {
  return (
    <Navbar bg="light" expand="lg" fixed="top" className="d-flex justify-content-between p-2">
      <Navbar.Brand  className="d-flex justify-content-start" href="#home">Gestion de Patrimoine</Navbar.Brand>
      <Nav className="ml-auto">
        <Nav.Link as={Link} to="/">Accueil</Nav.Link>
        <Nav.Link as={Link} to="/patrimoine">Menu Patrimoine</Nav.Link>
        <Nav.Link as={Link} to="/possessions">Menu Possessions</Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default Header;
