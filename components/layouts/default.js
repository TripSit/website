import PropTypes from 'prop-types';
import styled from 'styled-components';
import Header from '../page-header';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr min-content;
  grid-template-rows: 4rem 1fr;

  > header {
    grid-column: 1 / span 1;
    grid-row: 1 / span 1;
  }

  > main {
    grid-column: 1 / span 1;
    grid-row: 2 / span 1;
  }
`;

function DefaultLayout({ children, heading }) {
  return (
    <Grid>
      <Header />
      <main>
        <h1>{heading}</h1>
        {children}
      </main>
    </Grid>
  );
}

DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired,
  heading: PropTypes.string.isRequired,
};

export default DefaultLayout;
