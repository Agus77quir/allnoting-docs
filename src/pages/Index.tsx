
import React, { useState } from 'react';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import DocumentEditor from '@/components/DocumentEditor';
import LoginForm from '@/components/LoginForm';
import { toast } from '@/hooks/use-toast';

interface User {
  name: string;
  email: string;
}

interface Document {
  id: string;
  title: string;
  content: string;
  isPublic: boolean;
}

type ViewType = 'login' | 'dashboard' | 'editor' | 'viewer';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('login');
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentView('dashboard');
    toast({
      title: "Welcome!",
      description: `Signed in as ${userData.name}`,
    });
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('login');
    setCurrentDocument(null);
    toast({
      title: "Signed out",
      description: "You have been successfully signed out",
    });
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

  // Render based on current view
  if (currentView === 'login') {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (currentView === 'editor') {
    return (
      <div>
        <Header user={user || undefined} onLogout={handleLogout} />
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
      <Header user={user || undefined} onLogout={handleLogout} />
      <Dashboard
        onCreateDocument={handleCreateDocument}
        onViewDocument={handleViewDocument}
        onEditDocument={handleEditDocument}
        onDownloadDocument={handleDownloadDocument}
        currentUser={user?.name.toLowerCase().replace(' ', '_')}
      />
    </div>
  );
};

export default Index;
