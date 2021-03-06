import PropTypes from 'prop-types';
import Head from 'next/head';

function PageHead({ children, title }) {
  return (
    <Head>
      <title>TripSit &bull; {title}</title>
      <meta name="viewport" value="width=device-width, initial-scale=1" />
      {children}
    </Head>
  );
}

PageHead.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string.isRequired,
};

PageHead.defaultProps = {
  children: null,
};

export default PageHead;
