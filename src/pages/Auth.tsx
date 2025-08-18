
import React from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from '@/components/LoginForm';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const Auth: React.FC = () => {
  const { user, initializing } = useSupabaseAuth();

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Cargando autenticación...
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <LoginForm
      onLogin={() => {
        // El listener de auth redirigirá automáticamente; este callback es por compatibilidad
        window.location.assign('/');
      }}
    />
  );
};

export default Auth;
