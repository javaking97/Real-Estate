import { ActionButton } from '@/components/ui/ActionButton';

type EmptyResultProps = {
  title: string;
  description: string;
  onReset: () => void;
  buttonLabel?: string;
  className?: string;
};

export function EmptyResult({ title, description, onReset, buttonLabel = '필터 초기화', className }: EmptyResultProps) {
  return (
    <div className={`empty-result-state${className ? ` ${className}` : ''}`}>
      <strong>{title}</strong>
      <span>{description}</span>
      <ActionButton variant="secondary" size="sm" onClick={onReset}>{buttonLabel}</ActionButton>
    </div>
  );
}
