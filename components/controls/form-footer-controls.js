import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';

const Column = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

function FormFooterControls({ children, className, ...props }) {
  return (
    <Row className={className}>
      <Column {...props}>
        {children}
      </Column>
    </Row>
  );
}

FormFooterControls.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

FormFooterControls.defaultProps = {
  className: null,
};

export default FormFooterControls;
