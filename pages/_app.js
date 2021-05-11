import 'bootstrap/dist/css/bootstrap.css';
import PropTypes from 'prop-types';
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  html,
  body,
  #__next {
    min-height: 100vh;
  }
`;

function TripsitApp({ Component, pageProps }) {
  return (
    <>
      <GlobalStyles />
      <Component {...pageProps} />
    </>
  );
}

TripsitApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default TripsitApp;
