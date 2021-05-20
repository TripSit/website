import 'bootstrap/dist/css/bootstrap.css';
import PropTypes from 'prop-types';
import { createGlobalStyle } from 'styled-components';
import '../yup-locales';
import Notifications from '../components/notifications';

const GlobalStyles = createGlobalStyle`
  html,
  body,
  #__next {
    min-height: 100vh;
    width: 100vw;
  }
`;

function TripsitApp({ Component, pageProps }) {
  return (
    <>
      <GlobalStyles />
      <Notifications>
        <Component {...pageProps} />
      </Notifications>
    </>
  );
}

TripsitApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default TripsitApp;
