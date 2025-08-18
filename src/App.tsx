
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

const queryClient = new QueryClient();

const App = () => {
  console.log('App component loading...');
  const { session, initializing } = useSupabaseAuth();

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Cargando aplicación...
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={session ? <Index /> : <Navigate to="/auth" replace />}
            />
            <Route
              path="/auth"
              element={session ? <Navigate to="/" replace /> : <Auth />}
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
