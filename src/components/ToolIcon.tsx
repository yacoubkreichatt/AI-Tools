import React from 'react';
import {
  Video,
  Instagram,
  Youtube,
  Briefcase,
  Image,
  Hash,
  Sparkles,
  Megaphone,
  FileText,
  Mail,
  Search,
  Share2,
  Wand2,
  Layers,
  type LucideProps,
} from 'lucide-react';

interface ToolIconProps extends LucideProps {
  name: string;
}

export const ToolIcon: React.FC<ToolIconProps> = ({ name, ...props }) => {
  switch (name.toLowerCase()) {
    case 'video':
      return <Video {...props} />;
    case 'instagram':
      return <Instagram {...props} />;
    case 'youtube':
      return <Youtube {...props} />;
    case 'briefcase':
      return <Briefcase {...props} />;
    case 'image':
      return <Image {...props} />;
    case 'hash':
      return <Hash {...props} />;
    case 'sparkles':
      return <Sparkles {...props} />;
    case 'megaphone':
      return <Megaphone {...props} />;
    case 'filetext':
      return <FileText {...props} />;
    case 'mail':
      return <Mail {...props} />;
    case 'search':
      return <Search {...props} />;
    case 'share2':
      return <Share2 {...props} />;
    case 'layers':
      return <Layers {...props} />;
    default:
      return <Wand2 {...props} />;
  }
};
