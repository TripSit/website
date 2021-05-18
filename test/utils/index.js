import React, { StrictMode } from 'react';
import PropTypes from 'prop-types';
import { render as rtlRender } from '@testing-library/react';

export * from '@testing-library/react';

function TestWrapper({ children }) {
  return (
    <StrictMode>
      {children}
    </StrictMode>
  );
}

TestWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export function render(ui, options) {
  return rtlRender(ui, { wrapper: TestWrapper, ...options });
}
