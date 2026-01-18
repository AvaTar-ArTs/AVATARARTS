import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import UserEmailLink from "@/components/admin/UserEmailLink";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

const AdminTransactions = () => {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["admin-transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    },
  });

  // Calculate summary stats
  const summaryStats = transactions ? {
    totalRevenue: transactions
      .filter(t => t.status === 'succeeded')
      .reduce((sum, t) => sum + Number(t.amount_usd), 0),
    totalTransactions: transactions.length,
    successfulTransactions: transactions.filter(t => t.status === 'succeeded').length,
  } : null;

  return (
    <AdminLayout>
      <div className="p-8 space-y-6">
        {/* Summary Cards */}
        {summaryStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card style={{ backgroundColor: '#1c1c1f', borderColor: '#6a6a71' }}>
              <CardHeader className="pb-3">
                <CardDescription>Total Revenue</CardDescription>
                <CardTitle className="text-3xl text-white">
                  ${summaryStats.totalRevenue.toFixed(2)}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card style={{ backgroundColor: '#1c1c1f', borderColor: '#6a6a71' }}>
              <CardHeader className="pb-3">
                <CardDescription>Total Transactions</CardDescription>
                <CardTitle className="text-3xl text-white">
                  {summaryStats.totalTransactions}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card style={{ backgroundColor: '#1c1c1f', borderColor: '#6a6a71' }}>
              <CardHeader className="pb-3">
                <CardDescription>Success Rate</CardDescription>
                <CardTitle className="text-3xl text-white">
                  {summaryStats.totalTransactions > 0
                    ? Math.round((summaryStats.successfulTransactions / summaryStats.totalTransactions) * 100)
                    : 0}%
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        )}

        {/* Transactions Table */}
        <Card style={{ backgroundColor: '#1c1c1f', borderColor: '#6a6a71' }}>
          <CardHeader>
            <CardTitle className="text-white">Transaction Log</CardTitle>
            <CardDescription>
              View all credit purchases and transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow style={{ borderColor: '#6a6a71' }}>
                      <TableHead className="text-white">Date</TableHead>
                      <TableHead className="text-white">User Email</TableHead>
                      <TableHead className="text-white">Type</TableHead>
                      <TableHead className="text-white">Amount</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                      <TableHead className="text-white">Payment Intent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions?.map((transaction) => (
                      <TableRow key={transaction.id} style={{ borderColor: '#6a6a71' }}>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(transaction.created_at), "MMM dd, yyyy HH:mm")}
                        </TableCell>
                        <TableCell>
                          {transaction.user_id ? (
                            <UserEmailLink
                              userId={transaction.user_id}
                              email={transaction.user_email}
                            />
                          ) : (
                            <span className="text-muted-foreground">{transaction.user_email}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{transaction.transaction_type}</Badge>
                        </TableCell>
                        <TableCell className="text-white font-medium">
                          ${Number(transaction.amount_usd).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              transaction.status === 'succeeded'
                                ? 'default'
                                : transaction.status === 'failed'
                                ? 'destructive'
                                : 'secondary'
                            }
                          >
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs font-mono">
                          {transaction.stripe_payment_intent_id
                            ? transaction.stripe_payment_intent_id.substring(0, 20) + "..."
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminTransactions;
