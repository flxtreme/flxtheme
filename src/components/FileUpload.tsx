import React, { useRef } from 'react';
import { cn } from '../utils/cn';

export interface FileUploadProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  onFilesSelected?: (files: File[]) => void;
  helperText?: string;
}

export const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      label = 'Upload files',
      accept = '*',
      maxSize,
      multiple = true,
      onFilesSelected,
      helperText,
      className = '',
      ...props
    },
    ref
  ) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = React.useState(false);
    const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(e.type === 'dragenter' || e.type === 'dragover');
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      const files = Array.from(e.dataTransfer.files);
      processFiles(files);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      processFiles(files);
    };

    const processFiles = (files: File[]) => {
      const validFiles = files.filter(file => {
        if (maxSize && file.size > maxSize) {
          return false;
        }
        return true;
      });
      setSelectedFiles(validFiles);
      onFilesSelected?.(validFiles);
    };

    return (
      <div
        ref={ref}
        className={cn('flx-file-upload', className)}
        {...props}
      >
        {label && (
          <label className="flx-file-upload__label block text-sm font-medium text-foreground mb-2">
            {label}
          </label>
        )}

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={cn(
            'flx-file-upload__zone relative w-full px-6 py-8 border-2 border-dashed rounded-flx transition-all duration-200 text-center cursor-pointer',
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 bg-surface'
          )}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileInput}
            className="sr-only"
          />

          <svg
            className={cn(
              'w-10 h-10 mx-auto mb-2 transition-colors',
              dragActive ? 'text-primary' : 'text-foreground-muted'
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>

          <p className={cn(
            'flx-file-upload__text text-sm font-medium',
            dragActive ? 'text-primary' : 'text-foreground'
          )}>
            {dragActive ? 'Drop files here' : 'Drag and drop or click to upload'}
          </p>

          {helperText && (
            <p className="flx-file-upload__helper text-xs text-foreground-muted mt-1">
              {helperText}
            </p>
          )}
        </div>

        {selectedFiles.length > 0 && (
          <div className="flx-file-upload__files mt-4">
            <p className="text-xs font-semibold text-foreground-muted mb-2">
              {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
            </p>
            <ul className="space-y-1">
              {selectedFiles.map((file, idx) => (
                <li key={idx} className="text-xs text-foreground bg-surface px-2 py-1 rounded truncate">
                  {file.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';
