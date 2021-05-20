/* eslint-disable no-template-curly-in-string */

import { setLocale } from 'yup';

setLocale({
  mixed: {
    required: 'Required',
  },
  string: {
    min: 'Must be at least ${min} characters',
    max: 'Must be no more than ${max} characters',
  },
  number: {
    min: 'Must be value greater than ${min}',
    max: 'Must be value less than ${max}',
  },
});
