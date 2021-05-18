import { Formik, Form } from 'formik';
import PropTypes from 'prop-types';
import { render, screen } from '../../../test/utils';
import TextControl from '../text';

function Wrapper({ children }) {
  return (
    <Formik
      initialValues={{ testField: '' }}
    >
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          {children}
        </Form>
      )}
    </Formik>
  );
}

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

test('shows label when provided', () => {
  const { rerender } = render((
    <Wrapper>
      <TextControl name="testField" label="Test Field" />
    </Wrapper>
  ));

  expect(screen.queryByText('Test Field')).toBeInTheDocument();

  rerender((
    <Wrapper>
      <TextControl name="testField" />
    </Wrapper>
  ));

  expect(screen.queryByText('Test Field')).not.toBeInTheDocument();
});

test('disabled state', () => {
  const { rerender } = render((
    <Wrapper>
      <TextControl name="testField" disabled />
    </Wrapper>
  ));

  expect(screen.getByRole('textbox')).toBeDisabled();

  rerender((
    <Wrapper>
      <TextControl name="testField" />
    </Wrapper>
  ));

  expect(screen.getByRole('textbox')).not.toBeDisabled();
});

test('renders a textarea depending on type prop', () => {
  const { rerender } = render((
    <Wrapper>
      <TextControl name="testField" />
    </Wrapper>
  ));

  expect(screen.getByRole('textbox').tagName).toBe('INPUT');

  rerender((
    <Wrapper>
      <TextControl name="testField" type="textarea" />
    </Wrapper>
  ));

  expect(screen.getByRole('textbox').tagName).toBe('TEXTAREA');
});
