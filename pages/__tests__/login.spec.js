import userEvent from '@testing-library/user-event';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '../../test/utils';
import LoginPage from '../login';
import apiClient from '../../utils/api-client';
import useNotify from '../../hooks/use-notify';

jest.mock('../../utils/api-client');
jest.mock('../../hooks/use-notify');

afterEach(() => {
  apiClient.post.mockReset();
  useNotify.mockReset();
});

describe('field validation', () => {
  test('nick', async () => {
    render(<LoginPage />);
    const nickInput = screen.getByLabelText('Nick');
    const nickErrorLabel = nickInput.nextElementSibling;
    expect(nickErrorLabel).toBeEmptyDOMElement();

    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(nickErrorLabel.textContent).toBe('Required'));

    userEvent.type(nickInput, 'TestCats');
    return waitFor(() => expect(nickErrorLabel).toBeEmptyDOMElement());
  });

  test('password', async () => {
    render(<LoginPage />);
    const passwordInput = screen.getByLabelText('Password');
    const passwordErrorLabel = passwordInput.nextElementSibling;
    expect(passwordErrorLabel).toBeEmptyDOMElement();

    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(passwordErrorLabel.textContent).toBe('Required'));

    userEvent.type(passwordInput, 'P@ssw0rd');
    return waitFor(() => expect(passwordErrorLabel).toBeEmptyDOMElement());
  });
});

describe('submission', () => {
  test('error', async () => {
    const mockError = new Error('testing');
    apiClient.post.mockRejectedValue(mockError);
    render(<LoginPage />);

    userEvent.type(screen.getByLabelText('Nick'), 'TestCats');
    userEvent.type(screen.getByLabelText('Password'), 'P@ssw0rd');
    fireEvent.click(screen.getByRole('button'));

    return waitFor(() => expect(screen.queryByText('Unknown error when trying to login.')));
  });

  // test('success', async () => {
  //   apiClient.post.mockResolvedValue();
  //   render(<LoginPage />);

  //   userEvent.type(screen.getByLabelText('Nick'), 'TestCats');
  //   userEvent.type(screen.getByLabelText('Password'), 'P@ssw0rd');
  //   fireEvent.click(screen.getByRole('button'));


  // });
});
