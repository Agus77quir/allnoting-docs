
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, FileText, Users, User } from 'lucide-react';
import DocumentCard from './DocumentCard';

interface Document {
  id: string;
  title: string;
  content: string;
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DashboardProps {
  onCreateDocument: () => void;
  onViewDocument: (id: string) => void;
  onEditDocument: (id: string) => void;
  onDownloadDocument: (id: string) => void;
  currentUser?: string;
}

// Mock data
const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Welcome to Allnoting',
    content: 'This is a public document that everyone can see and edit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    isPublic: true,
    createdBy: 'admin',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    title: 'Project Ideas',
    content: 'My private notes about upcoming project ideas. This document is only visible to me.',
    isPublic: false,
    createdBy: 'john_doe',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-19'),
  },
  {
    id: '3',
    title: 'Team Meeting Notes',
    content: 'Public meeting notes from our weekly team sync. Everyone can contribute and edit these notes.',
    isPublic: true,
    createdBy: 'jane_smith',
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: '4',
    title: 'Personal Journal',
    content: 'My private thoughts and reflections. This is a personal document.',
    isPublic: false,
    createdBy: 'john_doe',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-17'),
  },
];

const Dashboard: React.FC<DashboardProps> = ({
  onCreateDocument,
  onViewDocument,
  onEditDocument,
  onDownloadDocument,
  currentUser = 'john_doe'
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const publicDocuments = mockDocuments.filter(doc => doc.isPublic);
  const myDocuments = mockDocuments.filter(doc => doc.createdBy === currentUser);

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
        No {type} documents yet
      </h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        {type === 'public' 
          ? 'Be the first to create a public document for everyone to see.'
          : 'Create your first document to get started with Allnoting.'
        }
      </p>
      <Button onClick={onCreateDocument}>
        <Plus className="w-4 h-4 mr-2" />
        Create Document
      </Button>
    </div>
  );

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Documents</h1>
          <p className="text-muted-foreground">
            Create, edit, and share documents with the community
          </p>
        </div>
        <Button onClick={onCreateDocument} className="shrink-0">
          <Plus className="w-4 h-4 mr-2" />
          New Document
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search documents..."
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
            Public
          </TabsTrigger>
          <TabsTrigger value="my-docs" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            My Documents
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
                  document={document}
                  onView={onViewDocument}
                  onEdit={onEditDocument}
                  onDownload={onDownloadDocument}
                  currentUser={currentUser}
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
                  document={document}
                  onView={onViewDocument}
                  onEdit={onEditDocument}
                  onDownload={onDownloadDocument}
                  currentUser={currentUser}
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
