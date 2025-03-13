import Image from "next/image";
import { Building, User as UserIcon } from "lucide-react";

interface UserInfo {
  userType?: string;
  avatar?: string | null;
  companyLogo?: string | null;
  companyName?: string;
  firstName?: string;
  lastName?: string;
}

interface Props {
  user?: UserInfo;
  size?: number;
}

export default function UserImage({ user, size = 48 }: Props) {
  if (!user) {
    return (
      <div
        className={`w-${size / 4} h-${size / 4} rounded-lg bg-gray-200 flex items-center justify-center`}
      >
        <UserIcon className={`w-${size / 4} h-${size / 4} text-gray-500`} />
      </div>
    );
  }

  const imageSrc =
    user.userType?.toLowerCase() === "entreprise"
      ? user.companyLogo
      : user.avatar;

  const imageAlt =
    user.userType?.toLowerCase() === "entreprise"
      ? user.companyName || "Entreprise"
      : `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        "Utilisateur";

  return (
    <div
      className={`w-${size / 4} h-${size / 4} rounded-lg overflow-hidden flex-shrink-0 bg-gray-200 flex items-center justify-center mr-4`}
    >
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={size}
          height={size}
          className="object-cover"
        />
      ) : user.userType?.toLowerCase() === "entreprise" ? (
        <Building className={`w-${size / 8} h-${size / 4} text-gray-500`} />
      ) : (
        <UserIcon className={`w-${size / 4} h-${size / 4} text-gray-500`} />
      )}
    </div>
  );
}
