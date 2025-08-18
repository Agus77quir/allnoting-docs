
import React, { useState } from 'react';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import DocumentEditor from '@/components/DocumentEditor';
import { toast } from '@/hooks/use-toast';

interface Document {
  id: string;
  title: string;
  content: string;
  isPublic: boolean;
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

  const handleCreateDocument = () => {
    setCurrentDocument(null);
    setCurrentView('editor');
  };

  const handleViewDocument = (id: string) => {
    // In a real app, fetch document by ID
    console.log('Viewing document:', id);
    toast({
      title: "Document opened",
      description: "Document loaded in view mode",
    });
  };

  const handleEditDocument = (id: string) => {
    // In a real app, fetch document by ID
    const mockDocument: Document = {
      id,
      title: 'Sample Document',
      content: 'This is sample content for editing...',
      isPublic: true
    };
    setCurrentDocument(mockDocument);
    setCurrentView('editor');
  };

  const handleDownloadDocument = (id: string) => {
    // Mock download functionality
    const element = document.createElement('a');
    const file = new Blob(['# Sample Document\n\nThis is the document content...'], 
      { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `document-${id}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Download started",
      description: "Your document is being downloaded",
    });
  };

  const handleSaveDocument = (doc: Partial<Document>) => {
    console.log('Saving document:', doc);
    setCurrentView('dashboard');
    toast({
      title: "Document saved",
      description: "Your changes have been saved successfully",
    });
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
        currentUser={mockUser.name.toLowerCase().replace(' ', '_')}
      />
    </div>
  );
};

export default Index;
