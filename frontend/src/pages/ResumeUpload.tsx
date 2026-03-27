import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, CheckCircle, ArrowRight } from "lucide-react";
import AnimatedPage from "@/components/AnimatedPage";
import { resumeApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFile = (f: File) => {
    const validNames = f.name.toLowerCase();
    if (!f.type.includes("pdf") && !f.type.includes("word") && !f.type.includes("text/plain") && !validNames.endsWith(".pdf") && !validNames.endsWith(".docx") && !validNames.endsWith(".doc") && !validNames.endsWith(".txt")) {
      toast({ title: "Invalid file", description: "Please upload a PDF, DOCX, or TXT document.", variant: "destructive" });
      return;
    }
    setFile(f);
    setSuccess(false);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      await resumeApi.upload(file);
      setSuccess(true);
      toast({ title: "Resume uploaded!", description: "Redirecting to interview..." });
      // Auto-navigate to interview after short delay
      setTimeout(() => navigate("/interview"), 1500);
    } catch {
      toast({ title: "Upload failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 py-12 max-w-xl">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-bold mb-6">
          Upload Resume
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`glass-card border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-300 ${
            dragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-border hover:border-primary/50"
          }`}
          onClick={() => !success && document.getElementById("fileInput")?.click()}
        >
          <input id="fileInput" type="file" className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div key="success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-3">
                <CheckCircle className="w-12 h-12 text-primary" />
                <p className="font-medium">Upload complete!</p>
                <p className="text-sm text-muted-foreground">Taking you to your interview...</p>
              </motion.div>
            ) : file ? (
              <motion.div key="file" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3">
                <FileText className="w-12 h-12 text-primary" />
                <p className="font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3">
                <Upload className="w-12 h-12 text-muted-foreground" />
                <p className="font-medium">Drop your resume here</p>
                <p className="text-sm text-muted-foreground">PDF, DOCX, or TXT, max 5MB</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Upload button */}
        {file && !success && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpload}
              disabled={uploading}
              className="btn-primary-glow w-full py-3 disabled:opacity-50"
            >
              {uploading ? (
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="inline-block w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" />
              ) : "Upload Resume"}
            </motion.button>
          </motion.div>
        )}

        {/* Manual CTA after success */}
        {success && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/interview")}
              className="btn-primary-glow w-full py-3 flex items-center justify-center gap-2"
            >
              Start Interview <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </AnimatedPage>
  );
}
