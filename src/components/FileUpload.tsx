import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, File, Loader2, Shield, AlertTriangle, CheckCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { validateFileType, validateFileSize } from "@/utils/security";

interface ScanResult {
  status: 'safe' | 'warning' | 'danger';
  score?: number;
  details?: string;
  threats?: string[];
}

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Security: File validation
      if (!validateFile(selectedFile)) {
        return;
      }
      setFile(selectedFile);
      setResult(null);
    }
  };

  const validateFile = (file: File): boolean => {
    // File size validation
    if (!validateFileSize(file, 100)) {
      toast({
        title: "File Too Large",
        description: "Maximum file size is 100MB",
        variant: "destructive",
      });
      return false;
    }

    // File type validation
    if (!validateFileType(file)) {
      toast({
        title: "Invalid File Type",
        description: "Please select a supported file type",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      if (!validateFile(droppedFile)) {
        return;
      }
      setFile(droppedFile);
      setResult(null);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const removeFile = () => {
    setFile(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleScan = async () => {
    if (!file) {
      toast({
        title: "File Required",
        description: "Please select a file to scan",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Security: Use AbortController for request timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout for file uploads

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://n8n-main.2wcwas.easypanel.host/webhook-test/check-file', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`File scan failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Secure data parsing with validation
      const apiResult = Array.isArray(data) ? data[0] : data;
      
      if (!apiResult || typeof apiResult !== 'object') {
        throw new Error('Invalid response format');
      }

      const scanResult: ScanResult = {
        status: (apiResult.malicious > 0) ? 'danger' : 
                (apiResult.suspicious > 0) ? 'warning' : 'safe',
        score: Math.round((apiResult.harmless / 
          (apiResult.harmless + apiResult.malicious + apiResult.suspicious + apiResult.undetected)) * 100) || 0,
        details: `File "${file.name}" scanned successfully - ${String(apiResult.status || 'Analysis completed')}`,
        threats: Array.isArray(apiResult.threats) ? 
          apiResult.threats.map((threat: any) => String(threat)) : []
      };
      
      setResult(scanResult);
      
      toast({
        title: "File Scan Complete",
        description: `"${file.name}" has been analyzed`,
      });
    } catch (error) {
      console.error('File scan error:', error);
      
      let errorMessage = "Unable to scan the file. Please try again.";
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = "File scan timeout. Please try again with a smaller file.";
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = "Network error. Please check your connection.";
        }
      }
      
      toast({
        title: "Scan Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe':
        return <CheckCircle className="h-5 w-5 text-cyber-success" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-cyber-warning" />;
      case 'danger':
        return <Shield className="h-5 w-5 text-cyber-danger" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe':
        return 'text-cyber-success border-cyber-success/30 bg-cyber-success/5';
      case 'warning':
        return 'text-cyber-warning border-cyber-warning/30 bg-cyber-warning/5';
      case 'danger':
        return 'text-cyber-danger border-cyber-danger/30 bg-cyber-danger/5';
      default:
        return '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="scan-card">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <Upload className="h-8 w-8 text-cyber-primary" />
          <div>
            <CardTitle className="text-xl gradient-text">{t('file.scanner')}</CardTitle>
            <CardDescription className="mt-1">
              {t('drag.drop.files')}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className="border-2 border-dashed border-border rounded-lg p-8 text-center transition-colors hover:border-cyber-primary/50"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {file ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 p-4 bg-secondary/50 rounded-lg">
                <File className="h-8 w-8 text-cyber-primary" />
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Button
                onClick={handleScan}
                disabled={loading}
                variant="cyber"
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {t('scanning')}
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    {t('scan.now')}
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <p className="text-lg font-medium text-foreground">
                  {t('drag.drop.files')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('supported.formats')}
                </p>
              </div>
              <Button
                variant="scan"
                onClick={() => fileInputRef.current?.click()}
                className="mx-auto"
              >
                {t('upload.file')}
              </Button>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          accept="*/*"
        />

        {result && (
          <div className={`rounded-lg border p-4 ${getStatusColor(result.status)}`}>
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon(result.status)}
              <span className="font-semibold capitalize">{result.status}</span>
              {result.score && (
                <span className="text-sm opacity-75">
                  Score: {result.score}/100
                </span>
              )}
            </div>
            {result.details && (
              <p className="text-sm opacity-90 mb-2">{result.details}</p>
            )}
            {result.threats && result.threats.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-1">Threats Detected:</p>
                <ul className="text-sm space-y-1">
                  {result.threats.map((threat, index) => (
                    <li key={index} className="flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-current opacity-75"></span>
                      {threat}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUpload;