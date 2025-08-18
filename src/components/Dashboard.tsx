
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, FileText, Users, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import DocumentCard from './DocumentCard';

interface Document {
  id: string;
  title: string;
  content: string;
  is_public: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface DashboardProps {
  onCreateDocument: () => void;
  onViewDocument: (id: string) => void;
  onEditDocument: (id: string) => void;
  onDownloadDocument: (id: string) => void;
  currentUser?: string;
}

const Dashboard: React.FC<DashboardProps> = ({
  onCreateDocument,
  onViewDocument,
  onEditDocument,
  onDownloadDocument,
  currentUser = 'usuario_anonimo'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los documentos",
          variant: "destructive",
        });
        return;
      }

      setDocuments(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Error de conexión",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const publicDocuments = documents.filter(doc => doc.is_public);
  const myDocuments = documents.filter(doc => doc.created_by === currentUser);

  const filterDocuments = (documents: Document[]) => {
    if (!searchQuery) return documents;
    return documents.filter(doc =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const EmptyState: React.FC<{ type: string }> = ({ type }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <FileText className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">
        {type === 'public' ? 'No hay documentos públicos aún' : 'No tienes documentos aún'}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        {type === 'public' 
          ? 'Sé el primero en crear un documento público para que todos lo vean.'
          : 'Crea tu primer documento para empezar con Allnoting.'
        }
      </p>
      <Button onClick={onCreateDocument}>
        <Plus className="w-4 h-4 mr-2" />
        Crear Documento
      </Button>
    </div>
  );

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando documentos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tus Documentos</h1>
          <p className="text-muted-foreground">
            Crea, edita y comparte documentos con la comunidad
          </p>
        </div>
        <Button onClick={onCreateDocument} className="shrink-0">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Documento
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar documentos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="public" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="public" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Públicos
          </TabsTrigger>
          <TabsTrigger value="my-docs" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Mis Documentos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="public" className="mt-6">
          {filterDocuments(publicDocuments).length === 0 ? (
            <EmptyState type="public" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterDocuments(publicDocuments).map((document) => (
                <DocumentCard
                  key={document.id}
                  document={{
                    ...document,
                    isPublic: document.is_public,
                    createdBy: document.created_by,
                    createdAt: new Date(document.created_at),
                    updatedAt: new Date(document.updated_at)
                  }}
                  onView={onViewDocument}
                  onEdit={onEditDocument}
                  onDownload={onDownloadDocument}
                  currentUser={currentUser}
                  onRefresh={fetchDocuments}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-docs" className="mt-6">
          {filterDocuments(myDocuments).length === 0 ? (
            <EmptyState type="personal" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterDocuments(myDocuments).map((document) => (
                <DocumentCard
                  key={document.id}
                  document={{
                    ...document,
                    isPublic: document.is_public,
                    createdBy: document.created_by,
                    createdAt: new Date(document.created_at),
                    updatedAt: new Date(document.updated_at)
                  }}
                  onView={onViewDocument}
                  onEdit={onEditDocument}
                  onDownload={onDownloadDocument}
                  currentUser={currentUser}
                  onRefresh={fetchDocuments}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
