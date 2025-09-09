import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, FileVideo, Image, Trash2, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UploadItem {
  id: string;
  name: string;
  type: 'video' | 'image';
  size: string;
  progress: number;
  status: 'uploading' | 'completed' | 'failed';
  preview?: string;
}

const StudioUploads: React.FC = () => {
  const { toast } = useToast();
  const [uploads, setUploads] = useState<UploadItem[]>([
    {
      id: '1',
      name: 'advanced-features-tutorial.mp4',
      type: 'video',
      size: '125 MB',
      progress: 100,
      status: 'completed',
    },
    {
      id: '2',
      name: 'getting-started-thumbnail.jpg',
      type: 'image',
      size: '2.1 MB',
      progress: 100,
      status: 'completed',
    },
    {
      id: '3',
      name: 'setup-guide-video.mp4',
      type: 'video',
      size: '89 MB',
      progress: 65,
      status: 'uploading',
    },
    {
      id: '4',
      name: 'broken-upload.mp4',
      type: 'video',
      size: '156 MB',
      progress: 0,
      status: 'failed',
    },
  ]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const newUpload: UploadItem = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          type: file.type.startsWith('video/') ? 'video' : 'image',
          size: formatFileSize(file.size),
          progress: 0,
          status: 'uploading',
        };

        // Create preview for images
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            setUploads(prev => prev.map(upload => 
              upload.id === newUpload.id 
                ? { ...upload, preview: result }
                : upload
            ));
          };
          reader.readAsDataURL(file);
        }

        setUploads(prev => [...prev, newUpload]);

        // Simulate upload progress
        simulateUpload(newUpload.id);
      });
    }
  };

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

  const handleDelete = (id: string) => {
    setUploads(prev => prev.filter(upload => upload.id !== id));
    toast({
      title: "Upload removed",
      description: "Upload has been removed from the queue.",
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
          <h1 className="text-3xl font-bold text-foreground">Uploads</h1>
          <p className="text-muted-foreground mt-1">Manage your video and image uploads</p>
        </div>
      </div>

      {/* Upload Area */}
      <Card>
        <CardContent className="p-8">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <input
              type="file"
              id="file-upload"
              multiple
              accept="video/*,image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Upload Files</h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop your videos and images here, or click to browse
              </p>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Choose Files
              </Button>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Upload Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Queue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {uploads.map((upload) => (
            <div key={upload.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="flex-shrink-0">
                {upload.type === 'video' ? (
                  <FileVideo className="h-8 w-8 text-blue-500" />
                ) : upload.preview ? (
                  <img 
                    src={upload.preview} 
                    alt="Preview" 
                    className="w-12 h-8 object-cover rounded aspect-video"
                  />
                ) : (
                  <Image className="h-8 w-8 text-green-500" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium truncate">{upload.name}</h4>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(upload.status)}
                    {getStatusIcon(upload.status)}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">{upload.size}</span>
                  {upload.status === 'uploading' && (
                    <div className="flex-1 max-w-xs">
                      <Progress value={upload.progress} className="h-2" />
                      <span className="text-xs text-muted-foreground">
                        {Math.round(upload.progress)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {upload.status === 'failed' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRetry(upload.id)}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Retry
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(upload.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {uploads.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No uploads in queue. Upload some files to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudioUploads;