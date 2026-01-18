import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { getUserDetailUrl } from "@/utils/adminNavigation";
import { format } from "date-fns";

const AdminUsers = () => {
  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_user_stats")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <AdminLayout>
      <div className="p-8">
        <Card style={{ backgroundColor: '#1c1c1f', borderColor: '#6a6a71' }}>
          <CardHeader>
            <CardTitle className="text-white">User Management</CardTitle>
            <CardDescription>
              Manage all users and their accounts
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
                      <TableHead className="text-white">Email</TableHead>
                      <TableHead className="text-white">Joined</TableHead>
                      <TableHead className="text-white">Last Login</TableHead>
                      <TableHead className="text-white">Projects</TableHead>
                      <TableHead className="text-white">Storage (MB)</TableHead>
                      <TableHead className="text-white">Credits</TableHead>
                      <TableHead className="text-white">Lifetime Spend</TableHead>
                      <TableHead className="text-white">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users?.map((user) => {
                      const storageInfo = user.storage_info as any;
                      const totalMb = storageInfo?.total_mb || 0;
                      
                      return (
                        <TableRow key={user.id} style={{ borderColor: '#6a6a71' }}>
                          <TableCell>
                            <Link
                              to={getUserDetailUrl(user.id)}
                              className="text-primary hover:underline font-medium"
                            >
                              {user.user_email}
                            </Link>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {format(new Date(user.created_at), "MMM dd, yyyy")}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {user.last_sign_in_at
                              ? format(new Date(user.last_sign_in_at), "MMM dd, HH:mm")
                              : "Never"}
                          </TableCell>
                          <TableCell className="text-white">
                            {user.project_count}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {totalMb.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-white font-medium">
                            {Number(user.credit_balance).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-white font-medium">
                            ${Number(user.lifetime_spend).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Link to={getUserDetailUrl(user.id)}>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      );
                    })}
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

export default AdminUsers;
