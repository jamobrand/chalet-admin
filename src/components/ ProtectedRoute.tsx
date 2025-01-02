import { useAuth } from '@/services/auth/context/use-auth';
import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  requiredRole?: string[];
  requiredModule?: string;
  requiredPermissions?: string[];
  permissionMatch?: 'all' | 'any'; // Add a prop to determine if we need all or any permissions
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  adminOnly = false,
  // requiredRole,
  // requiredModule,
  // requiredPermissions,
  // permissionMatch = 'any', // Default behavior: user needs any of the permissions
}) => {
  // const { user, isAdmin, hasPermission } = useAuth();
  const { user, isAdmin } = useAuth();

  if (user === undefined) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check role authorization
  // if (requiredRole && !requiredRole.includes(user?.role?.name as string)) {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  // if (requiredModule && requiredPermission && !hasPermission(requiredModule, requiredPermission)) {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  // Check module permissions if required
  // if (requiredModule && requiredPermissions) {
  //   const hasRequiredPermissions = requiredPermissions.map((permission) =>
  //     hasPermission(requiredModule, permission),
  //   );

  //   const isAuthorized =
  //     permissionMatch === 'all'
  //       ? hasRequiredPermissions.every(Boolean) // All permissions required
  //       : hasRequiredPermissions.some(Boolean); // Any permission required

  //   if (!isAuthorized) {
  //     return <Navigate to="/unauthorized" replace />;
  //   }
  // }

  return <>{children}</>;
};

export default ProtectedRoute;
