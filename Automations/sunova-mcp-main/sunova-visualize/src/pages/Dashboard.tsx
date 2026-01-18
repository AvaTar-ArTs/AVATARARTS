import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LogOut, Upload, Music, Video, Plus, FileAudio, MoreVertical, Edit3, Trash2, FolderPlus, X, Check, Folder, ArrowLeft, ChevronRight, Home, AlertCircle, RefreshCw, Target, Loader2, Sparkle } from "lucide-react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { z } from "zod";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import LogoHeader from "@/components/LogoHeader";
import type { ConceptPayload } from "@/types/concept";
import { useUserProfile } from "@/hooks/useUserProfile";
import { formatCredits } from "@/utils/credits";
import { persistConceptToProject } from "@/utils/projectPersistence";

const AudioProcessingUI = lazy(() => import("@/components/AudioProcessingUI"));
const StoryboardEditor = lazy(() => import("@/components/StoryboardEditor"));

// Import AudioAnalysis type from AudioProcessingUI
interface AudioAnalysis {
  lyrics: string;
  tempo: number;
  key: string;
  instruments: string[];
  genre: string;
  mood: string;
  themes: string[];
  duration?: number;
  albumArtUrl?: string;
  mood_timeline?: Array<{
    timestamp: number;
    mood: string;
    intensity: number;
  }>;
  concept?: ConceptPayload;
}
interface CharacterAssessment {
  reference: string;
  imageUrl: string;
  fileName: string;
  attributes: {
    age?: string;
    gender?: string;
    style?: string;
    quality: 'high' | 'medium' | 'low';
    faceClarity: number;
    bodyVisibility: number;
  };
}
interface AssessedCharacters {
  characters: Record<string, string>;
  assessments: CharacterAssessment[];
}
interface Project {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  audio_file_name: string | null;
  audio_duration: number | null;
  audio_analysis: AudioAnalysis | null;
  folder_id: string | null;
  storyboard: Record<string, unknown> | null;
  clips: Record<string, unknown> | null;
  concept_images: Record<string, unknown> | null;
  concept_notes: string | null;
  billing_info: Record<string, unknown> | null;
  status?: string | null;
}
interface Folder {
  id: string;
  name: string;
  description: string | null;
  color: string;
  created_at: string;
  updated_at: string;
}
const folderSchema = z.object({
  name: z.string().trim().min(1, "Folder name is required").max(50, "Folder name must be less than 50 characters").regex(/^[a-zA-Z0-9\s\-_]+$/, "Folder name can only contain letters, numbers, spaces, hyphens, and underscores"),
  description: z.string().trim().max(200, "Description must be less than 200 characters").optional().or(z.literal("")),
  color: z.enum(['primary', 'secondary', 'accent', 'accent-blue', 'accent-yellow', 'accent-pink', 'accent-orange'])
});
const Dashboard = () => {
  const {
    user,
    signOut
  } = useAuth();
  const {
    profile: userProfile,
    isAdmin,
    isLoading: profileLoading,
    error: profileError,
    refetch: refreshUserProfile,
  } = useUserProfile();
  const navigate = useNavigate();

  // State declarations
  // State declarations - reorganized to fix initialization issue
  const [projects, setProjects] = useState<Project[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [processingProject, setProcessingProject] = useState<{
    id: string;
    audioFile: File;
    existingAnalysis?: AudioAnalysis | null;
    step?: 'audio-processing' | 'concept-storyboard' | 'storyboard';
    analysis?: AudioAnalysis;
    characters?: AssessedCharacters;
    concept?: ConceptPayload | null;
  } | null>(null);
  const [folderForm, setFolderForm] = useState({
    name: '',
    description: '',
    color: 'primary' as const
  });
  const [folderErrors, setFolderErrors] = useState<Record<string, string>>({});
  const [isCreditsDialogOpen, setIsCreditsDialogOpen] = useState(false);
  const [selectedCreditAmount, setSelectedCreditAmount] = useState(25);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);

  const creditPackages = [10, 25, 50, 100];

  // Accent colors from our design system
  const accentColors = ["border-2", "border-2", "border-2", "border-2", "border-2", "border-2", "border-2"];

  const handlePurchaseCredits = useCallback(async () => {
    if (!selectedCreditAmount || selectedCreditAmount < 5) {
      toast.error('Please choose a credit amount of at least $5.');
      return;
    }

    if (!user) {
      toast.error('Please sign in to purchase credits.');
      return;
    }

    setIsCreatingCheckout(true);
    try {
      const { data, error } = await supabase.functions.invoke<{ url: string }>('create-checkout-session', {
        body: {
          amount: selectedCreditAmount,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data?.url) {
        throw new Error('Checkout session could not be created.');
      }

      window.location.href = data.url;
    } catch (error) {
      console.error('Failed to create Stripe checkout session', error);
      const message = error instanceof Error ? error.message : 'Unable to start checkout';
      toast.error(message);
    } finally {
      setIsCreatingCheckout(false);
    }
  }, [selectedCreditAmount, user]);

  useEffect(() => {
    if (profileError) {
      console.error('Failed to load user profile', profileError);
      toast.error('Unable to load credit balance. Please refresh the page.');
    }
  }, [profileError]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('payment');

    if (!paymentStatus) {
      return;
    }

    params.delete('payment');
    const newQuery = params.toString();
    const newUrl = `${window.location.pathname}${newQuery ? `?${newQuery}` : ''}`;

    if (paymentStatus === 'success') {
      toast.success('Payment successful! Credits have been added to your account.');
      refreshUserProfile();
    } else if (paymentStatus === 'cancelled') {
      toast.info('Payment was cancelled. No credits were charged.');
    }

    window.history.replaceState({}, '', newUrl);
  }, [refreshUserProfile]);

  // Dynamic background styles based on project progress
  const getProjectBackgroundStyle = (project: Project, index: number) => {
    // Check if project has album art from ID3 metadata
    const albumArtUrl = project.audio_analysis?.albumArtUrl as string | undefined;
    
    if (albumArtUrl) {
      return {
        backgroundImage: `url(${albumArtUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderColor: '#cb8145'
      };
    }
    
    const progress = getProjectProgress(project);
    const colors = ['#cb8145',
    // primary
    '#c4577e',
    // secondary
    '#67aa60',
    // accent green
    '#2d6ab1',
    // accent blue
    '#cdbd55',
    // accent yellow
    '#bc4075',
    // accent pink
    '#de7a40' // accent orange
    ];
    let accentColor;
    switch (progress.step) {
      case 'generation_complete':
        accentColor = '#67aa60'; // green
        break;
      case 'ready_for_generation':
        accentColor = '#de7a40'; // orange
        break;
      case 'ready_for_timeline':
        accentColor = '#2d6ab1'; // blue
        break;
      case 'ready_for_storyboard':
        accentColor = '#bc4075'; // pink
        break;
      case 'ready_for_concept':
        accentColor = '#cdbd55'; // yellow
        break;
      case 'processing':
        accentColor = '#cdbd55'; // yellow
        break;
      default:
        accentColor = colors[index % colors.length];
    }
    return {
      backgroundColor: `${accentColor}99`,
      // 60% opacity
      borderColor: accentColor
    };
  };

  // Dynamic background styles for folders
  const getFolderBackgroundStyle = (folderColor: string) => {
    const colorMap = {
      'primary': '#cb8145',
      'secondary': '#c4577e',
      'accent': '#67aa60',
      'accent-blue': '#2d6ab1',
      'accent-yellow': '#cdbd55',
      'accent-pink': '#bc4075',
      'accent-orange': '#de7a40'
    };
    const accentColor = colorMap[folderColor as keyof typeof colorMap] || colorMap.primary;
    return {
      backgroundColor: `${accentColor}99`,
      // 60% opacity
      borderColor: accentColor
    };
  };

  // Get current folder name for breadcrumb
  const currentFolder = currentFolderId ? folders.find(f => f.id === currentFolderId) : null;

  // Filter projects based on current view
  const filteredProjects = currentFolderId ? projects.filter(p => p.folder_id === currentFolderId) : projects.filter(p => !p.folder_id);

  // Filter folders (only show in main view)
  const visibleFolders = currentFolderId ? [] : folders;
  const fetchProjects = useCallback(async () => {
    if (!user) return;
    try {
      const {
        data,
        error
      } = await supabase.from("projects").select("id, name, description, created_at, updated_at, audio_file_name, audio_duration, audio_analysis, folder_id, storyboard, clips, concept_images, concept_notes, billing_info, status").eq("user_id", user.id).order("created_at", {
        ascending: false
      });
      if (error) throw error;
      
      // Auto-fix projects stuck in "processing" with completed audio_analysis
      const projectsToFix = (data || []).filter(p => 
        p.status === 'processing' && p.audio_analysis && Object.keys(p.audio_analysis).length > 0
      );
      
      if (projectsToFix.length > 0) {
        console.log(`Auto-fixing ${projectsToFix.length} projects stuck in processing status`);
        const fixPromises = projectsToFix.map(p =>
          supabase.from('projects').update({ status: 'ready_for_concept' }).eq('id', p.id)
        );
        await Promise.all(fixPromises);
        
        // Update local state
        const fixedData = (data || []).map(p => 
          projectsToFix.find(fp => fp.id === p.id) 
            ? { ...p, status: 'ready_for_concept' }
            : p
        ) as unknown as Project[];
        setProjects(fixedData);
      } else {
        setProjects(data as unknown as Project[] || []);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, [user]);
  const fetchFolders = useCallback(async () => {
    if (!user) return;
    try {
      console.log('Fetching folders for user:', user.id);
      const {
        data,
        error
      } = await supabase.from("folders").select("*").eq("user_id", user.id).order("created_at", {
        ascending: false
      });
      if (error) {
        console.error('Error fetching folders:', error);
        throw error;
      }
      console.log('Folders fetched:', data);
      setFolders(data || []);
    } catch (error) {
      console.error("Error fetching folders:", error);
      toast.error("Failed to load folders");
    }
  }, [user]);
  useEffect(() => {
    fetchProjects();
    fetchFolders();
  }, [fetchProjects, fetchFolders]);

  // Force refresh folders when component mounts or user changes
  useEffect(() => {
    if (user) {
      console.log('User changed, refreshing folders...');
      fetchFolders();
    }
  }, [user, fetchFolders]);
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Error signing out");
    }
  };
  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (editMode) {
      setSelectedProjects(new Set());
    }
  };
  const handleProjectSelect = (projectId: string, checked: boolean) => {
    const newSelected = new Set(selectedProjects);
    if (checked) {
      newSelected.add(projectId);
    } else {
      newSelected.delete(projectId);
    }
    setSelectedProjects(newSelected);
  };
  const selectAllProjects = () => {
    if (selectedProjects.size === projects.length) {
      setSelectedProjects(new Set());
    } else {
      setSelectedProjects(new Set(projects.map(p => p.id)));
    }
  };
  const handleDeleteSelected = async () => {
    if (selectedProjects.size === 0) return;
    setDeleting(true);
    try {
      // Delete projects from database
      const {
        error
      } = await supabase.from("projects").delete().in("id", Array.from(selectedProjects));
      if (error) throw error;

      // Delete associated files from storage
      const deletePromises = Array.from(selectedProjects).map(async projectId => {
        const project = projects.find(p => p.id === projectId);
        if (project?.audio_file_name) {
          const fileName = `${projectId}/${project.audio_file_name}`;
          await supabase.storage.from("audio").remove([fileName]);
        }
      });
      await Promise.all(deletePromises);
      toast.success(`${selectedProjects.size} project${selectedProjects.size > 1 ? 's' : ''} deleted successfully`);
      setSelectedProjects(new Set());
      setEditMode(false);
      fetchProjects();
    } catch (error) {
      console.error("Error deleting projects:", error);
      toast.error("Failed to delete projects");
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };
  const handleMoveToFolder = async () => {
    if (selectedProjects.size === 0) return;

    // For now, we'll show a simple selection - you could enhance this with a dropdown
    const folderName = prompt("Enter folder name to move selected projects to:");
    if (!folderName) return;
    const targetFolder = folders.find(f => f.name.toLowerCase() === folderName.toLowerCase());
    if (!targetFolder) {
      toast.error("Folder not found. Please check the folder name and try again.");
      return;
    }
    try {
      const {
        error
      } = await supabase.from("projects").update({
        folder_id: targetFolder.id
      }).in("id", Array.from(selectedProjects));
      if (error) throw error;

      // Update local state
      setProjects(prev => prev.map(p => selectedProjects.has(p.id) ? {
        ...p,
        folder_id: targetFolder.id
      } : p));
      toast.success(`${selectedProjects.size} project${selectedProjects.size > 1 ? 's' : ''} moved to ${targetFolder.name}`);
      setSelectedProjects(new Set());
      setEditMode(false);
    } catch (error) {
      console.error("Error moving projects:", error);
      toast.error("Failed to move projects");
    }
  };
  const handleCreateFolder = () => {
    setShowCreateFolderDialog(true);
  };
  const handleFolderClick = (folderId: string) => {
    setCurrentFolderId(folderId);
    setEditMode(false);
    setSelectedProjects(new Set());
  };
  const handleBackToMain = () => {
    setCurrentFolderId(null);
    setEditMode(false);
    setSelectedProjects(new Set());
  };
  const onDragEnd = async (result: DropResult) => {
    const {
      destination,
      source,
      draggableId
    } = result;
    if (!destination) return;

    // Handle moving project to folder
    if (destination.droppableId.startsWith('folder-')) {
      const folderId = destination.droppableId.replace('folder-', '');
      await moveProjectToFolder(draggableId, folderId);
    }
    // Handle moving project back to main area
    else if (destination.droppableId === 'projects' && source.droppableId !== 'projects') {
      await moveProjectToFolder(draggableId, null);
    }
  };
  const moveProjectToFolder = async (projectId: string, folderId: string | null) => {
    try {
      const {
        error
      } = await supabase.from("projects").update({
        folder_id: folderId
      }).eq("id", projectId);
      if (error) throw error;

      // Update local state
      setProjects(prev => prev.map(p => p.id === projectId ? {
        ...p,
        folder_id: folderId
      } : p));
      const folderName = folderId ? folders.find(f => f.id === folderId)?.name : "main";
      toast.success(`Project moved to ${folderName || "main"} successfully`);
    } catch (error) {
      console.error("Error moving project:", error);
      toast.error("Failed to move project");
    }
  };

  // New reconceptualize function
  const handleReconceptualizeProject = async (projectId: string) => {
    try {
      const {
        error
      } = await supabase.from('projects').update({
        concept_notes: null,
        storyboard: null,
        status: 'ready_for_concept',
        updated_at: new Date().toISOString()
      }).eq('id', projectId);
      if (error) throw error;

      // Update local state
      const updatedProject = {
        ...projects.find(p => p.id === projectId)!,
        concept_notes: null,
        storyboard: null,
        status: 'ready_for_concept'
      };
      setProjects(prev => prev.map(project => project.id === projectId ? updatedProject : project));
      toast.success("Concept cleared! Opening project for reconceptualization...");

      // Automatically open the project
      handleOpenProject(updatedProject);
    } catch (error) {
      console.error("Error reconceptualizing project:", error);
      toast.error("Failed to reconceptualize project");
    }
  };

  // Delete single project function
  const handleDeleteSingleProject = async (projectId: string) => {
    try {
      const project = projects.find(p => p.id === projectId);

      // Delete from database
      const {
        error
      } = await supabase.from('projects').delete().eq('id', projectId);
      if (error) throw error;

      // Delete associated files from storage
      if (project?.audio_file_name) {
        await supabase.storage.from('audio-original').remove([`${projectId}/${project.audio_file_name}`]);
      }

      // Update local state
      setProjects(prev => prev.filter(p => p.id !== projectId));
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  // Move single project to folder with folder selection
  const handleMoveSingleProjectToFolder = async (projectId: string) => {
    // For now, we'll move to the first available folder or create a simple selection
    // In a full implementation, you'd want a folder selection dialog
    if (folders.length > 0) {
      await moveProjectToFolder(projectId, folders[0].id);
    } else {
      toast.info("No folders available. Create a folder first.");
    }
  };
  const validateFolderForm = () => {
    const newErrors: Record<string, string> = {};
    try {
      folderSchema.parse(folderForm);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach(issue => {
          if (issue.path[0]) {
            newErrors[issue.path[0] as string] = issue.message;
          }
        });
      }
    }

    // Check if folder name already exists
    if (folders.some(folder => folder.name.toLowerCase() === folderForm.name.toLowerCase().trim())) {
      newErrors.name = "A folder with this name already exists";
    }
    setFolderErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleCreateFolderSubmit = async () => {
    if (!validateFolderForm() || !user) return;
    setCreatingFolder(true);
    try {
      console.log('Creating folder with data:', {
        user_id: user.id,
        name: folderForm.name.trim(),
        description: folderForm.description.trim() || null,
        color: folderForm.color
      });
      const {
        data,
        error
      } = await supabase.from("folders").insert({
        user_id: user.id,
        name: folderForm.name.trim(),
        description: folderForm.description.trim() || null,
        color: folderForm.color
      }).select().single();
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      console.log('Folder created successfully:', data);
      toast.success("Folder created successfully!");
      setShowCreateFolderDialog(false);
      setFolderForm({
        name: '',
        description: '',
        color: 'primary'
      });
      setFolderErrors({});
      await fetchFolders(); // Refresh folders list
    } catch (error) {
      console.error("Error creating folder:", error);
      toast.error("Failed to create folder");
    } finally {
      setCreatingFolder(false);
    }
  };
  const handleFolderFormChange = (field: string, value: string) => {
    setFolderForm(prev => ({
      ...prev,
      [field]: value
    }));
    if (folderErrors[field]) {
      setFolderErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  // Helper function to determine the most recent completed step
  const getProjectProgress = (project: Project) => {
    // Use the status field to determine project progress
    const status = project.status || 'empty';
    switch (status) {
      case 'generation_complete':
        return {
          step: 'generation_complete',
          route: `/project/${project.id}/clips`
        };
      case 'ready_for_generation':
        return {
          step: 'ready_for_generation',
          route: `/project/${project.id}/storyboard`
        };
      case 'ready_for_timeline':
        return {
          step: 'ready_for_timeline',
          route: `/project/${project.id}/storyboard`
        };
      case 'ready_for_storyboard':
        return {
          step: 'ready_for_storyboard',
          route: `/project/${project.id}/storyboard`
        };
      case 'ready_for_concept':
        return {
          step: 'ready_for_concept',
          route: null
        };
      // Will open AudioProcessingUI
      case 'processing':
        return {
          step: 'processing',
          route: null
        };
      // Will open AudioProcessingUI
      default:
        return {
          step: 'empty',
          route: null
        };
    }
  };
  const promptForAudioFile = (project: Project) => {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'audio/*';
    fileInput.style.display = 'none';
    fileInput.onchange = async event => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('audio/')) {
        toast.error("Please select an audio file");
        return;
      }

      // Validate file size (20MB limit)
      if (file.size > 20 * 1024 * 1024) {
        toast.error("File size must be less than 20MB");
        return;
      }
      try {
        setUploading(true);

        // Sanitize filename
        const sanitizeFilename = (filename: string) => {
          return filename.replace(/['"]/g, '') // Remove quotes
          .replace(/[<>:"/\\|?*]/g, '_') // Replace invalid characters
          .replace(/\s+/g, '_') // Replace spaces with underscores
          .toLowerCase();
        };
        const sanitizedFileName = sanitizeFilename(file.name);
        const fileName = `${project.id}/${sanitizedFileName}`;
        console.log('Uploading audio file for existing project:', fileName);

        // Upload the audio file
        const {
          error: uploadError
        } = await supabase.storage.from('audio-original').upload(fileName, file, {
          upsert: true
        });
        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error(`Audio upload failed: ${uploadError.message}`);
        }

        // Update project with audio filename
        const {
          error: updateError
        } = await supabase.from('projects').update({
          audio_file_name: sanitizedFileName,
          status: 'processing'
        }).eq('id', project.id);
        if (updateError) {
          console.error('Error updating project with audio filename:', updateError);
          throw new Error('Failed to update project');
        }

        // Refresh projects list
        await fetchProjects();

        // Create file object for processing
        const processFile = new File([file], sanitizedFileName, {
          type: file.type
        });

        // Start processing
        setProcessingProject({
          id: project.id,
          audioFile: processFile,
          existingAnalysis: project.audio_analysis as AudioAnalysis | null
        });
        toast.success("Audio uploaded! Starting processing...");
      } catch (error) {
        console.error('Error uploading audio:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        toast.error(`Failed to upload audio: ${errorMessage}`);
      } finally {
        setUploading(false);
        document.body.removeChild(fileInput);
      }
    };

    // Add to DOM and trigger click
    document.body.appendChild(fileInput);
    fileInput.click();
  };
  const handleOpenProject = async (project: Project) => {
    console.log('handleOpenProject called with project:', {
      id: project.id,
      name: project.name,
      status: project.status,
      audio_file_name: project.audio_file_name,
      has_audio_analysis: !!project.audio_analysis
    });
    
    const progress = getProjectProgress(project);
    console.log('Project progress determined:', progress);
    
    if (progress.step === 'processing' || progress.step === 'ready_for_concept') {
      // Open AudioProcessingUI for analysis or concept development
      try {
        if (project.audio_file_name) {
          console.log('Attempting to download audio file:', `${project.id}/${project.audio_file_name}`);
          
          // Try to download existing audio file
          const {
            data: audioData,
            error
          } = await supabase.storage.from('audio-original').download(`${project.id}/${project.audio_file_name}`);
          
          if (error) {
            console.error('Error loading audio file:', error);
            toast.error(`Failed to load audio file: ${error.message}`);
            // If file doesn't exist, prompt for file upload
            promptForAudioFile(project);
            return;
          }

          console.log('Audio file loaded successfully, creating File object...');
          
          // Convert blob to File object
          const audioFile = new File([audioData], project.audio_file_name!, {
            type: audioData.type || 'audio/mpeg'
          });

          console.log('Setting processing project state...');
          
          // Load character images from concept_images
          const characterImages = (project.concept_images as Record<string, string>) || {};
          const characters = Object.keys(characterImages).length > 0 ? {
            characters: characterImages,
            assessments: []
          } : undefined;
          
          setProcessingProject({
            id: project.id,
            audioFile,
            existingAnalysis: project.audio_analysis as AudioAnalysis | null,
            characters
          });

          if (project.audio_analysis) {
            toast.success("Opening project - ready for concept development...");
          } else {
            toast.success("Resuming audio processing...");
          }
        } else {
          console.log('No audio file name found, prompting for upload...');
          // No audio file name stored, prompt for upload
          promptForAudioFile(project);
        }
      } catch (error) {
        console.error('Error loading audio file:', error);
        toast.error(`Failed to open project: ${error instanceof Error ? error.message : 'Unknown error'}`);
        promptForAudioFile(project);
      }
    } else if (progress.route) {
      // Navigate to the appropriate step for advanced progress
      const stepNames = {
        'clips': 'video clips',
        'storyboard': 'storyboard creation',
        'concept': 'concept development'
      };
      const stepName = stepNames[progress.step] || progress.step;
      toast.success(`Opening project at ${stepName} step...`);

      // Navigate to the route
      navigate(progress.route);
    } else {
      toast.info('Project is empty. Please upload an audio file to get started.');
    }
  };
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!user || !user.id) {
      toast.error("Please sign in to create projects");
      return;
    }
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('audio/')) {
      toast.error("Please select an audio file");
      return;
    }

    // Validate file size (20MB limit)
    if (file.size > 20 * 1024 * 1024) {
      toast.error("File size must be less than 20MB");
      return;
    }
    setUploading(true);
    try {
      // Extract ID3 metadata
      console.log('Extracting ID3 metadata...');
      const { extractID3Metadata, processAlbumArtWithColorOverlay } = await import('@/utils/id3MetadataExtractor');
      const id3Data = await extractID3Metadata(file);
      
      // Ensure user profile exists first
      const {
        data: profile,
        error: profileError
      } = await supabase.from("user_profiles").select("id").eq("id", user.id).maybeSingle();
      if (profileError) {
        console.error('Profile check error:', profileError);
      }
      if (!profile) {
        // Create user profile if it doesn't exist
        const {
          error: createProfileError
        } = await supabase.from("user_profiles").insert({
          id: user.id,
          user_email: user.email || ''
        });
        if (createProfileError) {
          console.error('Profile creation error:', createProfileError);
          throw new Error('Failed to create user profile');
        }
      }

      // Sanitize filename to prevent storage issues
      const sanitizeFilename = (filename: string) => {
        return filename.replace(/['"]/g, '') // Remove quotes
        // eslint-disable-next-line no-useless-escape
        .replace(/[<>:"/\\|?*\[\]]/g, '_') // Replace invalid characters including brackets
        .replace(/\s+/g, '_') // Replace spaces with underscores
        .toLowerCase();
      };
      const sanitizedFileName = sanitizeFilename(file.name);
      
      // Use ID3 title as project name, fallback to filename
      const projectName = id3Data.title || file.name.replace(/\.[^/.]+$/, "");
      const projectDescription = id3Data.artist || "New music video project";

      console.log('Creating project with user:', {
        userId: user.id,
        userName: user.email,
        metadata: { title: id3Data.title, artist: id3Data.artist, genre: id3Data.genre }
      });

      // Prepare initial audio_analysis with ID3 metadata
      const initialAudioAnalysis: Record<string, unknown> = {};
      if (id3Data.genre && id3Data.genre.length > 0) {
        initialAudioAnalysis.genre = id3Data.genre[0];
      }
      if (id3Data.tempo) {
        initialAudioAnalysis.tempo = id3Data.tempo;
      }
      if (id3Data.key) {
        initialAudioAnalysis.key = id3Data.key;
      }
      if (id3Data.duration) {
        initialAudioAnalysis.duration = id3Data.duration;
      }

      // Create project with ID3 metadata
      const {
        data: project,
        error: projectError
      // @ts-ignore - Supabase types issue with insert
      } = await supabase.from("projects").insert({
        user_id: user.id,
        name: projectName,
        description: projectDescription,
        audio_analysis: Object.keys(initialAudioAnalysis).length > 0 ? JSON.parse(JSON.stringify(initialAudioAnalysis)) : null
      }).select().single();
      if (projectError) {
        console.error('Error creating project:', projectError);
        throw projectError;
      }
      console.log('Project created successfully:', project);

      // Process and upload album art if available
      let albumArtUrl: string | null = null;
      if (id3Data.albumArt) {
        try {
          console.log('Processing album art...');
          const colorizedArt = await processAlbumArtWithColorOverlay(
            id3Data.albumArt.data,
            id3Data.albumArt.format
          );
          
          // Upload to storage
          const artFileName = `${project.id}/album-art.jpg`;
          const { error: artUploadError } = await supabase.storage
            .from('shot-media')
            .upload(artFileName, colorizedArt, {
              contentType: 'image/jpeg',
              upsert: true
            });
            
          if (artUploadError) {
            console.error('Album art upload error:', artUploadError);
          } else {
            const { data: urlData } = supabase.storage
              .from('shot-media')
              .getPublicUrl(artFileName);
            albumArtUrl = urlData.publicUrl;
            console.log('Album art uploaded:', albumArtUrl);
          }
        } catch (artError) {
          console.error('Error processing album art:', artError);
        }
      }

      // Now attempt the audio upload
      const fileName = `${project.id}/${sanitizedFileName}`;
      console.log('Uploading audio file:', fileName, 'Size:', file.size, 'Type:', file.type);
      const {
        error: uploadError
      } = await supabase.storage.from('audio-original').upload(fileName, file, {
        upsert: true
      });
      if (uploadError) {
        console.error('Upload error:', uploadError);

        // Delete the project since upload failed
        await supabase.from('projects').delete().eq('id', project.id);
        throw new Error(`Audio upload failed: ${uploadError.message}`);
      }

      // Update project with audio filename and album art URL after successful upload
      const updateData: Record<string, unknown> = {
        audio_file_name: sanitizedFileName,
        status: 'processing'
      };
      
      // Add album art URL to audio_analysis if available
      if (albumArtUrl) {
        const updatedAnalysis = {
          ...initialAudioAnalysis,
          albumArtUrl
        };
        updateData.audio_analysis = updatedAnalysis;
      }
      
      const {
        error: updateError
      } = await supabase.from('projects').update(updateData).eq('id', project.id);
      if (updateError) {
        console.error('Error updating project with audio filename:', updateError);
        // Note: We don't delete the project here since upload succeeded
      }

      // Refresh the projects list to show the new project
      await fetchProjects();

      // Create file object with sanitized name for processing
      const processFile = new File([file], sanitizedFileName, {
        type: file.type
      });

      // Redirect to audio processing with initial ID3 metadata
      const existingAnalysisData = Object.keys(initialAudioAnalysis).length > 0 || albumArtUrl ? {
        ...initialAudioAnalysis,
        ...(albumArtUrl && { albumArtUrl })
      } as Partial<AudioAnalysis> : undefined;
      
      setProcessingProject({
        id: project.id,
        audioFile: processFile,
        existingAnalysis: existingAnalysisData as AudioAnalysis | undefined
      });
      toast.success("Project created! Starting audio analysis...");
    } catch (error) {
      console.error("Error creating project:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('upload')) {
        toast.error("Failed to upload audio file. Please check your connection and try again.");
      } else {
        toast.error("Failed to create project");
      }
    } finally {
      setUploading(false);
    }
  }, [user, fetchProjects]);
  const {
    getRootProps,
    getInputProps,
    isDragActive
  } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac']
    },
    multiple: false,
    disabled: uploading
  });

  // Effect to clean up state when returning to dashboard
  useEffect(() => {
    if (!processingProject) {
      // Reset uploading state when returning to dashboard
      setUploading(false);
    }
  }, [processingProject]);

  // Show audio processing UI if we have a processing project
  if (processingProject) {
    // Show StoryboardEditor for both concept-storyboard and storyboard steps
    if ((processingProject.step === 'concept-storyboard' || processingProject.step === 'storyboard') && processingProject.analysis) {
      return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{
          backgroundColor: '#1c1c1f'
        }}>
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading storyboard tools...</p>
            </div>
          </div>}>
          <StoryboardEditor projectId={processingProject.id} audioFile={processingProject.audioFile} audioAnalysis={processingProject.analysis} characters={processingProject.characters} concept={processingProject.concept} onBack={() => {
            setProcessingProject({
              ...processingProject,
              step: 'audio-processing'
            });
            setUploading(false); // Clean up state
          }} onComplete={shots => {
            setProcessingProject(null);
            setUploading(false); // Clean up state
            fetchProjects();
            toast.success(`Storyboard created with ${shots.length} shots!`);
          }} />
        </Suspense>
      );
    }

    // Show AudioProcessingUI by default or for audio-processing step
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{
        backgroundColor: '#1c1c1f'
      }}>
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading audio tools...</p>
          </div>
        </div>}>
        <AudioProcessingUI projectId={processingProject.id} audioFile={processingProject.audioFile} existingAnalysis={processingProject.existingAnalysis} onComplete={async (analysis, characters) => {
      // Update project with analysis data and status
      try {
        const updateData: Record<string, unknown> = {
          audio_analysis: analysis,
          status: 'ready_for_concept',
          updated_at: new Date().toISOString()
        };

        // Store character data in project if provided
        if (characters) {
          console.log('Storing character assessment data:', characters);
          updateData.concept_notes = `Character Assessment:\n${JSON.stringify(characters, null, 2)}`;
        }
        const {
          error
        } = await supabase.from('projects').update(updateData).eq('id', processingProject.id);
        if (error) {
          console.error('Error updating project:', error);
          toast.error('Failed to save analysis data');
        } else {
          console.log('Analysis data stored successfully');
          if (characters) {
            toast.success(`Audio analysis and character assessment completed! ${characters.assessments.length} characters processed.`);
          } else {
            toast.success("Audio analysis completed! Ready for concept development.");
          }
          // Refresh projects to show updated status
          await fetchProjects();
        }
      } catch (error) {
        console.error('Error storing analysis data:', error);
        toast.error('Failed to save analysis data');
      }

      // Move to storyboard editor
      setProcessingProject({
        ...processingProject,
        step: 'storyboard',
        analysis,
        characters
      });
    }} onConceptExtracted={async (concept, analysis, characters) => {
      console.log('Concept extracted, moving to concept storyboard:', concept);

      // Save concept to database
      try {
        const { error: updateError } = await persistConceptToProject({
          supabase,
          projectId: processingProject.id,
          concept,
          analysis: analysis as unknown as Record<string, unknown>,
        });
        if (updateError) {
          console.error('Error saving concept to database:', updateError);
          const message = typeof updateError === 'object' && updateError && 'message' in updateError
            ? (updateError as { message: string }).message
            : 'Failed to save concept';
          toast.error(message);
          return;
        }
        console.log('Concept saved to database successfully');

        // Wait a moment to ensure database consistency
        await new Promise(resolve => setTimeout(resolve, 500));

        // Refresh projects to show updated status
        await fetchProjects();
        toast.success('Concept extracted and saved!');
      } catch (error) {
        console.error('Error updating project with concept:', error);
        toast.error('Failed to save concept');
      }

      // Move to concept storyboard view
      setProcessingProject({
        ...processingProject,
        step: 'concept-storyboard',
        analysis: {
          ...analysis,
          concept: concept
        },
        characters,
        concept
      });
    }} onBack={() => {
      setProcessingProject(null);
      setUploading(false); // Clean up state when returning to dashboard
    }} />
      </Suspense>
    );
  }
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center" style={{
      backgroundColor: '#1c1c1f'
    }}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your projects...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen film-grain" style={{
    backgroundColor: '#1c1c1f'
  }}>
      <LogoHeader
        rightContent={
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Credits</p>
              <p className="text-sm font-semibold text-foreground">
                {isAdmin
                  ? 'Admin access'
                  : profileLoading
                    ? 'Loading…'
                    : formatCredits(userProfile?.credit_balance ?? 0)}
              </p>
              <p className="text-xs text-muted-foreground">
                {isAdmin ? 'Unlimited generation' : 'Available balance'}
              </p>
            </div>
            {!isAdmin && (
              <button
                type="button"
                onClick={() => setIsCreditsDialogOpen(true)}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors h-9 px-3 rounded-full text-white text-xs bg-[#1c1c1f] border border-[#6a6a71] hover:bg-[#2a2a2f] disabled:opacity-50"
                disabled={profileLoading || isCreatingCheckout}
              >
                {profileLoading || isCreatingCheckout ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkle className="h-4 w-4" />
                )}
                Add Credits
              </button>
            )}
            {isAdmin && (
              <button
                type="button"
                onClick={() => navigate('/admin/api-logs')}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors h-9 px-3 rounded-full text-white text-xs bg-primary/20 border border-primary hover:bg-primary/30"
              >
                Admin Panel
              </button>
            )}
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{user?.email}</p>
              <p className="text-xs text-muted-foreground">
                {projects.length} project{projects.length !== 1 ? 's' : ''} • {folders.length} folder{folders.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-opacity duration-300 hover:opacity-60 h-9 px-3 rounded-full text-white text-xs" onClick={() => {
            fetchProjects();
            fetchFolders();
            toast.success("Data refreshed");
          }} style={{
            background: `
              radial-gradient(ellipse 40px 30px at 15% 20%, #d78635 0%, transparent 80%),
              radial-gradient(ellipse 60px 40px at 70% 30%, #d78635 0%, transparent 80%),
              radial-gradient(ellipse 35px 25px at 85% 70%, #d78635 0%, transparent 80%),
              radial-gradient(ellipse 80px 50px at 25% 80%, #cc4f6b 0%, transparent 50%),
              radial-gradient(ellipse 45px 35px at 90% 15%, #cc4f6b 0%, transparent 60%),
              #d0583c`
          }}>
              <RefreshCw className="h-4 w-4" />
            </div>
            <div className="relative overflow-hidden group bg-[#1c1c1f] border border-[#6a6a71] text-white rounded-full h-9 px-3 cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors text-xs" onClick={handleSignOut}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" style={{
                background: `
                  radial-gradient(ellipse 40px 30px at 15% 20%, #d78635 0%, transparent 80%),
                  radial-gradient(ellipse 60px 40px at 70% 30%, #d78635 0%, transparent 80%),
                  radial-gradient(ellipse 35px 25px at 85% 70%, #d78635 0%, transparent 80%),
                  radial-gradient(ellipse 80px 50px at 25% 80%, #cc4f6b 0%, transparent 50%),
                  radial-gradient(ellipse 45px 35px at 90% 15%, #cc4f6b 0%, transparent 60%),
                  #d0583c`
              }} />
              <span className="relative z-10 flex items-center justify-center">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </span>
            </div>
          </div>
        }
      />

      <main className="container mx-auto px-6 py-8" style={{
      backgroundColor: '#101012'
    }}>

        {/* Upload Zone */}
        <Card className="glass-card mb-8">
          <CardContent className="p-8" style={{
          backgroundColor: '#1c1c1f',
          outline: '1px solid #6a6a71'
        }}>
            <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${isDragActive ? "bg-primary/10" : "hover:bg-black/10"} ${uploading ? "opacity-50 cursor-not-allowed" : ""}`} style={{
            borderColor: isDragActive ? '#d45e37' : '#6a6a71'
          }}>
              <input {...getInputProps()} />
              
              <div className="flex flex-col items-center gap-4">
                 <div className="relative overflow-hidden group w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1c1c1f', border: '1px solid #6a6a71' }}>
                   <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" style={{
                     background: `
                       radial-gradient(ellipse 40px 30px at 15% 20%, #d78635 0%, transparent 80%),
                       radial-gradient(ellipse 60px 40px at 70% 30%, #d78635 0%, transparent 80%),
                       radial-gradient(ellipse 35px 25px at 85% 70%, #d78635 0%, transparent 80%),
                       radial-gradient(ellipse 80px 50px at 25% 80%, #cc4f6b 0%, transparent 50%),
                       radial-gradient(ellipse 45px 35px at 90% 15%, #cc4f6b 0%, transparent 60%),
                       #d0583c`
                   }} />
                   {uploading ? <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin relative z-10"></div> : <Upload className="h-8 w-8 text-white relative z-10" />}
                 </div>
                
                {uploading ? <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2">Uploading...</h3>
                    <p className="text-muted-foreground">Creating your new project</p>
                  </div> : isDragActive ? <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2 text-primary">Drop your audio file here</h3>
                    <p className="text-muted-foreground">We'll analyze it and create your music video project</p>
                  </div> : <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2">Drop your audio file here</h3>
                    <p className="text-muted-foreground mb-2">
                      Or click to browse • MP3, WAV, M4A supported • Max 20MB
                    </p>
                     <div className="gradient-button relative overflow-hidden group bg-[#1c1c1f] border border-[#6a6a71] text-white rounded-full h-10 px-4 py-2 cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors text-xs font-normal">
                       <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" style={{
                         background: `
                           radial-gradient(ellipse 40px 30px at 15% 20%, #d78635 0%, transparent 80%),
                           radial-gradient(ellipse 60px 40px at 70% 30%, #d78635 0%, transparent 80%),
                           radial-gradient(ellipse 35px 25px at 85% 70%, #d78635 0%, transparent 80%),
                           radial-gradient(ellipse 80px 50px at 25% 80%, #cc4f6b 0%, transparent 50%),
                           radial-gradient(ellipse 45px 35px at 90% 15%, #cc4f6b 0%, transparent 60%),
                           #d0583c`
                       }} />
                       <span className="relative z-10 flex items-center justify-center">
                         <Plus className="mr-1 h-4 w-4" />
                         Start New Project
                       </span>
                     </div>
                  </div>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions Bar */}
        {editMode && selectedProjects.size > 0 && <Card className="glass-card mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-foreground">
                    {selectedProjects.size} project{selectedProjects.size > 1 ? 's' : ''} selected
                  </span>
                  <Button variant="outline" size="sm" onClick={selectAllProjects} className="text-xs">
                    {selectedProjects.size === projects.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleMoveToFolder} className="border-accent/50 text-accent hover:bg-accent/10">
                    <FolderPlus className="h-4 w-4 mr-2" />
                    Move to Folder
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowDeleteDialog(true)} className="border-destructive/50 text-destructive hover:bg-destructive/10" disabled={deleting}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Selected
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>}

        {/* Projects and Folders Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-sans font-bold text-foreground">
              {currentFolder ? `${currentFolder.name} Projects` : "Your Projects"} 
              {(filteredProjects.length > 0 || visibleFolders.length > 0) && ` (${filteredProjects.length + visibleFolders.length})`}
            </h2>
            
            {(projects.length > 0 || folders.length > 0) && <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="relative overflow-hidden group bg-[#1c1c1f] border border-[#6a6a71] text-white rounded-full h-9 px-3 cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors text-xs">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" style={{
                      background: `
                        radial-gradient(ellipse 40px 30px at 15% 20%, #d78635 0%, transparent 80%),
                        radial-gradient(ellipse 60px 40px at 70% 30%, #d78635 0%, transparent 80%),
                        radial-gradient(ellipse 35px 25px at 85% 70%, #d78635 0%, transparent 80%),
                        radial-gradient(ellipse 80px 50px at 25% 80%, #cc4f6b 0%, transparent 50%),
                        radial-gradient(ellipse 45px 35px at 90% 15%, #cc4f6b 0%, transparent 60%),
                        #d0583c`
                    }} />
                    <span className="relative z-10 flex items-center justify-center">
                      <MoreVertical className="h-4 w-4 mr-2" />
                      Actions
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-background/95 backdrop-blur-xl border-muted/20 z-50">
                  <DropdownMenuItem onClick={toggleEditMode} className="hover:bg-muted/20">
                    {editMode ? <>
                        <X className="h-4 w-4 mr-2" />
                        Cancel Edit
                      </> : <>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Select Projects
                      </>}
                  </DropdownMenuItem>
                  {!currentFolder && <DropdownMenuItem onClick={handleCreateFolder} className="hover:bg-muted/20">
                      <Folder className="h-4 w-4 mr-2" />
                      Add Folder
                    </DropdownMenuItem>}
                </DropdownMenuContent>
              </DropdownMenu>}
          </div>

          {/* Breadcrumb Navigation */}
          {currentFolder && <div className="mb-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink onClick={handleBackToMain} className="hover:text-foreground transition-colors duration-200 flex items-center gap-2 cursor-pointer">
                    <Home className="h-4 w-4" />
                    Projects
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-foreground font-medium flex items-center gap-2">
                    <Folder className="h-4 w-4" />
                    {currentFolder.name}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>}

          {filteredProjects.length === 0 && visibleFolders.length === 0 ? <Card className="glass-card">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-muted/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {currentFolder ? <Folder className="h-8 w-8 text-muted-foreground" /> : <Video className="h-8 w-8 text-muted-foreground" />}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  {currentFolder ? "No projects in this folder" : "No projects yet"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {currentFolder ? "Drag projects here or upload new tracks to get started" : "Upload your first audio track to create an amazing AI music video"}
                </p>
                {!currentFolder && <div className="relative overflow-hidden group bg-[#1c1c1f] border border-[#6a6a71] text-white rounded-full h-10 px-4 py-2 cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors text-xs font-normal">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" style={{
                      background: `
                        radial-gradient(ellipse 40px 30px at 15% 20%, #d78635 0%, transparent 80%),
                        radial-gradient(ellipse 60px 40px at 70% 30%, #d78635 0%, transparent 80%),
                        radial-gradient(ellipse 35px 25px at 85% 70%, #d78635 0%, transparent 80%),
                        radial-gradient(ellipse 80px 50px at 25% 80%, #cc4f6b 0%, transparent 50%),
                        radial-gradient(ellipse 45px 35px at 90% 15%, #cc4f6b 0%, transparent 60%),
                        #d0583c`
                    }} />
                    <span className="relative z-10 flex items-center justify-center">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Your First Track
                    </span>
                  </div>}
              </CardContent>
            </Card> : <DragDropContext onDragEnd={onDragEnd}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Folders */}
                {visibleFolders.map(folder => {
              const folderProjects = projects.filter(p => p.folder_id === folder.id);
              const colorClass = accentColors.find(c => c.includes(folder.color)) || accentColors[0];
              return <Droppable key={folder.id} droppableId={`folder-${folder.id}`}>
                      {(provided, snapshot) => <Card ref={provided.innerRef} {...provided.droppableProps} className={`glass-card hover-lift group cursor-pointer relative ${snapshot.isDraggingOver ? 'ring-2 ring-primary/50 bg-primary/10' : ''}`} onClick={() => handleFolderClick(folder.id)} style={{ backgroundColor: '#1c1c1f' }}>
                          <CardContent className="p-6" style={{
                    backgroundColor: '#1c1c1f'
                  }}>
                            <div className={`w-full aspect-video rounded-xl border-2 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300`} style={getFolderBackgroundStyle(folder.color)}>
                              <div className="text-center">
                                <Folder className="h-12 w-12 text-foreground/60 mx-auto mb-2" />
                                <div className="text-xs text-muted-foreground font-medium">
                                  {folderProjects.length} project{folderProjects.length !== 1 ? 's' : ''}
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <h3 className="font-semibold text-foreground truncate" title={folder.name}>
                                {folder.name}
                              </h3>
                              
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {folder.description || "Project folder"}
                              </p>
                              
                              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                                <span>
                                  {new Date(folder.created_at).toLocaleDateString()}
                                </span>
                                <ChevronRight className="h-4 w-4" />
                              </div>
                            </div>
                          </CardContent>
                          {provided.placeholder}
                        </Card>}
                    </Droppable>;
            })}

                {/* Projects */}
                <Droppable droppableId="projects">
                  {provided => <div ref={provided.innerRef} {...provided.droppableProps} className="contents">
                      {filteredProjects.map((project, index) => {
                  const colorClass = accentColors[index % accentColors.length];
                  const isSelected = selectedProjects.has(project.id);
                  return <Draggable key={project.id} draggableId={project.id} index={index}>
                            {(provided, snapshot) => <Card ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={`glass-card hover-lift group cursor-pointer relative ${isSelected ? 'ring-2 ring-primary/50' : ''} ${snapshot.isDragging ? 'rotate-2 scale-105' : ''}`}>
                                {editMode && <div className="absolute top-4 left-4 z-10">
                                    <Checkbox checked={isSelected} onCheckedChange={checked => handleProjectSelect(project.id, checked as boolean)} className="bg-background/80 backdrop-blur-sm border-2 border-muted/40" />
                                  </div>}
                                
                                {/* Action Menu */}
                                {!editMode && <div className="absolute top-4 right-4 z-10">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <div className="relative overflow-hidden group bg-[#1c1c1f] border border-[#6a6a71] text-white rounded-full h-8 w-8 cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors text-xs" onClick={e => e.stopPropagation()}>
                                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" style={{
                                            background: `
                                              radial-gradient(ellipse 40px 30px at 15% 20%, #d78635 0%, transparent 80%),
                                              radial-gradient(ellipse 60px 40px at 70% 30%, #d78635 0%, transparent 80%),
                                              radial-gradient(ellipse 35px 25px at 85% 70%, #d78635 0%, transparent 80%),
                                              radial-gradient(ellipse 80px 50px at 25% 80%, #cc4f6b 0%, transparent 50%),
                                              radial-gradient(ellipse 45px 35px at 90% 15%, #cc4f6b 0%, transparent 60%),
                                              #d0583c`
                                          }} />
                                          <span className="relative z-10 flex items-center justify-center">
                                            <MoreVertical className="h-4 w-4" />
                                          </span>
                                        </div>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end" className="w-48 bg-background/95 backdrop-blur-xl border-muted/20 z-50">
                                        <DropdownMenuItem onClick={e => {
                              e.stopPropagation();
                              handleDeleteSingleProject(project.id);
                            }} className="hover:bg-destructive/10 hover:text-destructive">
                                          <Trash2 className="h-4 w-4 mr-2" />
                                          Delete Project
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={e => {
                              e.stopPropagation();
                              handleMoveSingleProjectToFolder(project.id);
                            }} className="hover:bg-muted/20">
                                          <FolderPlus className="h-4 w-4 mr-2" />
                                          Move to Folder
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={e => {
                              e.stopPropagation();
                              handleReconceptualizeProject(project.id);
                            }} className="hover:bg-muted/20">
                                          <RefreshCw className="h-4 w-4 mr-2" />
                                          Reconceptualize
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>}
                                 <CardContent className="p-6" style={{
                        backgroundColor: '#1c1c1f'
                      }}>
                                     <div className={`w-full aspect-video rounded-xl border-2 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300 ${editMode ? 'mt-8' : ''}`} style={getProjectBackgroundStyle(project, index)} onClick={editMode ? e => {
                          e.stopPropagation();
                          handleProjectSelect(project.id, !isSelected);
                        } : () => handleOpenProject(project)}>
                                      <div className="text-center">
                                        {isSelected && editMode && <Check className="h-8 w-8 text-primary mx-auto mb-2" />}
                                        {(!editMode || !isSelected) && <>
                                            {(() => {
                                const progress = getProjectProgress(project);
                                switch (progress.step) {
                                  case 'generation_complete':
                                    return <>
                                                        <Video className="h-8 w-8 mx-auto mb-2" style={{
                                        color: '#67aa60'
                                      }} />
                                                        <div className="text-xs font-medium" style={{
                                        color: '#67aa60'
                                      }}>
                                                          Generation Complete
                                                        </div>
                                                      </>;
                                  case 'ready_for_generation':
                                    return <>
                                                        <Target className="h-8 w-8 mx-auto mb-2" style={{
                                        color: '#de7a40'
                                      }} />
                                                        <div className="text-xs font-medium" style={{
                                        color: '#de7a40'
                                      }}>
                                                          Ready for Generation
                                                        </div>
                                                      </>;
                                  case 'ready_for_timeline':
                                    return <>
                                                        <FileAudio className="h-8 w-8 mx-auto mb-2" style={{
                                        color: '#2d6ab1'
                                      }} />
                                                        <div className="text-xs font-medium" style={{
                                        color: '#2d6ab1'
                                      }}>
                                                          Ready For Timeline
                                                        </div>
                                                      </>;
                                  case 'ready_for_storyboard':
                                    return <>
                                                        <Music className="h-8 w-8 mx-auto mb-2" style={{
                                        color: '#bc4075'
                                      }} />
                                                        <div className="text-xs font-medium" style={{
                                        color: '#bc4075'
                                      }}>
                                                          Ready for Storyboard
                                                        </div>
                                                      </>;
                                  case 'ready_for_concept':
                                    return <>
                                                        <Music className="h-8 w-8 mx-auto mb-2" style={{
                                        color: '#cdbd55'
                                      }} />
                                                        <div className="text-xs font-medium" style={{
                                        color: '#cdbd55'
                                      }}>
                                                          Ready for Concept
                                                        </div>
                                                      </>;
                                  case 'processing':
                                    return <>
                                                        <Music className="h-8 w-8 mx-auto mb-2" style={{
                                        color: '#cdbd55'
                                      }} />
                                                        <div className="text-xs font-medium" style={{
                                        color: '#cdbd55'
                                      }}>
                                                          Processing
                                                        </div>
                                                      </>;
                                  default:
                                    return <>
                                                       <Plus className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                                       <div className="text-xs text-muted-foreground font-medium">
                                                         Add Audio
                                                       </div>
                                                     </>;
                                }
                              })()}
                                          </>}
                                      </div>
                                    </div>
                                   
                                   <div className="space-y-2">
                                     <h3 className="font-semibold text-foreground truncate" title={project.name}>
                                       {project.name}
                                     </h3>
                                     
                                      <p className="text-sm text-muted-foreground line-clamp-2">
                                        {project.description || "Music video project"}
                                      </p>

                                      {(() => {
                            const progress = getProjectProgress(project);
                            const stepLabels = {
                              'generation_complete': {
                                label: 'Generation Complete',
                                color: '#67aa60'
                              },
                              'ready_for_generation': {
                                label: 'Ready for Generation',
                                color: '#de7a40'
                              },
                              'ready_for_timeline': {
                                label: 'Ready For Timeline',
                                color: '#2d6ab1'
                              },
                              'ready_for_storyboard': {
                                label: 'Ready for Storyboard',
                                color: '#bc4075'
                              },
                              'ready_for_concept': {
                                label: 'Ready for Concept',
                                color: '#cdbd55'
                              },
                              'processing': {
                                label: 'Processing',
                                color: '#cdbd55'
                              },
                              'empty': {
                                label: 'Add Audio File',
                                color: '#6a6a71'
                              }
                            };
                            const stepInfo = stepLabels[progress.step] || stepLabels['empty'];
                            return <div className="flex items-center gap-2 text-xs px-2 py-1 rounded" style={{
                              color: stepInfo.color
                            }}>
                                             <div className="w-2 h-2 rounded-full bg-current opacity-60" />
                                             {stepInfo.label}
                                           </div>;
                          })()}
                                     
                                     <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                                       <span>
                                         {new Date(project.created_at).toLocaleDateString()}
                                       </span>
                                       {project.audio_file_name && <span className="truncate ml-2 max-w-[100px]" title={project.audio_file_name}>
                                           {project.audio_file_name}
                                         </span>}
                                     </div>

                                     {!editMode && <div className="pt-2">
                                              <div className={`gradient-button w-full text-xs rounded-[35px] inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3 cursor-pointer ${project.audio_file_name && !project.audio_analysis ? 'hover:opacity-85 transition-opacity duration-300 text-white' : project.audio_analysis ? 'hover:opacity-80 transition-opacity duration-300 relative overflow-hidden group bg-[#1c1c1f] border border-[#6a6a71] text-white' : 'bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white'}`} style={project.audio_file_name && !project.audio_analysis ? {
                              background: `
                                                    radial-gradient(ellipse 40px 30px at 15% 20%, #d78635 0%, transparent 80%),
                                                    radial-gradient(ellipse 60px 40px at 70% 30%, #d78635 0%, transparent 80%),
                                                    radial-gradient(ellipse 35px 25px at 85% 70%, #d78635 0%, transparent 80%),
                                                    radial-gradient(ellipse 80px 50px at 25% 80%, #cc4f6b 0%, transparent 50%),
                                                    radial-gradient(ellipse 45px 35px at 90% 15%, #cc4f6b 0%, transparent 60%),
                                                    #d0583c`
                            } : undefined} onClick={e => {
                              e.stopPropagation();
                              handleOpenProject(project);
                            }}>
                                                {project.audio_analysis && <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[35px]" style={{
                                background: `
                                                        radial-gradient(ellipse 40px 30px at 15% 20%, #d78635 0%, transparent 80%),
                                                        radial-gradient(ellipse 60px 40px at 70% 30%, #d78635 0%, transparent 80%),
                                                        radial-gradient(ellipse 35px 25px at 85% 70%, #d78635 0%, transparent 80%),
                                                        radial-gradient(ellipse 80px 50px at 25% 80%, #cc4f6b 0%, transparent 50%),
                                                        radial-gradient(ellipse 45px 35px at 90% 15%, #cc4f6b 0%, transparent 60%),
                                                        #d0583c`
                              }} />}
                                               <span className="relative z-10 flex items-center justify-center">
                                                 {project.audio_file_name && !project.audio_analysis ? <>
                                                     <Music className="h-3 w-3 mr-1" />
                                                     <span>Create</span>
                                                   </> : !project.audio_file_name ? <>
                                                     <Upload className="h-3 w-3 mr-1" />
                                                     <span>Upload Audio</span>
                                                   </> : <>
                                                     <Music className="h-4 w-4 mr-2" />
                                                     <span>Open Project</span>
                                                   </>}
                                               </span>
                                            </div>
                                       </div>}
                                   </div>
                                 </CardContent>
                              </Card>}
                          </Draggable>;
                })}
                      {provided.placeholder}
                    </div>}
                </Droppable>
              </div>
            </DragDropContext>}
        </div>
      </main>

      <Dialog open={isCreditsDialogOpen} onOpenChange={setIsCreditsDialogOpen}>
        <DialogContent className="bg-background/95 backdrop-blur-xl border-muted/20 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-foreground">Purchase Credits</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Images cost $0.25 and videos cost $1.00. Credits are stored as USD balance that is required before generating new media.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {creditPackages.map((amount) => {
                const isSelected = selectedCreditAmount === amount;
                return (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setSelectedCreditAmount(amount)}
                    className={`w-full rounded-xl border p-4 text-left transition-all ${isSelected ? 'border-primary bg-primary/10 text-primary-foreground' : 'border-muted/40 hover:border-muted/60 text-foreground'}`}
                  >
                    <p className="text-sm font-semibold">{formatCredits(amount)}</p>
                    <p className="text-xs text-muted-foreground">{Math.floor(amount / 0.25)} image credits</p>
                  </button>
                );
              })}
            </div>
            <div className="space-y-2">
              <Label htmlFor="custom-credit-amount" className="text-sm font-medium text-foreground">
                Custom amount (USD)
              </Label>
              <Input
                id="custom-credit-amount"
                type="number"
                min={5}
                step={1}
                value={selectedCreditAmount}
                onChange={(event) => setSelectedCreditAmount(Math.max(0, Number(event.target.value)))}
                className="bg-background/60 border-muted/40"
              />
              <p className="text-xs text-muted-foreground">
                Minimum purchase is $5. Your current balance is {isAdmin ? 'unlimited (admin)' : formatCredits(userProfile?.credit_balance ?? 0)}.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreditsDialogOpen(false)} className="border-muted/40 hover:bg-muted/20">
              Cancel
            </Button>
            <Button onClick={handlePurchaseCredits} disabled={isCreatingCheckout || selectedCreditAmount < 5} className="bg-primary hover:bg-primary/90">
              {isCreatingCheckout ? 'Redirecting…' : `Checkout ${formatCredits(selectedCreditAmount)}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Folder Dialog */}
      <Dialog open={showCreateFolderDialog} onOpenChange={setShowCreateFolderDialog}>
        <DialogContent className="bg-background/95 backdrop-blur-xl border-muted/20 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <Folder className="h-5 w-5 text-primary" />
              Create New Folder
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Organize your projects by creating folders. Choose a name and color for easy identification.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="folder-name" className="text-sm font-medium">
                Folder Name *
              </Label>
              <Input id="folder-name" placeholder="Enter folder name" value={folderForm.name} onChange={e => handleFolderFormChange('name', e.target.value)} className={folderErrors.name ? "border-destructive" : ""} maxLength={50} />
              {folderErrors.name && <p className="text-sm text-destructive">{folderErrors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="folder-description" className="text-sm font-medium">
                Description (Optional)
              </Label>
              <Textarea id="folder-description" placeholder="Brief description of this folder" value={folderForm.description} onChange={e => handleFolderFormChange('description', e.target.value)} className={folderErrors.description ? "border-destructive resize-none" : "resize-none"} rows={2} maxLength={200} />
              {folderErrors.description && <p className="text-sm text-destructive">{folderErrors.description}</p>}
              <p className="text-xs text-muted-foreground">
                {folderForm.description.length}/200 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Folder Color</Label>
              <div className="grid grid-cols-4 gap-2">
                {[{
                value: 'primary',
                class: 'bg-primary',
                label: 'Primary'
              }, {
                value: 'secondary',
                class: 'bg-secondary',
                label: 'Secondary'
              }, {
                value: 'accent',
                class: 'bg-accent',
                label: 'Accent'
              }, {
                value: 'accent-blue',
                class: 'bg-accent-blue',
                label: 'Blue'
              }, {
                value: 'accent-yellow',
                class: 'bg-accent-yellow',
                label: 'Yellow'
              }, {
                value: 'accent-pink',
                class: 'bg-accent-pink',
                label: 'Pink'
              }, {
                value: 'accent-orange',
                class: 'bg-accent-orange',
                label: 'Orange'
              }].map(color => <button key={color.value} type="button" onClick={() => handleFolderFormChange('color', color.value)} className={`w-full h-12 rounded-lg border-2 transition-all duration-200 ${color.class} ${folderForm.color === color.value ? 'border-foreground scale-105' : 'border-muted/40 hover:border-muted/60'}`} title={color.label}>
                    {folderForm.color === color.value && <Check className="h-4 w-4 text-white mx-auto" />}
                  </button>)}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateFolderDialog(false)} disabled={creatingFolder} className="border-muted/40 hover:bg-muted/20">
              Cancel
            </Button>
            <div className="gradient-button relative overflow-hidden group bg-[#1c1c1f] border border-[#6a6a71] text-white rounded-full h-10 px-4 py-2 cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors text-xs font-normal" onClick={handleCreateFolderSubmit} style={creatingFolder || !folderForm.name.trim() ? {opacity: 0.5, pointerEvents: 'none'} : {}}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" style={{
                background: `
                  radial-gradient(ellipse 40px 30px at 15% 20%, #d78635 0%, transparent 80%),
                  radial-gradient(ellipse 60px 40px at 70% 30%, #d78635 0%, transparent 80%),
                  radial-gradient(ellipse 35px 25px at 85% 70%, #d78635 0%, transparent 80%),
                  radial-gradient(ellipse 80px 50px at 25% 80%, #cc4f6b 0%, transparent 50%),
                  radial-gradient(ellipse 45px 35px at 90% 15%, #cc4f6b 0%, transparent 60%),
                  #d0583c`
              }} />
              <span className="relative z-10 flex items-center justify-center">
                {creatingFolder ? "Creating..." : "Create Folder"}
              </span>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-background/95 backdrop-blur-xl border-muted/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Delete Projects</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete {selectedProjects.size} project{selectedProjects.size > 1 ? 's' : ''}? 
              This action cannot be undone and will also delete associated audio files.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-muted/40 hover:bg-muted/20">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSelected} disabled={deleting} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              {deleting ? "Deleting..." : "Delete Projects"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
};
export default Dashboard;
