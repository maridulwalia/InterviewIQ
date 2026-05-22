import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  FileText, Calendar, Trash2, Download, ExternalLink, 
  UploadCloud, CheckCircle2, AlertCircle, FileSearch, ShieldCheck 
} from "lucide-react";
import { getBackendUrl, resumeApi, type Resume } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import AnimatedPage from "@/components/AnimatedPage";
import { CardSkeleton } from "@/components/LoadingSkeleton";
import { useNavigate } from "react-router-dom";

export default function ResumeManagement() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const res = await resumeApi.getMyResume();
      setResume(res.data.resume);
    } catch (err) {
      console.error("Failed to fetch resume:", err);
      toast({ title: "Error", description: "Failed to load resume details.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!resume || !window.confirm("Are you sure you want to delete your resume? This will reset your interview context.")) return;
    
    setDeleting(true);
    try {
      await resumeApi.delete(resume._id);
      setResume(null);
      toast({ title: "Deleted", description: "Resume removed successfully." });
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete resume.", variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading) {
    return (
      <AnimatedPage>
        <div className="container mx-auto px-4 py-12 max-w-4xl space-y-6">
          <div className="h-48 glass-card animate-pulse" />
          <div className="h-96 glass-card animate-pulse" />
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 py-10 max-w-4xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Resume <span className="gradient-text">Management</span></h1>
          <p className="text-muted-foreground mt-1">Manage your professional profile and interview context.</p>
        </div>

        {!resume ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-12 text-center space-y-6"
          >
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
              <UploadCloud className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="max-w-md mx-auto">
              <h2 className="text-xl font-semibold mb-2">No Resume Uploaded</h2>
              <p className="text-muted-foreground">Upload your resume to start getting personalized AI-generated interview questions.</p>
            </div>
            <button 
              onClick={() => navigate("/upload")}
              className="btn-primary-glow px-8 py-3"
            >
              Upload Now
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {/* Status & Basic Info */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                  <FileText className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{resume.originalName}</h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(resume.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{formatSize(resume.size)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a 
                  href={getBackendUrl(resume.fileUrl)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  <ExternalLink className="w-4 h-4" /> Preview
                </a>
                <button 
                  onClick={() => navigate("/upload")}
                  className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  Replace
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" /> {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>

            {/* Extracted Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card overflow-hidden"
            >
              <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileSearch className="w-4 h-4 text-primary" />
                  <h4 className="text-sm font-semibold">Extracted Content</h4>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded text-[10px] font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3" /> AI Indexed
                </div>
              </div>
              <div className="p-6 max-h-[500px] overflow-y-auto custom-scrollbar">
                {resume.extractedText ? (
                  <pre className="whitespace-pre-wrap font-sans text-sm text-muted-foreground leading-relaxed">
                    {resume.extractedText}
                  </pre>
                ) : (
                  <div className="py-20 text-center space-y-3">
                    <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">No text content could be extracted from this file.</p>
                  </div>
                )}
              </div>
            </motion.div>
            
            {/* Status Footer */}
            <div className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Resume is currently being used to generate interview questions for you.</span>
            </div>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
}
