import withSession from '../../utils/api/with-session';
import apiClient from '../../utils/api-client';

async function login(req, res) {
  const jwt = await apiClient.post('/login', req.body);
}

export default withSession(login);
