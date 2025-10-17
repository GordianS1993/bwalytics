import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Visibility,
  CheckCircle,
  Error,
  Pending,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';

interface BWAFile {
  id: number;
  filename: string;
  originalName: string;
  uploadedAt: string;
  status: 'uploaded' | 'processing' | 'processed' | 'failed';
  revenue?: number;
  costs?: number;
  profit?: number;
  profitMargin?: number;
}

const BWAUpload: React.FC = () => {
  const [files, setFiles] = useState<BWAFile[]>([
    {
      id: 1,
      filename: 'bwa_oktober_2024.pdf',
      originalName: 'BWA Oktober 2024.pdf',
      uploadedAt: '2024-10-14T10:30:00Z',
      status: 'processed',
      revenue: 45000,
      costs: 32000,
      profit: 13000,
      profitMargin: 28.9,
    },
    {
      id: 2,
      filename: 'bwa_september_2024.pdf',
      originalName: 'BWA September 2024.pdf',
      uploadedAt: '2024-09-15T14:20:00Z',
      status: 'processed',
      revenue: 42000,
      costs: 30000,
      profit: 12000,
      profitMargin: 28.6,
    },
  ]);
  
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setUploadStatus({
        type: 'error',
        message: 'Nur PDF-Dateien sind erlaubt.',
      });
      return;
    }

    setUploading(true);
    setUploadStatus({ type: null, message: '' });

    try {
      const formData = new FormData();
      formData.append('bwaFile', file);

      // Simuliere Upload (später durch echten API-Call ersetzen)
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newFile: BWAFile = {
        id: Date.now(),
        filename: `bwa_${Date.now()}_${file.name}`,
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
        status: 'processing',
      };

      setFiles(prev => [newFile, ...prev]);
      
      setUploadStatus({
        type: 'success',
        message: 'BWA wurde erfolgreich hochgeladen und wird verarbeitet.',
      });

      // Simuliere Verarbeitung
      setTimeout(() => {
        setFiles(prev => prev.map(f => 
          f.id === newFile.id 
            ? { 
                ...f, 
                status: 'processed' as const,
                revenue: 47000,
                costs: 34000,
                profit: 13000,
                profitMargin: 27.7,
              }
            : f
        ));
      }, 3000);

    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: 'Fehler beim Hochladen der BWA. Bitte versuchen Sie es erneut.',
      });
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  const handleDelete = (id: number) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const getStatusIcon = (status: BWAFile['status']) => {
    switch (status) {
      case 'processed':
        return <CheckCircle sx={{ color: '#22c55e' }} />;
      case 'processing':
        return <CircularProgress size={20} />;
      case 'failed':
        return <Error sx={{ color: '#ef4444' }} />;
      default:
        return <Pending sx={{ color: '#f59e0b' }} />;
    }
  };

  const getStatusText = (status: BWAFile['status']) => {
    switch (status) {
      case 'processed':
        return 'Verarbeitet';
      case 'processing':
        return 'Wird verarbeitet...';
      case 'failed':
        return 'Fehler';
      default:
        return 'Hochgeladen';
    }
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          BWA Upload
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Laden Sie Ihre Betriebswirtschaftliche Auswertung (BWA) hoch für die automatische Analyse.
        </Typography>
      </Box>

      {/* Upload Area */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed',
            borderColor: isDragActive ? 'primary.main' : 'grey.300',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            cursor: uploading ? 'not-allowed' : 'pointer',
            backgroundColor: isDragActive ? 'action.hover' : 'transparent',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'action.hover',
            },
          }}
        >
          <input {...getInputProps()} />
          
          {uploading ? (
            <Box>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography variant="h6">
                BWA wird hochgeladen und verarbeitet...
              </Typography>
            </Box>
          ) : (
            <Box>
              <CloudUpload sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                {isDragActive ? 'PDF hier ablegen...' : 'BWA-PDF hier hochladen'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Ziehen Sie Ihre PDF-Datei hierher oder klicken Sie zum Auswählen
              </Typography>
              <Button variant="contained" disabled={uploading}>
                Datei auswählen
              </Button>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Unterstützte Formate: PDF (max. 50MB)
              </Typography>
            </Box>
          )}
        </Box>

        {/* Upload Status */}
        {uploadStatus.type && (
          <Alert 
            severity={uploadStatus.type} 
            sx={{ mt: 2 }}
            onClose={() => setUploadStatus({ type: null, message: '' })}
          >
            {uploadStatus.message}
          </Alert>
        )}
      </Paper>

      {/* Upload History */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Upload-Historie
        </Typography>
        
        {files.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              Noch keine BWAs hochgeladen
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Datei</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Hochgeladen</TableCell>
                  <TableCell align="right">Umsatz</TableCell>
                  <TableCell align="right">Kosten</TableCell>
                  <TableCell align="right">Gewinn</TableCell>
                  <TableCell align="right">Marge</TableCell>
                  <TableCell align="center">Aktionen</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {file.originalName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getStatusIcon(file.status)}
                        <Typography variant="body2">
                          {getStatusText(file.status)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(file.uploadedAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {formatCurrency(file.revenue)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {formatCurrency(file.costs)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {formatCurrency(file.profit)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      {file.profitMargin && (
                        <Chip
                          label={`${file.profitMargin.toFixed(1)}%`}
                          size="small"
                          color={file.profitMargin > 25 ? 'success' : file.profitMargin > 15 ? 'warning' : 'error'}
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small" title="Details anzeigen">
                        <Visibility />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        title="Löschen"
                        onClick={() => handleDelete(file.id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default BWAUpload;