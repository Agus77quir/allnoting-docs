
import React, { useState } from 'react';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import DocumentEditor from '@/components/DocumentEditor';
import Footer from '@/components/Footer';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

interface Document {
  id: string;
  title: string;
  content: string;
  is_public: boolean;
  created_by: string;
}

type ViewType = 'dashboard' | 'editor' | 'viewer';

const Index = () => {
  const { session, user } = useSupabaseAuth();
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Forzar refresco del Dashboard

  const displayName =
    (user?.user_metadata as any)?.name ||
    user?.email?.split('@')[0] ||
    'Usuario';

  const currentUserId = user?.id || 'usuario_anonimo';

  console.log('Index component mounted. Current view:', currentView);

  const handleCreateDocument = () => {
    console.log('Creating new document...');
    setCurrentDocument(null);
    setCurrentView('editor');
  };

  const handleViewDocument = async (id: string) => {
    console.log('Viewing document with id:', id);
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching document:', error);
        toast({
          title: "Error",
          description: "No se pudo cargar el documento",
          variant: "destructive",
        });
        return;
      }

      // Create a simple viewer (for now just show a toast)
      toast({
        title: "Documento abierto",
        description: `Visualizando: ${data.title}`,
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Error de conexión",
        variant: "destructive",
      });
    }
  };

  const handleEditDocument = async (id: string) => {
    console.log('Editing document with id:', id);
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching document:', error);
        toast({
          title: "Error",
          description: "No se pudo cargar el documento para editar",
          variant: "destructive",
        });
        return;
      }

      setCurrentDocument(data);
      setCurrentView('editor');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Error de conexión",
        variant: "destructive",
      });
    }
  };

  const handleDownloadDocument = async (id: string) => {
    console.log('Downloading document with id:', id);
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching document:', error);
        toast({
          title: "Error",
          description: "No se pudo descargar el documento",
          variant: "destructive",
        });
        return;
      }

      // Create and download the file
      const content = `# ${data.title}\n\n${data.content}`;
      const element = document.createElement('a');
      const file = new Blob([content], { type: 'text/markdown' });
      element.href = URL.createObjectURL(file);
      element.download = `${data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast({
        title: "Descarga iniciada",
        description: "Tu documento se está descargando",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Error de conexión",
        variant: "destructive",
      });
    }
  };

  const handleSaveDocument = (doc: Partial<Document>) => {
    console.log('Document saved:', doc);
    // Forzar re-montaje del Dashboard para que recargue datos
    setRefreshKey((k) => k + 1);
    setCurrentView('dashboard');
    // The DocumentEditor already shows the success toast
  };

  const handleBackToDashboard = () => {
    console.log('Going back to dashboard...');
    setCurrentView('dashboard');
    setCurrentDocument(null);
  };

  console.log('Rendering Index component with view:', currentView);

  if (currentView === 'editor') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header user={{ name: displayName, email: user?.email || '' }} />
        <DocumentEditor
          document={currentDocument || undefined}
          onSave={handleSaveDocument}
          onBack={handleBackToDashboard}
          currentUser={currentUserId}
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header user={{ name: displayName, email: user?.email || '' }} />
      <Dashboard
        key={refreshKey} // re-monta para refrescar lista y estado Público/Privado
        onCreateDocument={handleCreateDocument}
        onViewDocument={handleViewDocument}
        onEditDocument={handleEditDocument}
        onDownloadDocument={handleDownloadDocument}
        currentUser={currentUserId}
      />
      <Footer />
    </div>
  );
};

export default Index;
