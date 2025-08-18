
import React, { useState } from 'react';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import DocumentEditor from '@/components/DocumentEditor';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Document {
  id: string;
  title: string;
  content: string;
  is_public: boolean;
  created_by: string;
}

type ViewType = 'dashboard' | 'editor' | 'viewer';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);

  // Mock user for the app without login
  const mockUser = {
    name: 'Usuario Anónimo',
    email: 'user@example.com'
  };

  const currentUsername = mockUser.name.toLowerCase().replace(' ', '_');

  const handleCreateDocument = () => {
    setCurrentDocument(null);
    setCurrentView('editor');
  };

  const handleViewDocument = async (id: string) => {
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
    setCurrentView('dashboard');
    // The DocumentEditor already shows the success toast
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setCurrentDocument(null);
  };

  if (currentView === 'editor') {
    return (
      <div>
        <Header user={mockUser} />
        <DocumentEditor
          document={currentDocument || undefined}
          onSave={handleSaveDocument}
          onBack={handleBackToDashboard}
          currentUser={currentUsername}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={mockUser} />
      <Dashboard
        onCreateDocument={handleCreateDocument}
        onViewDocument={handleViewDocument}
        onEditDocument={handleEditDocument}
        onDownloadDocument={handleDownloadDocument}
        currentUser={currentUsername}
      />
    </div>
  );
};

export default Index;
