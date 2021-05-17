import { Button, Row, Col } from 'react-bootstrap';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import apiClient from '../utils/api-client';
import Head from '../components/head';
import DefaultLayout from '../components/layouts/default';
import { TextControl } from '../components/controls';

// Intentionally relaxed validation as not to aide malicious access attempts
const validationSchema = Yup.object({
  nick: Yup.string().required(),
  password: Yup.string().required(),
}).required();

export default function LoginPage() {
  async function onSubmit(values) {
    return apiClient.post('/api/login', values)
      .then(() => {
        console.log('Redirect user to last page they were on...');
      })
      .catch((error) => {
        console.error(error);
        // TODO: Error notifications
      });
  }

  return (
    <>
      <Head title="Login" />
      <DefaultLayout>
        <Formik
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          initialValues={{
            nick: '',
            password: '',
          }}
        >
          {({ isSubmitting, handleSubmit }) => (
            <Form method="post" action="/api/login" onSubmit={handleSubmit}>
              <Row>
                <Col xs={12} md={6}>
                  <TextControl
                    name="nick"
                    label="Username"
                    disabled={isSubmitting}
                    placeholder="Tripsitter123"
                  />
                </Col>

                <Col xs={12} md={6}>
                  <TextControl
                    name="password"
                    label="Password"
                    type="password"
                    disabled={isSubmitting}
                  />
                </Col>
              </Row>

              <div>
                <Button type="submit" variant="success" disabled={isSubmitting}>
                  Login
                </Button>
              </div>

            </Form>
          )}
        </Formik>
      </DefaultLayout>
    </>
  );
}
