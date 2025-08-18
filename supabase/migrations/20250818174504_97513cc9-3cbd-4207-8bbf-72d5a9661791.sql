
-- Asegurar que la tabla exista (no hará nada si ya existe)
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas anteriores (restrictivas)
DROP POLICY IF EXISTS "Ver documentos públicos y propios" ON public.documents;
DROP POLICY IF EXISTS "Crear documentos" ON public.documents;
DROP POLICY IF EXISTS "Actualizar documentos públicos y propios" ON public.documents;
DROP POLICY IF EXISTS "Eliminar documentos propios" ON public.documents;

-- Políticas permisivas para uso sin autenticación
CREATE POLICY "Public can select documents"
  ON public.documents
  FOR SELECT
  USING (true);

CREATE POLICY "Public can insert documents"
  ON public.documents
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can update documents"
  ON public.documents
  FOR UPDATE
  USING (true);

CREATE POLICY "Public can delete documents"
  ON public.documents
  FOR DELETE
  USING (true);

-- Función ya existe en tu proyecto: public.update_updated_at_column()
-- Asegurar el trigger para mantener updated_at
DROP TRIGGER IF EXISTS update_documents_updated_at ON public.documents;

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
