import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Settings, CheckCircle, XCircle, Loader2, DollarSign, TrendingUp, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BetaApplication {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  contribution_amount: number;
  why_perfect_tester: string;
  status: string;
  created_at: string;
  invite_code: string | null;
}

const AdminBetaApplications = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    applicationId: string;
    action: "approve" | "deny";
    applicantName: string;
  }>({ open: false, applicationId: "", action: "approve", applicantName: "" });

  const [approvedTemplate, setApprovedTemplate] = useState({
    subject: "",
    html: "",
  });
  const [deniedTemplate, setDeniedTemplate] = useState({
    subject: "",
    html: "",
  });

  // Fetch applications
  const { data: applications, isLoading } = useQuery({
    queryKey: ["beta-applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("beta_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as BetaApplication[];
    },
  });

  // Fetch email templates
  const { data: templates } = useQuery({
    queryKey: ["beta-email-templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_settings")
        .select("*")
        .in("setting_key", [
          "beta_approved_email_template",
          "beta_denied_email_template",
        ]);

      if (error) throw error;

      const approved = data.find(
        (s) => s.setting_key === "beta_approved_email_template"
      );
      const denied = data.find(
        (s) => s.setting_key === "beta_denied_email_template"
      );

      setApprovedTemplate(
        approved ? (approved.setting_value as any) : { subject: "", html: "" }
      );
      setDeniedTemplate(
        denied ? (denied.setting_value as any) : { subject: "", html: "" }
      );

      return data;
    },
  });

  // Check if user has signed up
  const { data: signedUpEmails } = useQuery({
    queryKey: ["signed-up-beta-users"],
    queryFn: async () => {
      const approvedApps = applications?.filter((a) => a.status === "approved") || [];
      const emails = approvedApps.map((a) => a.email);

      if (emails.length === 0) return [];

      const { data, error } = await supabase
        .from("user_profiles")
        .select("user_email")
        .in("user_email", emails);

      if (error) throw error;
      return data.map((u) => u.user_email);
    },
    enabled: !!applications,
  });

  // Update templates mutation
  const updateTemplatesMutation = useMutation({
    mutationFn: async () => {
      const updates = [
        {
          setting_key: "beta_approved_email_template",
          setting_value: approvedTemplate,
        },
        {
          setting_key: "beta_denied_email_template",
          setting_value: deniedTemplate,
        },
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from("admin_settings")
          .update({ setting_value: update.setting_value })
          .eq("setting_key", update.setting_key);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beta-email-templates"] });
      toast({
        title: "Templates Updated",
        description: "Email templates have been saved successfully.",
      });
      setSettingsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Process application mutation
  const processApplicationMutation = useMutation({
    mutationFn: async ({
      applicationId,
      action,
    }: {
      applicationId: string;
      action: "approve" | "deny";
    }) => {
      const { data, error } = await supabase.functions.invoke(
        "process-beta-application",
        {
          body: { applicationId, action },
        }
      );

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["beta-applications"] });
      queryClient.invalidateQueries({ queryKey: ["signed-up-beta-users"] });
      toast({
        title: `Application ${variables.action === "approve" ? "Approved" : "Denied"}`,
        description: `Email sent successfully to applicant.`,
      });
      setConfirmDialog({ ...confirmDialog, open: false });
    },
    onError: (error) => {
      toast({
        title: "Processing Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleProcessApplication = (
    applicationId: string,
    action: "approve" | "deny",
    applicantName: string
  ) => {
    setConfirmDialog({
      open: true,
      applicationId,
      action,
      applicantName,
    });
  };

  const confirmProcess = () => {
    processApplicationMutation.mutate({
      applicationId: confirmDialog.applicationId,
      action: confirmDialog.action,
    });
  };

  const hasSignedUp = (email: string) => {
    return signedUpEmails?.includes(email) || false;
  };

  // Calculate statistics
  const stats = {
    totalPledged: applications?.reduce((sum, app) => sum + app.contribution_amount, 0) || 0,
    approvedPledged: applications?.filter(app => app.status === "approved").reduce((sum, app) => sum + app.contribution_amount, 0) || 0,
    pendingPledged: applications?.filter(app => app.status === "pending").reduce((sum, app) => sum + app.contribution_amount, 0) || 0,
    pendingCount: applications?.filter(app => app.status === "pending").length || 0,
    approvedCount: applications?.filter(app => app.status === "approved").length || 0,
    deniedCount: applications?.filter(app => app.status === "denied").length || 0,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Beta Applications
            </h1>
            <p className="text-muted-foreground">
              Manage beta tester applications
            </p>
          </div>
          <Button
            onClick={() => setSettingsOpen(true)}
            variant="outline"
            size="icon"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card style={{ backgroundColor: "#1c1c1f", borderColor: "#6a6a71" }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Pledged</p>
                  <p className="text-3xl font-bold text-white">
                    ${stats.totalPledged.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: "#1c1c1f", borderColor: "#6a6a71" }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approved Pledged</p>
                  <p className="text-3xl font-bold text-green-400">
                    ${stats.approvedPledged.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.approvedCount} application{stats.approvedCount !== 1 ? 's' : ''}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: "#1c1c1f", borderColor: "#6a6a71" }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Pledged</p>
                  <p className="text-3xl font-bold text-yellow-400">
                    ${stats.pendingPledged.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.pendingCount} application{stats.pendingCount !== 1 ? 's' : ''}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card style={{ backgroundColor: "#1c1c1f", borderColor: "#6a6a71" }}>
          <CardHeader>
            <CardTitle className="text-white">Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-white">Name</TableHead>
                    <TableHead className="text-white">Email</TableHead>
                    <TableHead className="text-white">Amount</TableHead>
                    <TableHead className="text-white">Reason</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                    <TableHead className="text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications?.map((app) => (
                    <TableRow
                      key={app.id}
                      className={
                        app.status === "approved" && hasSignedUp(app.email)
                          ? "bg-green-900/20"
                          : ""
                      }
                    >
                      <TableCell className="text-white">
                        {app.first_name} {app.last_name}
                      </TableCell>
                      <TableCell className="text-white">{app.email}</TableCell>
                      <TableCell className="text-white">
                        ${app.contribution_amount}
                      </TableCell>
                      <TableCell className="text-white max-w-md truncate">
                        {app.why_perfect_tester}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            app.status === "approved"
                              ? "default"
                              : app.status === "denied"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {app.status}
                          {app.status === "approved" && hasSignedUp(app.email) &&
                            " (Signed Up)"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {app.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() =>
                                handleProcessApplication(
                                  app.id,
                                  "approve",
                                  `${app.first_name} ${app.last_name}`
                                )
                              }
                              disabled={processApplicationMutation.isPending}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                handleProcessApplication(
                                  app.id,
                                  "deny",
                                  `${app.first_name} ${app.last_name}`
                                )
                              }
                              disabled={processApplicationMutation.isPending}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Deny
                            </Button>
                          </div>
                        )}
                        {app.status === "approved" && app.invite_code && (
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {app.invite_code}
                          </code>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Settings Dialog */}
        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Email Templates</DialogTitle>
              <DialogDescription>
                Configure the email templates for approved and denied
                applications. Use {`{{name}}`}, {`{{invite_code}}`}, and{" "}
                {`{{signup_url}}`} as placeholders.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Approved Template</h3>
                <div className="space-y-2">
                  <Label htmlFor="approved-subject">Subject</Label>
                  <Input
                    id="approved-subject"
                    value={approvedTemplate.subject}
                    onChange={(e) =>
                      setApprovedTemplate({
                        ...approvedTemplate,
                        subject: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="approved-html">HTML Content</Label>
                  <Textarea
                    id="approved-html"
                    value={approvedTemplate.html}
                    onChange={(e) =>
                      setApprovedTemplate({
                        ...approvedTemplate,
                        html: e.target.value,
                      })
                    }
                    rows={8}
                    className="font-mono text-sm"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Denied Template</h3>
                <div className="space-y-2">
                  <Label htmlFor="denied-subject">Subject</Label>
                  <Input
                    id="denied-subject"
                    value={deniedTemplate.subject}
                    onChange={(e) =>
                      setDeniedTemplate({
                        ...deniedTemplate,
                        subject: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="denied-html">HTML Content</Label>
                  <Textarea
                    id="denied-html"
                    value={deniedTemplate.html}
                    onChange={(e) =>
                      setDeniedTemplate({
                        ...deniedTemplate,
                        html: e.target.value,
                      })
                    }
                    rows={8}
                    className="font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={() => updateTemplatesMutation.mutate()}
                disabled={updateTemplatesMutation.isPending}
              >
                {updateTemplatesMutation.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Save Templates
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Confirmation Dialog */}
        <Dialog
          open={confirmDialog.open}
          onOpenChange={(open) =>
            setConfirmDialog({ ...confirmDialog, open })
          }
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Confirm {confirmDialog.action === "approve" ? "Approval" : "Denial"}
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to {confirmDialog.action}{" "}
                {confirmDialog.applicantName}'s application? An email will be
                sent to notify them.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() =>
                  setConfirmDialog({ ...confirmDialog, open: false })
                }
              >
                Cancel
              </Button>
              <Button
                onClick={confirmProcess}
                disabled={processApplicationMutation.isPending}
                variant={
                  confirmDialog.action === "approve" ? "default" : "destructive"
                }
              >
                {processApplicationMutation.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Confirm {confirmDialog.action === "approve" ? "Approval" : "Denial"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminBetaApplications;
