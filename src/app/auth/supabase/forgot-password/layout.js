'use client';

import PropTypes from 'prop-types';

import AuthModernLayout from "../../../../layouts/auth/modern";

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return <AuthModernLayout>{children}</AuthModernLayout>;
}

Layout.propTypes = {
  children: PropTypes.node,
};
