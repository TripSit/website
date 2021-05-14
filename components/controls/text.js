import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Form } from 'react-bootstrap';
import { useField } from 'formik';

const ErrorFeedback = styled.label`
  opacity: ${({ visible }) => (visible ? 0.85 : 0)};
  font-size: 0.8rem;
  color: #f00;
  transition: ease-in-out .15s opacity;
`;

function TextControl({ label, ...props }) {
  const [field, meta] = useField(props);

  return (
    <Form.Group controlId={field.name}>
      {label && (
        <Form.Label>{label}</Form.Label>
      )}
      <Form.Control {...field} {...props} />
      <ErrorFeedback visible={!!meta.error}>{meta.error}</ErrorFeedback>
    </Form.Group>
  );
}

TextControl.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['text', 'password', 'email']),
  label: PropTypes.string,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
};

TextControl.defaultProps = {
  label: null,
  type: 'text',
  disabled: false,
  placeholder: null,
};

export default TextControl;
