import { CARD_NUMBER_DIGITS } from '@/shared/constants/app.constants';

export function formatCardNumberInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, CARD_NUMBER_DIGITS);
  return (digits.match(/.{1,4}/g) ?? []).join(' ');
}

export function formatCardExpiryInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}
