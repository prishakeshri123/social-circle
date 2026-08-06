import { Download, Receipt } from 'lucide-react';
import { Badge, type BadgeProps } from '@/shared/components/ui/Badge';
import { Card, CardHeader, CardTitle } from '@/shared/components/ui/Card';
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

function TableHeader({ count }: { count: number }) {
  return (
    <CardHeader className="flex-row items-center justify-between gap-3 border-b border-border">
      <CardTitle className="text-base font-semibold">
        {en.payment.transactionHistoryTitle}
      </CardTitle>
      {count > 0 && (
        <span className="text-sm text-text-muted">{en.payment.paymentsCount(count)}</span>
      )}
    </CardHeader>
  );
}

export function TransactionHistoryTable({ transactions, isLoading }: TransactionHistoryTableProps) {
  if (isLoading) {
    return (
      <Card>
        <TableHeader count={0} />
        <div className="divide-y divide-border">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-4 p-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <TableHeader count={0} />
        <EmptyState icon={Receipt} title={en.payment.noTransactions} />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <TableHeader count={transactions.length} />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-text-muted">
              <th className="px-6 py-3 font-medium">{en.payment.dateColumn}</th>
              <th className="px-6 py-3 font-medium">{en.payment.descriptionColumn}</th>
              <th className="px-6 py-3 font-medium">{en.payment.amountColumn}</th>
              <th className="px-6 py-3 font-medium">{en.payment.statusColumn}</th>
              <th className="px-6 py-3 font-medium">
                <span className="sr-only">{en.payment.downloadReceipt}</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="text-text-primary transition-colors duration-fast hover:bg-surface"
              >
                <td className="whitespace-nowrap px-6 py-3.5 text-text-secondary">
                  {formatDate(transaction.createdAt)}
                </td>
                <td className="px-6 py-3.5">{transaction.description}</td>
                <td className="whitespace-nowrap px-6 py-3.5 font-semibold tabular-nums">
                  {formatCurrency(transaction.amount, transaction.currency)}
                </td>
                <td className="whitespace-nowrap px-6 py-3.5">
                  <Badge variant={STATUS_BADGE_VARIANT[transaction.status]}>
                    {STATUS_LABEL[transaction.status]}
                  </Badge>
                </td>
                <td className="whitespace-nowrap px-6 py-3.5 text-right">
                  {transaction.invoiceUrl && (
                    <a
                      href={transaction.invoiceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex size-8 items-center justify-center rounded-md text-text-muted transition-colors duration-fast hover:bg-primary-50 hover:text-primary-600"
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
      </div>
    </Card>
  );
}
