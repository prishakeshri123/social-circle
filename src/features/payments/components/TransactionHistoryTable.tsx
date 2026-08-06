import { Download, Receipt } from 'lucide-react';
import { Badge, type BadgeProps } from '@/shared/components/ui/Badge';
import { Card } from '@/shared/components/ui/Card';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { en } from '@/shared/constants/locales/en';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { formatDate } from '@/shared/utils/formatDate';
import type { Transaction, TransactionStatus } from '@/types/payment.types';

interface TransactionHistoryTableProps {
  transactions: Transaction[];
  isLoading: boolean;
}

const STATUS_BADGE_VARIANT: Record<TransactionStatus, NonNullable<BadgeProps['variant']>> = {
  success: 'success',
  pending: 'warning',
  failed: 'error',
  refunded: 'secondary',
  partially_refunded: 'secondary',
};

const STATUS_LABEL: Record<TransactionStatus, string> = {
  success: en.payment.txnStatusSuccess,
  pending: en.payment.txnStatusPending,
  failed: en.payment.txnStatusFailed,
  refunded: en.payment.txnStatusRefunded,
  partially_refunded: en.payment.txnStatusPartiallyRefunded,
};

export function TransactionHistoryTable({ transactions, isLoading }: TransactionHistoryTableProps) {
  if (isLoading) {
    return (
      <Card className="divide-y divide-border">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4 p-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        ))}
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <EmptyState icon={Receipt} title={en.payment.noTransactions} />
      </Card>
    );
  }

  return (
    <Card className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wide text-text-muted">
            <th className="px-4 py-3 font-medium">{en.payment.dateColumn}</th>
            <th className="px-4 py-3 font-medium">{en.payment.descriptionColumn}</th>
            <th className="px-4 py-3 font-medium">{en.payment.amountColumn}</th>
            <th className="px-4 py-3 font-medium">{en.payment.statusColumn}</th>
            <th className="px-4 py-3 font-medium">
              <span className="sr-only">{en.payment.downloadReceipt}</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="text-text-primary">
              <td className="whitespace-nowrap px-4 py-3 text-text-secondary">
                {formatDate(transaction.createdAt)}
              </td>
              <td className="px-4 py-3">{transaction.description}</td>
              <td className="whitespace-nowrap px-4 py-3 font-medium">
                {formatCurrency(transaction.amount, transaction.currency)}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <Badge variant={STATUS_BADGE_VARIANT[transaction.status]}>
                  {STATUS_LABEL[transaction.status]}
                </Badge>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right">
                {transaction.invoiceUrl && (
                  <a
                    href={transaction.invoiceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-primary-600 hover:underline"
                    aria-label={en.payment.downloadReceipt}
                  >
                    <Download className="size-4" aria-hidden="true" />
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
