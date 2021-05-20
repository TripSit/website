import React, { StrictMode } from 'react';
import PropTypes from 'prop-types';
import { render as rtlRender } from '@testing-library/react';
import '../../yup-locales';
import Notifications from '../../components/notifications';

export * from '@testing-library/react';

function TestWrapper({ children }) {
  return (
    <StrictMode>
      <Notifications>
        {children}
      </Notifications>
    </StrictMode>
  );
}

TestWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export function render(ui, options) {
  return rtlRender(ui, { wrapper: TestWrapper, ...options });
}
