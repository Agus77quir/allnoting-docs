import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Edit, Plus, Trash2, User } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import AvatarUpload from '@/components/AvatarUpload';

const ICON_OPTIONS = [
  { value: 'folder', label: '📁 Carpeta' },
  { value: 'bookmark', label: '🔖 Marcador' },
  { value: 'star', label: '⭐ Estrella' },
  { value: 'heart', label: '❤️ Corazón' },
  { value: 'tag', label: '🏷️ Etiqueta' },
  { value: 'briefcase', label: '💼 Trabajo' },
  { value: 'home', label: '🏠 Casa' },
  { value: 'book', label: '📚 Libro' },
];

const COLOR_OPTIONS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
  '#8b5cf6', '#f97316', '#06b6d4', '#84cc16'
];

interface UserProfileCardProps {
  displayName: string;
  email: string;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ displayName, email }) => {
  const { profile, categories, loading, updateProfile, addCategory, updateCategory, deleteCategory } = useUserProfile();
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({ name: '', icon: 'folder', color: '#3b82f6' });
  const [profileData, setProfileData] = useState({
    username: '',
    display_name: '',
    bio: '',
    avatar_url: ''
  });

  React.useEffect(() => {
    if (profile) {
      setProfileData({
        username: profile.username || '',
        display_name: profile.display_name || displayName,
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || ''
      });
    }
  }, [profile, displayName]);

  const handleSaveProfile = async () => {
    await updateProfile(profileData);
    setEditingProfile(false);
  };

  const handleAvatarChange = (url: string) => {
    setProfileData(prev => ({ ...prev, avatar_url: url }));
  };

  const handleAddCategory = async () => {
    if (newCategory.name.trim()) {
      await addCategory(newCategory.name, newCategory.icon, newCategory.color);
      setNewCategory({ name: '', icon: 'folder', color: '#3b82f6' });
    }
  };

  if (loading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-muted rounded-full animate-pulse" />
            <div className="space-y-2">
              <div className="w-24 h-4 bg-muted rounded animate-pulse" />
              <div className="w-32 h-3 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={profile?.avatar_url || ''} />
              <AvatarFallback className="text-lg">
                <User className="w-8 h-8" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-xl">
                {profile?.display_name || displayName}
              </CardTitle>
              {profile?.username && (
                <p className="text-sm text-muted-foreground">@{profile.username}</p>
              )}
              <CardDescription className="text-sm">{email}</CardDescription>
              {profile?.bio && (
                <p className="text-sm mt-1">{profile.bio}</p>
              )}
            </div>
          </div>
          <Dialog open={editingProfile} onOpenChange={setEditingProfile}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <Edit className="w-4 h-4 mr-2" />
                Editar Perfil
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Editar Perfil</DialogTitle>
                <DialogDescription>
                  Personaliza tu información de perfil
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex justify-center">
                  <AvatarUpload
                    currentAvatarUrl={profileData.avatar_url}
                    onAvatarChange={handleAvatarChange}
                    size="lg"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="display_name">Nombre para mostrar</Label>
                    <Input
                      id="display_name"
                      value={profileData.display_name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, display_name: e.target.value }))}
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="username">Nombre de usuario</Label>
                    <Input
                      id="username"
                      value={profileData.username}
                      onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="tunombredeusuario"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Biografía</Label>
                    <Input
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Cuéntanos algo sobre ti..."
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setEditingProfile(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveProfile}>
                    Guardar Cambios
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Mis Categorías</h4>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Categoría
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nueva Categoría</DialogTitle>
                  <DialogDescription>
                    Crea una nueva categoría personalizada
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="category_name">Nombre de la categoría</Label>
                    <Input
                      id="category_name"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nombre de la categoría"
                    />
                  </div>
                  <div>
                    <Label>Icono</Label>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {ICON_OPTIONS.map((icon) => (
                        <Button
                          key={icon.value}
                          variant={newCategory.icon === icon.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => setNewCategory(prev => ({ ...prev, icon: icon.value }))}
                          className="h-12"
                        >
                          {icon.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Color</Label>
                    <div className="flex space-x-2 mt-2">
                      {COLOR_OPTIONS.map((color) => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full border-2 ${
                            newCategory.color === color ? 'border-foreground' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setNewCategory(prev => ({ ...prev, color }))}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setNewCategory({ name: '', icon: 'folder', color: '#3b82f6' })}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddCategory}>
                      Crear Categoría
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant="secondary"
                className="px-3 py-1 cursor-pointer hover:opacity-80"
                style={{ backgroundColor: `${category.color}20`, color: category.color }}
                onClick={() => setEditingCategory(category.id)}
              >
                <span className="mr-2">
                  {ICON_OPTIONS.find(icon => icon.value === category.icon)?.label.split(' ')[0] || '📁'}
                </span>
                {category.name}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCategory(category.id);
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
            {categories.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No tienes categorías aún. Crea una para organizar mejor tus documentos.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
