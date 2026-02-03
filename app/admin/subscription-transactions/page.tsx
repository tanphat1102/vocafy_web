"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, RefreshCw, DollarSign, Calendar } from "lucide-react";
import { subscriptionService, type SubscriptionTransaction } from "@/services";

export default function SubscriptionTransactionsPage() {
  const [transactions, setTransactions] = useState<SubscriptionTransaction[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await subscriptionService.getSubscriptionTransactions(
        page,
        10,
      );
      setTransactions(response.content);
      setTotalPages(response.total_pages);
      setTotalElements(response.total_elements);
    } catch (error) {
      console.error("Failed to fetch subscription transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.note?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DEBIT":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "CREDIT":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Subscription Transactions
          </h1>
          <p className="mt-2 text-muted-foreground">
            View and manage all subscription transaction history
          </p>
        </div>
        <Button
          onClick={fetchTransactions}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 shadow-sm bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Transactions
                </p>
                <p className="mt-2 text-3xl font-bold text-foreground">
                  {totalElements}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Amount
                </p>
                <p className="mt-2 text-3xl font-bold text-foreground">
                  {transactions
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toLocaleString()}
                  đ
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  This Page
                </p>
                <p className="mt-2 text-3xl font-bold text-foreground">
                  {transactions.length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm bg-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by email or note..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-sm bg-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <p className="text-muted-foreground">
                      No transactions found
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-mono text-xs">
                      {transaction.id.substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {transaction.user.email.split("@")[0]}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {transaction.user.id.substring(0, 8)}...
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {transaction.user.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        Method #{transaction.payment_method_id}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {transaction.amount.toLocaleString()}đ
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getStatusColor(transaction.status)}
                        variant="secondary"
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-sm">
                      {transaction.note || "-"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(transaction.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
