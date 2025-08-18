
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Edit, 
  Eye, 
  Calendar,
  User,
  Globe,
  Lock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Document {
  id: string;
  title: string;
  content: string;
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DocumentCardProps {
  document: Document;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDownload: (id: string) => void;
  currentUser?: string;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onView,
  onEdit,
  onDownload,
  currentUser
}) => {
  const canEdit = document.createdBy === currentUser || document.isPublic;
  const previewText = document.content.length > 100 
    ? `${document.content.substring(0, 100)}...`
    : document.content;

  return (
    <Card className="card-hover animate-fade-in group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <h3 className="font-medium truncate">{document.title}</h3>
          </div>
          <Badge variant={document.isPublic ? 'secondary' : 'outline'} className="flex-shrink-0">
            {document.isPublic ? (
              <>
                <Globe className="w-3 h-3 mr-1" />
                Public
              </>
            ) : (
              <>
                <Lock className="w-3 h-3 mr-1" />
                Private
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 pb-4">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {previewText || 'No content yet...'}
        </p>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>{document.createdBy}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>
              Updated {formatDistanceToNow(document.updatedAt, { addSuffix: true })}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <div className="flex items-center gap-2 w-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(document.id)}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>
          
          {canEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(document.id)}
              className="flex-1"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDownload(document.id)}
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DocumentCard;
