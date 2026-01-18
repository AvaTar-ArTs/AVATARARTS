import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { adminRoutes } from "@/utils/adminNavigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const AdminUserDetail = () => {
  const { userId } = useParams<{ userId: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [creditAmount, setCreditAmount] = useState("");

  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ["admin-user-profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: userStats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-user-stats", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_user_stats")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["admin-user-projects", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const addCreditsMutation = useMutation({
    mutationFn: async (amount: number) => {
      const { data, error } = await supabase.rpc("add_credits", {
        p_user_id: userId,
        p_amount: amount,
        p_type: "admin_adjustment",
        p_reason: "Manual credit adjustment by admin",
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Credits Added",
        description: "User credits have been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-user-profile", userId] });
      queryClient.invalidateQueries({ queryKey: ["admin-user-stats", userId] });
      setCreditAmount("");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add credits. Please try again.",
      });
      console.error("Error adding credits:", error);
    },
  });

  const handleAddCredits = () => {
    const amount = parseFloat(creditAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a valid positive number.",
      });
      return;
    }
    addCreditsMutation.mutate(amount);
  };

  const isLoading = profileLoading || statsLoading || projectsLoading;

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  const storageInfo = (userStats?.storage_info as any) || {};
  const totalMb = storageInfo.total_mb || 0;
  const byBucket = storageInfo.by_bucket || {};

  return (
    <AdminLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-center gap-4">
          <Link to={adminRoutes.users}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">{userProfile?.user_email}</h1>
        </div>

        {/* User Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card style={{ backgroundColor: '#1c1c1f', borderColor: '#6a6a71' }}>
            <CardHeader>
              <CardTitle className="text-white">User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground">User ID</Label>
                <p className="text-white font-mono text-sm">{userProfile?.id}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="text-white">{userProfile?.user_email}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Joined</Label>
                <p className="text-white">
                  {userProfile?.created_at
                    ? format(new Date(userProfile.created_at), "MMM dd, yyyy HH:mm")
                    : "Unknown"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Last Login</Label>
                <p className="text-white">
                  {userStats?.last_sign_in_at
                    ? format(new Date(userStats.last_sign_in_at), "MMM dd, yyyy HH:mm")
                    : "Never"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: '#1c1c1f', borderColor: '#6a6a71' }}>
            <CardHeader>
              <CardTitle className="text-white">Credits Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Current Balance</Label>
                <p className="text-3xl font-bold text-white">
                  {Number(userProfile?.credit_balance || 0).toFixed(2)}
                </p>
              </div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Amount to add"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleAddCredits}
                  disabled={addCreditsMutation.isPending}
                >
                  {addCreditsMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Add Credits"
                  )}
                </Button>
              </div>
              <div>
                <Label className="text-muted-foreground">Lifetime Spend</Label>
                <p className="text-xl font-bold text-white">
                  ${Number(userStats?.lifetime_spend || 0).toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Storage Info */}
        <Card style={{ backgroundColor: '#1c1c1f', borderColor: '#6a6a71' }}>
          <CardHeader>
            <CardTitle className="text-white">Storage Usage</CardTitle>
            <CardDescription>Total: {totalMb.toFixed(2)} MB</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-muted-foreground">Audio Original</Label>
              <p className="text-white font-medium">
                {(byBucket.audio_original_mb || 0).toFixed(2)} MB
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Audio Processed</Label>
              <p className="text-white font-medium">
                {(byBucket.audio_processed_mb || 0).toFixed(2)} MB
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Shot Media</Label>
              <p className="text-white font-medium">
                {(byBucket.shot_media_mb || 0).toFixed(2)} MB
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Projects */}
        <Card style={{ backgroundColor: '#1c1c1f', borderColor: '#6a6a71' }}>
          <CardHeader>
            <CardTitle className="text-white">
              Projects ({projects?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {projects?.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ backgroundColor: '#2a2a2f' }}
                >
                  <div>
                    <p className="text-white font-medium">{project.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(project.created_at), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <Link to={`/project/${project.id}/storyboard`}>
                    <Button variant="outline" size="sm">
                      View Project
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminUserDetail;
