import React from "react";
import { Upload } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { BACKEND_URL } from "@/lib/api";

const AvatarUpload: React.FC = () => {
  const { token, user, refreshUser } = useAuth();
  const { toast } = useToast();

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const formData = new FormData();
      formData.append("avatar", files[0]);

      const res = await fetch(`${BACKEND_URL}/api/users/${user.id}/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(
          json.message || "Erreur lors du téléchargement de l'avatar",
        );
      }
      toast({
        title: "Avatar mis à jour",
        description: "Votre avatar a été modifié avec succès.",
      });
      refreshUser();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description:
          error instanceof Error
            ? error.message
            : "Erreur lors du téléchargement de l'avatar",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        id="avatar-upload"
        className="hidden"
        accept="image/*"
        onChange={handleAvatarUpload}
      />
      <label
        htmlFor="avatar-upload"
        className="absolute bottom-4 right-0 bg-white rounded-full p-1 shadow cursor-pointer"
      >
        <Upload className="w-4 h-4 text-orange-500" />
      </label>
    </div>
  );
};

export default AvatarUpload;
