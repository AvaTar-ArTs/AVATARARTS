import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import UserEmailLink from "@/components/admin/UserEmailLink";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Loader2, RefreshCw, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { getProjectStoryboardUrl } from "@/utils/adminNavigation";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const AdminTasks = () => {
  const [searchParams] = useSearchParams();
  const projectFilter = searchParams.get("project");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);
  const [recoveryResults, setRecoveryResults] = useState<any>(null);

  const { data: tasks, isLoading, refetch } = useQuery({
    queryKey: ["admin-tasks", projectFilter],
    queryFn: async () => {
      let query = supabase
        .from("generation_tasks")
        .select(`
          *,
          projects (
            name,
            user_id,
            user_profiles (
              user_email
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (projectFilter) {
        query = query.eq("project_id", projectFilter);
      }

      const { data, error } = await query.limit(100);

      if (error) throw error;
      return data;
    },
  });

  const recoveryMutation = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await supabase.functions.invoke('admin-recover-tasks', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: (data) => {
      setRecoveryResults(data);
      setShowRecoveryDialog(true);
      queryClient.invalidateQueries({ queryKey: ["admin-tasks"] });
      
      toast({
        title: "Recovery Complete",
        description: `Recovered ${data.recovered} tasks, ${data.failed} failed`,
      });
    },
    onError: (error: any) => {
      console.error("Error recovering tasks:", error);
      toast({
        variant: "destructive",
        title: "Recovery Failed",
        description: error.message || "Failed to recover tasks. Please try again.",
      });
    },
  });

  const handleRecoverTasks = () => {
    if (confirm('This will check all pending/timeout tasks with Segmind. Continue?')) {
      recoveryMutation.mutate();
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      completed: "default",
      pending: "secondary",
      failed: "destructive",
      timeout: "outline",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <Card style={{ backgroundColor: '#1c1c1f', borderColor: '#6a6a71' }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Generation Tasks</CardTitle>
                <CardDescription>
                  Monitor and manage all generation tasks
                </CardDescription>
              </div>
              <Button
                onClick={handleRecoverTasks}
                disabled={recoveryMutation.isPending}
              >
                {recoveryMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Recover Outstanding Tasks
              </Button>
            </div>
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
                      <TableHead className="text-white">Created</TableHead>
                      <TableHead className="text-white">User</TableHead>
                      <TableHead className="text-white">Project</TableHead>
                      <TableHead className="text-white">Scene/Shot</TableHead>
                      <TableHead className="text-white">Type</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                      <TableHead className="text-white">Retrieved</TableHead>
                      <TableHead className="text-white">Request ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks?.map((task: any) => (
                      <TableRow key={task.id} style={{ borderColor: '#6a6a71' }}>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(task.created_at), "MMM dd, HH:mm")}
                        </TableCell>
                        <TableCell>
                          <UserEmailLink
                            userId={task.projects?.user_id}
                            email={task.projects?.user_profiles?.user_email || "Unknown"}
                          />
                        </TableCell>
                        <TableCell>
                          <Link
                            to={getProjectStoryboardUrl(task.project_id)}
                            className="text-primary hover:underline"
                          >
                            {task.projects?.name || "Unnamed"}
                          </Link>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {task.scene_id}/{task.shot_id}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{task.generation_type}</Badge>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(task.status)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={task.retrieved ? "default" : "secondary"}>
                            {task.retrieved ? "✓" : "✗"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs font-mono">
                          {task.request_id?.substring(0, 8)}...
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recovery Results Dialog */}
        <Dialog open={showRecoveryDialog} onOpenChange={setShowRecoveryDialog}>
          <DialogContent className="max-w-2xl" style={{ backgroundColor: '#1c1c1f', borderColor: '#6a6a71' }}>
            <DialogHeader>
              <DialogTitle className="text-white">Recovery Results</DialogTitle>
              <DialogDescription>
                Task recovery operation completed
              </DialogDescription>
            </DialogHeader>
            
            {recoveryResults && (
              <div className="space-y-4">
                {/* Summary */}
                <div className="grid grid-cols-3 gap-4">
                  <Card style={{ backgroundColor: '#2a2a2f', borderColor: '#6a6a71' }}>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">{recoveryResults.total}</p>
                        <p className="text-xs text-muted-foreground">Total Checked</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card style={{ backgroundColor: '#2a2a2f', borderColor: '#6a6a71' }}>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-500">{recoveryResults.recovered}</p>
                        <p className="text-xs text-muted-foreground">Recovered</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card style={{ backgroundColor: '#2a2a2f', borderColor: '#6a6a71' }}>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-500">{recoveryResults.failed}</p>
                        <p className="text-xs text-muted-foreground">Failed</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Details */}
                <div className="max-h-96 overflow-y-auto">
                  <div className="space-y-2">
                    {recoveryResults.details?.map((detail: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded"
                        style={{ backgroundColor: '#2a2a2f' }}
                      >
                        <div className="flex items-center gap-3">
                          {detail.status === 'recovered' && (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          )}
                          {(detail.status === 'failed' || detail.status === 'error' || detail.status === 'poll_failed') && (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                          {detail.status === 'still_pending' && (
                            <Clock className="h-5 w-5 text-yellow-500" />
                          )}
                          
                          <div>
                            <p className="text-sm text-white font-mono">
                              {detail.request_id.substring(0, 12)}...
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {detail.status}
                            </p>
                          </div>
                        </div>
                        
                        {detail.error && (
                          <p className="text-xs text-red-400">{detail.error}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => setShowRecoveryDialog(false)}
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminTasks;
