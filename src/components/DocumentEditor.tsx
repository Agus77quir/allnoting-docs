
import React, { useState, useRef } from 'react';
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
  Type,
  Heading1,
  Heading2,
  Heading3,
} from 'lucide-react';

interface Document {
  id: string;
  title: string;
  content: string;
  isPublic: boolean;
}

interface DocumentEditorProps {
  document?: Document;
  onSave: (doc: Partial<Document>) => void;
  onBack: () => void;
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({
  document,
  onSave,
  onBack
}) => {
  const [title, setTitle] = useState(document?.title || 'Untitled Document');
  const [content, setContent] = useState(document?.content || '');
  const [isPublic, setIsPublic] = useState(document?.isPublic || false);
  const [isSaving, setIsSaving] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate save
    onSave({
      id: document?.id,
      title,
      content,
      isPublic
    });
    setIsSaving(false);
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
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        end + before.length
      );
    }, 0);
  };

  const formatButtons = [
    { icon: Bold, action: () => insertText('**', '**'), tooltip: 'Bold' },
    { icon: Italic, action: () => insertText('_', '_'), tooltip: 'Italic' },
    { icon: Underline, action: () => insertText('<u>', '</u>'), tooltip: 'Underline' },
    { icon: Heading1, action: () => insertText('# '), tooltip: 'Heading 1' },
    { icon: Heading2, action: () => insertText('## '), tooltip: 'Heading 2' },
    { icon: Heading3, action: () => insertText('### '), tooltip: 'Heading 3' },
    { icon: List, action: () => insertText('- '), tooltip: 'Bullet List' },
    { icon: ListOrdered, action: () => insertText('1. '), tooltip: 'Numbered List' },
    { icon: Quote, action: () => insertText('> '), tooltip: 'Quote' },
    { icon: Code, action: () => insertText('`', '`'), tooltip: 'Code' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="h-6 w-px bg-border" />
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-medium border-0 bg-transparent p-0 focus-visible:ring-0"
              placeholder="Document title..."
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="public-switch" className="text-sm">
                Public
              </Label>
              <Switch
                id="public-switch"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
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
                  placeholder="Start writing your document..."
                  className="w-full min-h-[500px] resize-none border-0 bg-transparent text-base leading-relaxed focus:outline-none custom-scrollbar"
                />
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="mt-6">
            <CardHeader>
              <h3 className="font-medium">Preview</h3>
            </CardHeader>
            <CardContent>
              <div 
                className="editor-content"
                dangerouslySetInnerHTML={{
                  __html: content
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/_(.*?)_/g, '<em>$1</em>')
                    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
                    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                    .replace(/^- (.*$)/gm, '<li>$1</li>')
                    .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
                    .replace(/`(.*?)`/g, '<code>$1</code>')
                    .replace(/\n/g, '<br>')
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;
