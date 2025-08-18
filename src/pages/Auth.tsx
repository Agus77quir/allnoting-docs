
import LoginForm from '@/components/LoginForm';
import Footer from '@/components/Footer';

const Auth = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Bienvenido a WebHaus</h1>
            <p className="text-muted-foreground mt-2">
              Inicia sesión para acceder a tus documentos
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Auth;
