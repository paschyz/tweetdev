import React, { useRef } from "react";
import toast from "react-hot-toast";

interface FileUploaderProps {
  onFileUpload: (file: File | null) => void;
  uploadedFile: File | null;
  allowedFileType: string; // This will be the type of file that is allowed
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileUpload,
  uploadedFile,
  allowedFileType,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if (fileExtension === allowedFileType.toLowerCase()) {
        onFileUpload(file);
        toast.success(`${file.name} uploaded successfully`);
      } else {
        toast.error(
          `Invalid file type. Please upload a ${allowedFileType} file.`
        );
        onFileUpload(null); // Clear the file state if invalid
      }
    }
  };

  const handleSummaryClick = () => {
    fileInputRef.current?.click();
  };

  const handleDiscardFile = () => {
    onFileUpload(null); // Clear the uploaded file state in the parent component
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input value
    }
  };

  return (
    <div>
      <input
        type="file"
        id="file-upload"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <summary className="btn px-2 min-h-0 h-6" onClick={handleSummaryClick}>
        Upload File
      </summary>
      {uploadedFile && (
        <div className="mt-2 flex items-center">
          <summary className="btn px-2 min-h-0 h-6">
            <span>{uploadedFile.name}</span>
          </summary>
          <summary
            className="btn px-2 min-h-0 h-6 flex justify-center items-center"
            onClick={handleDiscardFile}
          >
            <span className="">X</span>
          </summary>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
