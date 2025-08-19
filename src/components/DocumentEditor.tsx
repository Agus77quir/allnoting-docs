import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Code,
  Save,
  ArrowLeft,
  Heading1,
  Heading2,
  Heading3,
  Table,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import TableInsertDialog from './TableInsertDialog';

interface Document {
  id: string;
  title: string;
  content: string;
  is_public: boolean;
  created_by: string;
}

interface DocumentEditorProps {
  document?: Document;
  onSave: (doc: Partial<Document>) => void;
  onBack: () => void;
  currentUser?: string;
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({
  document,
  onSave,
  onBack,
  currentUser = 'usuario_anonimo'
}) => {
  const [title, setTitle] = useState(document?.title || 'Documento Sin Título');
  const [content, setContent] = useState(document?.content || '');
  const [isPublic, setIsPublic] = useState(document?.is_public || false);
  const [isSaving, setIsSaving] = useState(false);
  const [showTableDialog, setShowTableDialog] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setContent(document.content);
      setIsPublic(document.is_public);
    }
  }, [document]);

  const handleSave = async () => {
    let finalTitle = (title || '').trim();
    if (!finalTitle || finalTitle === 'Documento Sin Título') {
      const inputTitle = window.prompt('Escribe el nombre del documento:', finalTitle || '');
      if (!inputTitle || !inputTitle.trim()) {
        toast({
          title: "Título requerido",
          description: "El documento debe tener un nombre antes de guardarse.",
          variant: "destructive",
        });
        return;
      }
      finalTitle = inputTitle.trim();
      setTitle(finalTitle);
    }

    setIsSaving(true);
    
    try {
      const documentData = {
        title: finalTitle,
        content: content,
        is_public: isPublic,
        created_by: currentUser,
      };

      let result;
      
      if (document?.id) {
        result = await supabase
          .from('documents')
          .update(documentData)
          .eq('id', document.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from('documents')
          .insert([documentData])
          .select()
          .single();
      }

      if (result.error) {
        console.error('Error saving document:', result.error);
        toast({
          title: "Error",
          description: "No se pudo guardar el documento",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Documento guardado",
        description: isPublic ? "Guardado como Público" : "Guardado como Privado",
      });

      onSave(result.data);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Error de conexión",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    const newContent = 
      content.substring(0, start) + 
      before + selectedText + after + 
      content.substring(end);
    
    setContent(newContent);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        end + before.length
      );
    }, 0);
  };

  const handleTableInsert = (rows: number, cols: number) => {
    let tableMarkdown = '\n';
    
    // Header row
    tableMarkdown += '|';
    for (let i = 0; i < cols; i++) {
      tableMarkdown += ` Columna ${i + 1} |`;
    }
    tableMarkdown += '\n';
    
    // Separator row
    tableMarkdown += '|';
    for (let i = 0; i < cols; i++) {
      tableMarkdown += ' --- |';
    }
    tableMarkdown += '\n';
    
    // Data rows
    for (let i = 0; i < rows - 1; i++) {
      tableMarkdown += '|';
      for (let j = 0; j < cols; j++) {
        tableMarkdown += ' Celda |';
      }
      tableMarkdown += '\n';
    }
    
    insertText(tableMarkdown);
    setShowTableDialog(false);
  };

  const formatButtons = [
    { icon: Bold, action: () => insertText('**', '**'), tooltip: 'Negrita' },
    { icon: Italic, action: () => insertText('_', '_'), tooltip: 'Cursiva' },
    { icon: Underline, action: () => insertText('<u>', '</u>'), tooltip: 'Subrayado' },
    { icon: Heading1, action: () => insertText('# '), tooltip: 'Título 1' },
    { icon: Heading2, action: () => insertText('## '), tooltip: 'Título 2' },
    { icon: Heading3, action: () => insertText('### '), tooltip: 'Título 3' },
    { icon: List, action: () => insertText('- '), tooltip: 'Lista con viñetas' },
    { icon: ListOrdered, action: () => insertText('1. '), tooltip: 'Lista numerada' },
    { icon: Quote, action: () => insertText('> '), tooltip: 'Cita' },
    { icon: Code, action: () => insertText('`', '`'), tooltip: 'Código' },
    { icon: Table, action: () => setShowTableDialog(true), tooltip: 'Insertar tabla' },
  ];

  const renderPreviewContent = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mb-2">$1</h3>')
      .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic">$1</blockquote>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/^\|(.+)\|$/gm, (match, content) => {
        const cells = content.split('|').map((cell: string) => cell.trim()).filter((cell: string) => cell);
        const isHeaderSeparator = cells.every((cell: string) => cell.match(/^-+$/));
        
        if (isHeaderSeparator) {
          return '';
        }
        
        const cellsHtml = cells.map((cell: string) => `<td class="border border-gray-300 px-2 py-1">${cell}</td>`).join('');
        return `<tr>${cellsHtml}</tr>`;
      })
      .replace(/(<tr>.*<\/tr>)/gm, '<table class="border-collapse border border-gray-300 mb-4">$1</table>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div className="h-6 w-px bg-border" />
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-medium border-0 bg-transparent p-0 focus-visible:ring-0"
              placeholder="Título del documento..."
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="public-switch" className="text-sm">
                Público
              </Label>
              <Switch
                id="public-switch"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-1">
                {formatButtons.map((btn, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={btn.action}
                    title={btn.tooltip}
                  >
                    <btn.icon className="w-4 h-4" />
                  </Button>
                ))}
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Comienza a escribir tu documento..."
                  className="w-full min-h-[500px] resize-none border-0 bg-transparent text-base leading-relaxed focus:outline-none custom-scrollbar"
                />
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="mt-6">
            <CardHeader>
              <h3 className="font-medium">Vista Previa</h3>
            </CardHeader>
            <CardContent>
              <div 
                className="editor-content"
                dangerouslySetInnerHTML={{
                  __html: renderPreviewContent(content)
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <TableInsertDialog
        open={showTableDialog}
        onOpenChange={setShowTableDialog}
        onInsert={handleTableInsert}
      />
    </div>
  );
};

export default DocumentEditor;
