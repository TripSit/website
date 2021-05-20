import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '../../test/utils';
import RegisterPage from '../register';
import apiClient from '../../utils/api-client';
import useNotify from '../../hooks/use-notify';

jest.mock('next/router', () => ({ useRouter: jest.fn() }));
jest.mock('../../utils/api-client');
jest.mock('../../hooks/use-notify');

afterEach(() => {
  useRouter.mockReset();
  apiClient.post.mockReset();
  useNotify.mockReset();
});

describe('field validation', () => {
  test('nick', async () => {
    render(<RegisterPage />);
    const nickInput = screen.getByLabelText('Nick');
    const nickErrorLabel = nickInput.nextElementSibling;
    expect(nickErrorLabel).toBeEmptyDOMElement();

    fireEvent.click(screen.getByText('Create Account'));
    await waitFor(() => expect(nickErrorLabel.textContent).toBe('Required'));

    userEvent.type(nickInput, 'ThisIsAReallyReallyReallyLongNameLikeAreYouSerious');
    await waitFor(() => expect(nickErrorLabel.textContent).toBe('Must be no more than 32 characters'));

    userEvent.clear(nickInput);
    userEvent.type(nickInput, 'TestCats');
    return waitFor(() => expect(nickErrorLabel).toBeEmptyDOMElement());
  });

  test('password', async () => {
    render(<RegisterPage />);
    const passwordInput = screen.getByLabelText('Password');
    const passwordErrorLabel = passwordInput.nextElementSibling;
    expect(passwordErrorLabel).toBeEmptyDOMElement();

    fireEvent.click(screen.getByText('Create Account'));
    await waitFor(() => expect(passwordErrorLabel.textContent).toBe('Required'));

    userEvent.clear(passwordInput);
    userEvent.type(passwordInput, 'short');
    await waitFor(() => expect(passwordErrorLabel.textContent).toBe('Must be at least 6 characters'));

    userEvent.clear(passwordInput);
    userEvent.type(passwordInput, 'P@ssw0rd');
    return waitFor(() => expect(passwordErrorLabel).toBeEmptyDOMElement());
  });

  test('confirmPassword', async () => {
    render(<RegisterPage />);
    const passwordField = screen.getByLabelText('Password');
    const confirmPasswordField = screen.getByLabelText('Confirm Password');
    const confirmPasswordErrorLabel = confirmPasswordField.nextElementSibling;
    expect(confirmPasswordErrorLabel).toBeEmptyDOMElement();

    userEvent.type(passwordField, 'P@ssw0rd');
    userEvent.type(confirmPasswordField, 'AYY');
    fireEvent.click(screen.getByText('Create Account'));
    await waitFor(() => expect(confirmPasswordErrorLabel.textContent).toBe('Passwords must match'));

    userEvent.clear(confirmPasswordField);
    userEvent.type(confirmPasswordField, 'P@ssw0rd');
    return waitFor(() => expect(confirmPasswordErrorLabel).toBeEmptyDOMElement());
  });
});

describe('submission', () => {
  test('error', async () => {
    const mockError = new Error('testing');
    apiClient.post.mockRejectedValue(mockError);
    render(<RegisterPage />);

    userEvent.type(screen.getByLabelText('Nick'), 'TestCats');
    userEvent.type(screen.getByLabelText('Password'), 'P@ssw0rd');
    userEvent.type(screen.getByLabelText('Confirm Password'), 'P@ssw0rd');
    fireEvent.click(screen.getByText('Create Account'));

    return waitFor(() => expect(screen.queryByText('Unknown error trying to register user.')));
  });

  test('success', async () => {
    const mockRouter = { push: jest.fn() };
    useRouter.mockReturnValue(mockRouter);
    apiClient.post.mockResolvedValue();
    render(<RegisterPage />);

    userEvent.type(screen.getByLabelText('Nick'), 'TestCats');
    userEvent.type(screen.getByLabelText('Password'), 'P@ssw0rd');
    userEvent.type(screen.getByLabelText('Confirm Password'), 'P@ssw0rd');
    expect(mockRouter.push).not.toHaveBeenCalled();

    fireEvent.click(screen.getByText('Create Account'));
    return waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith('/login'));
  });
});
