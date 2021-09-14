import { useContext } from 'react';
import PropTypes from 'prop-types';
import { Container, Alert, AlertTitle } from '@material-ui/core';
// context
import { AuthContext } from '../contexts/AuthContext';

// ----------------------------------------------------------------------

RoleBasedGuard.propTypes = {
  accessibleRoles: PropTypes.array, // Example ['admin', 'leader']
  children: PropTypes.node
};

export default function RoleBasedGuard({ accessibleRoles, children }) {
  const currentRole = useContext(AuthContext).userState[0].role;
  console.log(currentRole);
  if (!accessibleRoles.includes(currentRole)) {
    return (
      <Container>
        <Alert severity="error">
          <AlertTitle>Permission Denied</AlertTitle>
          You do not have permission to access this page
        </Alert>
      </Container>
    );
  }

  return <>{children}</>;
}
