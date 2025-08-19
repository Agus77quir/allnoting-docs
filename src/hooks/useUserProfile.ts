
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
}

interface UserCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [categories, setCategories] = useState<UserCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchCategories();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_categories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }

      setCategories(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id,
          ...updates,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error",
          description: "No se pudo actualizar el perfil",
          variant: "destructive",
        });
        return;
      }

      await fetchProfile();
      toast({
        title: "Perfil actualizado",
        description: "Los cambios se han guardado correctamente",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Error de conexión",
        variant: "destructive",
      });
    }
  };

  const addCategory = async (name: string, icon: string = 'folder', color: string = '#3b82f6') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_categories')
        .insert({
          user_id: user.id,
          name,
          icon,
          color
        });

      if (error) {
        console.error('Error adding category:', error);
        toast({
          title: "Error",
          description: "No se pudo crear la categoría",
          variant: "destructive",
        });
        return;
      }

      await fetchCategories();
      toast({
        title: "Categoría creada",
        description: `Se ha creado la categoría "${name}"`,
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateCategory = async (id: string, updates: Partial<UserCategory>) => {
    try {
      const { error } = await supabase
        .from('user_categories')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating category:', error);
        toast({
          title: "Error",
          description: "No se pudo actualizar la categoría",
          variant: "destructive",
        });
        return;
      }

      await fetchCategories();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_categories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting category:', error);
        toast({
          title: "Error",
          description: "No se pudo eliminar la categoría",
          variant: "destructive",
        });
        return;
      }

      await fetchCategories();
      toast({
        title: "Categoría eliminada",
        description: "La categoría se ha eliminado correctamente",
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return {
    profile,
    categories,
    loading,
    updateProfile,
    addCategory,
    updateCategory,
    deleteCategory,
    refreshProfile: fetchProfile,
    refreshCategories: fetchCategories,
  };
}
