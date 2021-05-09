import PropTypes from 'prop-types';
import '../styles/globals.css';

function TripsitApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

TripsitApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default TripsitApp;
