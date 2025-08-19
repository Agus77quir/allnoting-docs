
import LoginForm from '@/components/LoginForm';
import Footer from '@/components/Footer';
import { Navigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const Auth = () => {
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
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Allnoting</h1>
            <p className="text-muted-foreground mt-2">
              Inicia sesión para acceder a tus documentos
            </p>
          </div>
          <LoginForm onLogin={() => window.location.assign('/')} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Auth;
