import { Form, Button } from 'react-bootstrap';
import Head from '../components/head';
import DefaultLayout from '../components/layouts/default';

export default function LoginPage() {
  return (
    <>
      <Head title="Login" />
      <DefaultLayout>
        <Form method="post" action="/api/login">

          <Form.Group controlid="loginNick">
            <Form.Label>Nick</Form.Label>
            <Form.Control name="nick" placeholder="Tripsitter123" />
          </Form.Group>

          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control name="password" type="password" />
          </Form.Group>

          <div>
            <Button type="submit" variant="success">Login</Button>
          </div>

        </Form>
      </DefaultLayout>
    </>
  );
}
