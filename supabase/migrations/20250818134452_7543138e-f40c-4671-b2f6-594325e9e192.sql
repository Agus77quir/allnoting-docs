
-- Crear tabla para documentos
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security para que todos puedan ver documentos públicos
-- y solo el creador pueda ver sus documentos privados
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Política para ver documentos: públicos para todos, privados solo para el creador
CREATE POLICY "Ver documentos públicos y propios" 
  ON public.documents 
  FOR SELECT 
  USING (is_public = true OR created_by = current_setting('request.jwt.claims', true)::json->>'email');

-- Política para crear documentos: cualquiera puede crear
CREATE POLICY "Crear documentos" 
  ON public.documents 
  FOR INSERT 
  WITH CHECK (true);

-- Política para actualizar: documentos públicos para todos, privados solo para el creador
CREATE POLICY "Actualizar documentos públicos y propios" 
  ON public.documents 
  FOR UPDATE 
  USING (is_public = true OR created_by = current_setting('request.jwt.claims', true)::json->>'email');

-- Política para eliminar: solo el creador puede eliminar sus documentos
CREATE POLICY "Eliminar documentos propios" 
  ON public.documents 
  FOR DELETE 
  USING (created_by = current_setting('request.jwt.claims', true)::json->>'email');

-- Función para actualizar el campo updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at cuando se modifica un documento
CREATE TRIGGER update_documents_updated_at 
    BEFORE UPDATE ON public.documents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
