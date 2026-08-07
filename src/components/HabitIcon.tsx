import React from 'react';
import {
  Sparkles,
  Code,
  Music,
  Footprints,
  Brain,
  Dumbbell,
  BookOpen,
  Droplets,
  Heart,
  Sun,
  Target,
  Flame,
  Smile,
  Coffee,
  Briefcase,
  Pencil,
  Check,
  CircleDot,
  LucideProps
} from 'lucide-react';

interface HabitIconProps extends LucideProps {
  name: string;
}

export const HabitIcon: React.FC<HabitIconProps> = ({ name, ...props }) => {
  switch (name.toLowerCase()) {
    case 'sparkles':
      return <Sparkles {...props} />;
    case 'code':
      return <Code {...props} />;
    case 'music':
      return <Music {...props} />;
    case 'footprints':
      return <Footprints {...props} />;
    case 'brain':
      return <Brain {...props} />;
    case 'dumbbell':
      return <Dumbbell {...props} />;
    case 'book':
      return <BookOpen {...props} />;
    case 'droplets':
      return <Droplets {...props} />;
    case 'heart':
      return <Heart {...props} />;
    case 'sun':
      return <Sun {...props} />;
    case 'target':
      return <Target {...props} />;
    case 'flame':
      return <Flame {...props} />;
    case 'smile':
      return <Smile {...props} />;
    case 'coffee':
      return <Coffee {...props} />;
    case 'briefcase':
      return <Briefcase {...props} />;
    case 'pencil':
      return <Pencil {...props} />;
    case 'check':
      return <Check {...props} />;
    default:
      return <CircleDot {...props} />;
  }
};
