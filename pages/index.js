import styled, { createGlobalStyle } from 'styled-components';
import { Navbar as BsNavbar, Nav, Image } from 'react-bootstrap';
import Head from '../components/head';
import NavItem from '../components/nav-item';

const Styles = createGlobalStyle`
  body {
    background-color: #060606;
  }
`;

const PageLayout = styled.div`
  display: grid;
  grid-template-rows: 3rem auto 3rem;

  @media (max-width: 767px) {
    > header {
      order: 1;
    }

    > footer {
      order: 2;
    }
  }
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
    height: 3rem;
    @media (max-width: 767px) {
      flex-direction: column;
      flex-wrap: nowrap;
    }
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
      <Styles />
      <PageLayout>

        <Navbar as="header">
          <Nav as="ul">
            <AttentionNavItem href="#">Immidiate Assistance</AttentionNavItem>
            <NavItem href="#">General Chat</NavItem>
            <NavItem href="#">Placeholder</NavItem>
            <NavItem href="#">Placeholder</NavItem>
            <NavItem href="#">Placeholder</NavItem>
          </Nav>
        </Navbar>

        <BannerContainer>
          <Image src="/images/tripsit-logo.svg" alt="Tripsit's Logo" />
        </BannerContainer>

        <Navbar as="footer">
          <Nav as="ul">
            <NavItem href="#">Placeholder</NavItem>
            <NavItem href="#">Placeholder</NavItem>
            <NavItem href="#">Placeholder</NavItem>
            <NavItem href="#">Placeholder</NavItem>
            <NavItem href="/contact-us">Contact Us</NavItem>
          </Nav>
        </Navbar>
      </PageLayout>
    </>
  );
}
