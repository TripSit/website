import styled from 'styled-components';
import { Navbar as BsNavbar, Nav, Image } from 'react-bootstrap';
import Head from '../components/head';
import NavItem from '../components/home-nav-item';

const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #060606;
`;

const BannerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
`;

const Navbar = styled(BsNavbar)`
  display: flex;
  flex-direction: column;

  ul {
    display: flex;
    flex-direction: column;
    height: 3rem;
  }

  a {
    color: #f7f7f7;
  }
`;

const AttentionNavItem = styled(NavItem)`
  background-color: #a55;
`;

export default function HomePage() {
  return (
    <>
      <Head title="Harm Reduction Through Education" />
      <PageLayout>
        <BannerContainer>
          <Image src="/images/tripsit-logo.svg" alt="Tripsit's Logo" />
        </BannerContainer>

        <Navbar as="header">
          <Nav as="ul">
            <NavItem href="#">Placeholder</NavItem>
            <NavItem href="#">Placeholder</NavItem>
            <NavItem href="#">Placeholder</NavItem>
            <NavItem href="#">General Chat</NavItem>
            <AttentionNavItem href="#">Immidiate Assistance</AttentionNavItem>
          </Nav>
          <Nav as="ul">
            <NavItem href="#">Placeholder</NavItem>
            <NavItem href="#">Placeholder</NavItem>
            <NavItem href="#">Placeholder</NavItem>
            <NavItem href="#">Placeholder</NavItem>
            <NavItem href="/contact">Contact</NavItem>
          </Nav>
        </Navbar>
      </PageLayout>
    </>
  );
}
