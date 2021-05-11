import Link from 'next/link';
import {
  Navbar,
  Nav,
  // NavDropdown,
  Image,
} from 'react-bootstrap';
import NavItem from './nav-item';

export default function PageHeader() {
  return (
    <Navbar as="header">
      <Link href="/" passHref>
        <Navbar.Brand>
          <Image src="/images/tripsipt-logo.svg" alt="Tripsit's Logo" />
        </Navbar.Brand>
      </Link>

      <nav>
        <Nav as="ul">
          <NavItem href="https://chat.tripsit.me/">Chat</NavItem>
          <NavItem href="https://drugs.tripsit.me/">Factsheets</NavItem>
          <NavItem href="https://wiki.tripsit.me/wiki/Main_Page">Wiki</NavItem>
          <NavItem href="https://tripsit.me/donate/">Donate</NavItem>
          <NavItem href="/contact">Contact</NavItem>
        </Nav>
      </nav>
    </Navbar>
  );
}
