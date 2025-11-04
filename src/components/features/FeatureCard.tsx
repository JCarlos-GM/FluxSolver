import React from 'react';
import { Card } from '../common/Card';
import { Icons, type IconName } from '../../icons';

interface FeatureCardProps {
  icon: IconName;
  iconColor?: string;
  iconBgColor?: string;
  title: string;
  description: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  iconColor = 'text-primary',
  iconBgColor = 'bg-primary/10',
  title,
  description,
}) => {
  const Icon = Icons[icon];

  return (
    <Card hover padding="lg" className="h-full">
      <div className={`${iconBgColor} w-16 h-16 rounded-xl flex items-center justify-center mb-4`}>
        <Icon className={iconColor} size={32} />
      </div>
      <h3 className="text-xl font-semibold text-text-primary mb-3">{title}</h3>
      <p className="text-text-secondary leading-relaxed">{description}</p>
    </Card>
  );
};