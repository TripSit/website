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

function TextControl({
  className,
  label,
  type,
  ...props
}) {
  const [field, meta] = useField(props);

  return (
    <Form.Group className={className} controlId={field.name}>
      {label && (
        <Form.Label>{label}</Form.Label>
      )}
      {type !== 'textarea' ? (
        <Form.Control {...field} {...props} type={type} />
      ) : (
        <Form.Control {...field} {...props} as="textarea" />
      )}
      <ErrorFeedback visible={!!meta.error}>{meta.error}</ErrorFeedback>
    </Form.Group>
  );
}

TextControl.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf([
    'text',
    'password',
    'email',
    'textarea',
  ]),
  label: PropTypes.string,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
};

TextControl.defaultProps = {
  className: null,
  label: null,
  type: 'text',
  disabled: false,
  placeholder: null,
  required: false,
};

export default TextControl;
