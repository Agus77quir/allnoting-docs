
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
      .replace(/^# (.*$)/gm, '<h1 class="text-xl sm:text-2xl font-bold mb-4 break-words">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-lg sm:text-xl font-semibold mb-3 break-words">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-base sm:text-lg font-medium mb-2 break-words">$1</h3>')
      .replace(/^- (.*$)/gm, '<li class="ml-4 break-words">• $1</li>')
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-border pl-4 italic break-words">$1</blockquote>')
      .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm break-all">$1</code>')
      .replace(/^\|(.+)\|$/gm, (match, content) => {
        const cells = content.split('|').map((cell: string) => cell.trim()).filter((cell: string) => cell);
        const isHeaderSeparator = cells.every((cell: string) => cell.match(/^-+$/));
        
        if (isHeaderSeparator) {
          return '';
        }
        
        const cellsHtml = cells.map((cell: string) => `<td class="border border-border px-2 py-1 break-words text-xs sm:text-sm">${cell}</td>`).join('');
        return `<tr>${cellsHtml}</tr>`;
      })
      .replace(/(<tr>.*<\/tr>)/gm, '<table class="w-full border-collapse border border-border mb-4 overflow-x-auto">$1</table>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-auto sm:h-16 items-center justify-between p-4 sm:p-6 flex-col sm:flex-row gap-4 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <Button variant="ghost" onClick={onBack} className="shrink-0">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Volver</span>
            </Button>
            <div className="hidden sm:block h-6 w-px bg-border" />
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-sm sm:text-lg font-medium border-0 bg-transparent p-0 focus-visible:ring-0 min-w-0 flex-1"
              placeholder="Título del documento..."
            />
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-2">
              <Label htmlFor="public-switch" className="text-xs sm:text-sm whitespace-nowrap">
                Público
              </Label>
              <Switch
                id="public-switch"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>
            <Button onClick={handleSave} disabled={isSaving} className="text-xs sm:text-sm">
              <Save className="w-4 h-4 mr-1 sm:mr-2" />
              {isSaving ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-4 sm:py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-wrap items-center gap-1 overflow-x-auto">
                {formatButtons.map((btn, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={btn.action}
                    title={btn.tooltip}
                    className="shrink-0 h-8 w-8 sm:h-10 sm:w-10 p-1 sm:p-2"
                  >
                    <btn.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                ))}
              </div>
            </CardHeader>
            
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Comienza a escribir tu documento..."
                  className="w-full min-h-[300px] sm:min-h-[500px] resize-none border-0 bg-transparent text-sm sm:text-base leading-relaxed focus:outline-none custom-scrollbar break-words"
                />
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="mt-4 sm:mt-6">
            <CardHeader className="pb-4">
              <h3 className="font-medium text-sm sm:text-base">Vista Previa</h3>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div 
                className="editor-content overflow-hidden break-words"
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
