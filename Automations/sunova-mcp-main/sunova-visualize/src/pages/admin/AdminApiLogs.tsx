import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import UserEmailLink from "@/components/admin/UserEmailLink";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getTasksFilteredByProject } from "@/utils/adminNavigation";
import { format } from "date-fns";

const AdminApiLogs = () => {
  const { data: logs, isLoading } = useQuery({
    queryKey: ["admin-api-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_api_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    },
  });

  return (
    <AdminLayout>
      <div className="p-8">
        <Card style={{ backgroundColor: '#1c1c1f', borderColor: '#6a6a71' }}>
          <CardHeader>
            <CardTitle className="text-white">API Request Logs</CardTitle>
            <CardDescription>
              View all API calls (excluding polling requests)
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
                      <TableHead className="text-white">Timestamp</TableHead>
                      <TableHead className="text-white">User Email</TableHead>
                      <TableHead className="text-white">Project</TableHead>
                      <TableHead className="text-white">API Type</TableHead>
                      <TableHead className="text-white">Endpoint</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                      <TableHead className="text-white">Duration (ms)</TableHead>
                      <TableHead className="text-white">Cost ($)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs?.map((log) => (
                      <TableRow key={log.id} style={{ borderColor: '#6a6a71' }}>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(log.created_at), "MMM dd, HH:mm:ss")}
                        </TableCell>
                        <TableCell>
                          <UserEmailLink
                            userId={log.user_id}
                            email={log.user_email}
                          />
                        </TableCell>
                        <TableCell>
                          {log.project_id && log.project_name ? (
                            <Link
                              to={getTasksFilteredByProject(log.project_id)}
                              className="text-primary hover:underline"
                            >
                              {log.project_name}
                            </Link>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.api_type}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                          {log.endpoint}
                        </TableCell>
                        <TableCell>
                          <Badge variant={log.success ? "default" : "destructive"}>
                            {log.success ? "Success" : "Failed"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {log.duration_ms || "-"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {log.cost_usd ? `$${log.cost_usd.toFixed(4)}` : "-"}
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

export default AdminApiLogs;
