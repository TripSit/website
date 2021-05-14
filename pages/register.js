import { useRouter } from 'next/router';
import { Button, Row, Col } from 'react-bootstrap';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import apiClient from '../api-client';
import Head from '../components/head';
import DefaultLayout from '../components/layouts/default';
import { TextControl } from '../components/controls';

const validationSchema = Yup.object({
  nick: Yup.string().required(),
  password: Yup.string().min(6).required(),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
}).required();

export default function RegisterPage() {
  const router = useRouter();

  async function onSubmit({ confirmPassword, ...values }) {
    return apiClient.post('/user', values)
      .then(() => {
        router.push('/login');
      })
      .catch((error) => {
        console.error(error);
        // TODO: Error notifications
      });
  }

  return (
    <>
      <Head title="Register" />
      <DefaultLayout heading="Register">
        <Formik
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          initialValues={{
            nick: '',
            password: '',
            confirmPassword: '',
          }}
        >
          {({ isSubmitting, handleSubmit }) => (
            <Form method="post" action="/api/register" onSubmit={handleSubmit}>
              <Row>
                <Col xs={12}>
                  <TextControl
                    name="nick"
                    label="Nick"
                    disabled={isSubmitting}
                    placeholder="Tripsitter123"
                  />
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={6}>
                  <TextControl
                    name="password"
                    label="Password"
                    type="password"
                    disabled={isSubmitting}
                  />
                </Col>
                <Col xs={12} md={6}>
                  <TextControl
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    disabled={isSubmitting}
                  />
                </Col>
              </Row>

              <Button type="submit" variant="success" disabled={isSubmitting}>
                Create Account
              </Button>

            </Form>
          )}
        </Formik>
      </DefaultLayout>
    </>
  );
}
