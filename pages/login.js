import { Container, Form, Button } from 'react-bootstrap';
import Head from '../components/head';
import DefaultLayout from '../components/layouts/default';

export default function LoginPage() {
  return (
    <>
      <Head title="Login" />
      <DefaultLayout>
        <Form method="post" action="/api/login">
          <Container>

            <Form.Group>
              <Form.Control />
            </Form.Group>

            <Form.Group>
              <Form.Control />
            </Form.Group>

            <div>
              <Button type="submit" variant="success">Login</Button>
            </div>

          </Container>
        </Form>
      </DefaultLayout>
    </>
  );
}
