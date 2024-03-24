'use client';

import PropTypes from 'prop-types';

import MainLayout from "../../layouts/main";
import {AuthGuard} from "../../auth/guard";

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return (
      <AuthGuard>
        <MainLayout>{children}</MainLayout>
      </AuthGuard>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};
