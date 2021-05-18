import { useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Head from '../../components/head';
import DefaultLayout from '../../components/layouts/default';
import { TextControl, FormFooterControls } from '../../components/controls';
import apiClient from '../../utils/api-client';

const validationSchema = Yup.object({
  understanding: Yup.string().min(10).required(),
  additionalClarification: Yup.string(),
  assurance: Yup.string().min(10).required(),
}).required();

export default function BansContactPage() {
  const [isShowingSuccess, setIsShowingSuccess] = useState(false);

  async function onSubmit(values) {
    return apiClient.post('/api/contact-us/bans', values)
      .then(() => {
        setIsShowingSuccess(true);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <>
      <Head title="Ban Appeals" />
      <DefaultLayout heading="Ban Appeals">
        {isShowingSuccess ? (
          <p>Success!</p>
        ) : (
          <Formik
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            initialValues={{
              understanding: '',
              additionalClarification: '',
              assurance: '',
            }}
          >
            {({ isSubmitting, handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col as="h1" xs={12}>
                    If you don&apos;t konw why you&apos;re removed
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <TextControl
                      name="understanding"
                      label="Do you understand why you were removed? If so, list the reason, otherwise we'll respond to the above email with a clarification on your removal."
                      type="textarea"
                      disabled={isSubmitting}
                    />
                  </Col>
                  <Col xs={12}>
                    <TextControl
                      name="additionalClarification"
                      label="Is there any other background information about the removal that you would like to give us?"
                      type="textarea"
                      disabled={isSubmitting}
                    />
                  </Col>
                  <Col xs={12}>
                    <TextControl
                      name="assurance"
                      label="What have you done to ensure that the above does not happen in the future?"
                      type="textarea"
                      disabled={isSubmitting}
                    />
                  </Col>
                </Row>
                <FormFooterControls xs={12}>
                  <Button type="submit" variant="success">Submit</Button>
                </FormFooterControls>
              </Form>
            )}
          </Formik>
        )}
      </DefaultLayout>
    </>
  );
}
