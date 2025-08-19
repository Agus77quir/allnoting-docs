
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AvatarUpload from '@/components/AvatarUpload';

interface ProfileData {
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string;
}

interface ProfileEditFormProps {
  profileData: ProfileData;
  setProfileData: (data: ProfileData | ((prev: ProfileData) => ProfileData)) => void;
  onSave: () => void;
  onCancel: () => void;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  profileData,
  setProfileData,
  onSave,
  onCancel
}) => {
  const handleAvatarChange = (url: string) => {
    setProfileData(prev => ({ ...prev, avatar_url: url }));
  };

  return (
    <div className="space-y-6 p-4 sm:p-0">
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
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={onSave}>
          Guardar Cambios
        </Button>
      </div>
    </div>
  );
};

export default ProfileEditForm;
