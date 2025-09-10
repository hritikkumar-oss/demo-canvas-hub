import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FileVideo, Image, Trash2, RotateCcw, CheckCircle, XCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UploadItem {
  id: string;
  name: string;
  type: 'video' | 'thumbnail';
  target: string;
  size: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  preview?: string;
}

const AdminPortalUploads: React.FC = () => {
  const { toast } = useToast();
  const [uploads, setUploads] = useState<UploadItem[]>([
    {
      id: '3',
      name: 'setup-guide-video.mp4',
      type: 'video',
      target: 'Getting Started Guide',
      size: '89 MB',
      progress: 65,
      status: 'uploading',
    },
    {
      id: '4',
      name: 'broken-upload.mp4',
      type: 'video',
      target: 'Advanced Features',
      size: '156 MB',
      progress: 0,
      status: 'failed',
    },
    {
      id: '5',
      name: 'playlist-cover.jpg',
      type: 'thumbnail',
      target: 'My First Playlist',
      size: '2.1 MB',
      progress: 95,
      status: 'processing',
    },
  ]);

  // Remove file upload functionality since uploads happen via modals

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const simulateUpload = (id: string) => {
    const interval = setInterval(() => {
      setUploads(prev => prev.map(upload => {
        if (upload.id === id && upload.status === 'uploading') {
          const newProgress = Math.min(upload.progress + Math.random() * 15, 100);
          const isComplete = newProgress >= 100;
          
          if (isComplete) {
            clearInterval(interval);
            // Auto-remove completed uploads after 3 seconds
            setTimeout(() => {
              setUploads(prev => prev.filter(u => u.id !== id));
            }, 3000);
            toast({
              title: "Upload completed",
              description: `${upload.name} has been uploaded successfully.`,
            });
          }

          return {
            ...upload,
            progress: newProgress,
            status: isComplete ? 'completed' : 'uploading',
          };
        }
        return upload;
      }));
    }, 500);
  };

  const handleRetry = (id: string) => {
    setUploads(prev => prev.map(upload => 
      upload.id === id 
        ? { ...upload, progress: 0, status: 'uploading' }
        : upload
    ));
    simulateUpload(id);
  };

  const handleCancel = (id: string) => {
    setUploads(prev => prev.filter(upload => upload.id !== id));
    toast({
      title: "Upload cancelled",
      description: "Upload has been cancelled and removed from the queue.",
    });
  };

  const getStatusIcon = (status: UploadItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: UploadItem['status']) => {
    switch (status) {
      case 'uploading':
        return <Badge variant="outline">Uploading</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Processing</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Upload Queue</h1>
          <p className="text-muted-foreground mt-1">Monitor ongoing uploads and processing</p>
        </div>
      </div>

      {/* Upload Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Active Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {uploads.map((upload) => (
              <div key={upload.id} className="grid grid-cols-12 gap-4 p-4 border rounded-lg items-center">
                {/* File Icon */}
                <div className="col-span-1">
                  {upload.type === 'video' ? (
                    <FileVideo className="h-6 w-6 text-blue-500" />
                  ) : (
                    <Image className="h-6 w-6 text-green-500" />
                  )}
                </div>

                {/* File Name */}
                <div className="col-span-3">
                  <div className="font-medium truncate">{upload.name}</div>
                  <div className="text-sm text-muted-foreground">{upload.size}</div>
                </div>

                {/* Type */}
                <div className="col-span-1">
                  <Badge variant="outline" className="capitalize">
                    {upload.type}
                  </Badge>
                </div>

                {/* Target */}
                <div className="col-span-3">
                  <div className="text-sm font-medium truncate">{upload.target}</div>
                </div>

                {/* Progress */}
                <div className="col-span-2">
                  {(upload.status === 'uploading' || upload.status === 'processing') && (
                    <div className="space-y-1">
                      <Progress value={upload.progress} className="h-2" />
                      <div className="text-xs text-muted-foreground text-center">
                        {Math.round(upload.progress)}%
                      </div>
                    </div>
                  )}
                </div>

                {/* Status & Actions */}
                <div className="col-span-2 flex items-center justify-end gap-2">
                  {getStatusBadge(upload.status)}
                  {getStatusIcon(upload.status)}
                  
                  {upload.status === 'failed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRetry(upload.id)}
                    >
                      <RotateCcw className="h-3 w-3" />
                    </Button>
                  )}
                  
                  {(upload.status === 'uploading' || upload.status === 'failed') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCancel(upload.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {uploads.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <div className="mb-4">
                  <FileVideo className="h-12 w-12 mx-auto text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No active uploads</h3>
                <p>Files will appear here when you upload them via Add Video, Add Product, or Add Playlist modals.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPortalUploads;