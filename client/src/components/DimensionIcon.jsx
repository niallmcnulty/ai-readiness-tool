import React from 'react';
import { Users, Scale, Server, GraduationCap, BookOpen } from 'lucide-react';

const iconMap = {
  leadership: Users,
  policy: Scale,
  infrastructure: Server,
  capacity: GraduationCap,
  curriculum: BookOpen,
};

export default function DimensionIcon({ dimensionId, size = 24, className = '' }) {
  const Icon = iconMap[dimensionId];
  if (!Icon) return null;
  return <Icon size={size} className={className} />;
}
