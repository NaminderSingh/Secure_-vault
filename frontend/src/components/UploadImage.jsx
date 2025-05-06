import { useState, useRef, useCallback } from "react";
import axios from "axios";
import { useWeb3Context } from "../contexts/useWeb3Context";
import toast from "react-hot-toast";
import { Lock, ImageIcon, Upload, AlertCircle } from "lucide-react";

const UploadImage = () => {
  const [file, setFile] = useState(null);
  const [fileSize, setFileSize] = useState(0);
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [encryptionProgress, setEncryptionProgress] = useState(0);
  const fileInputRef = useRef(null);

  const { web3State } = useWeb3Context();
  const { contractInstance, selectedAccount } = web3State;

  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const simulateEncryptionProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 100) {
        progress = 100;
        clearInterval(interval);
      }
      setEncryptionProgress(Math.floor(progress));
    }, 300);
    return () => clearInterval(interval);
  };

  const uploadImageHash = async (ipfsHash, name) => {
    try {
      if (!contractInstance) {
        toast.error("Contract instance is not initialized");
        return;
      }

      if (typeof contractInstance.uploadFile !== "function") {
        toast.error("Upload function not available in contract");
        return;
      }

      await toast.promise(
        contractInstance.uploadFile(selectedAccount, ipfsHash, name),
        {
          loading: "Registering on blockchain...",
          success: "Image securely registered on blockchain",
          error: "Blockchain registration failed"
        }
      );
    } catch (error) {
      console.error("Error in uploadImageHash:", error);
      toast.error("Blockchain registration failed");
    }
  };

  const handleImageUpload = async () => {
    try {
      if (!file) {
        toast.error("Please select a file first");
        return;
      }

      if (fileSize > MAX_FILE_SIZE) {
        toast.error("File size exceeds 5MB limit");
        return;
      }

      setUploading(true);
      const clearEncryptionSimulation = simulateEncryptionProgress();

      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token missing");
        setUploading(false);
        return;
      }

      const config = {
        headers: {
          "x-access-token": token
        }
      };

      const res = await axios.post("http://localhost:3000/api/uploadImage", formData, config);

      if (res.data && res.data.ipfsHash) {
        setEncryptionProgress(100);
        toast.success("Image encrypted and uploaded to IPFS");
        await uploadImageHash(res.data.ipfsHash, fileName);
        setFile(null);
        setFileSize(0);
        setFileName("");
        
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error(error);

    } finally {
      setUploading(false);
      setEncryptionProgress(0);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileSize(selectedFile.size);
      setFileName(selectedFile.name);
    }
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(droppedFile.type)) {
        toast.error("Only JPG, JPEG, and PNG files are supported");
        return;
      }
      setFile(droppedFile);
      setFileSize(droppedFile.size);
      setFileName(droppedFile.name);
    }
  }, []);

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full min-h-screen  text-white pt-[170px]  px-4 bg-[#0a0a0a] flex flex-col items-center">
      <div
        className={`w-full max-w-xl mt-6 border-2 border-dashed rounded-xl p-8 transition-all duration-300 text-center cursor-pointer ${
          isDragging
            ? "border-blue-500 bg-blue-800/20"
            : file
            ? "border-green-500 bg-green-900/10"
            : "border-gray-700 hover:border-purple-500 bg-[#0a0a0a] hover:bg-[#111111]"
        }`}
        onClick={!uploading ? openFileDialog : undefined}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          accept=".jpg,.jpeg,.png"
          className="hidden"
          disabled={uploading}
        />

        {uploading ? (
          <div className="flex flex-col items-center py-6">
            <div className="mb-4 relative">
              <div className="w-20 h-20 rounded-full border-4 border-t-purple-500 border-r-blue-500 animate-spin"></div>
              <Lock className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-400" />
            </div>
            <p className="text-lg">Encrypting...</p>
            <div className="w-full max-w-xs mt-4 bg-gray-700 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5"
                style={{ width: `${encryptionProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-400 mt-2">{encryptionProgress}% complete</p>
          </div>
        ) : file ? (
          <div className="py-6">
            <div className="inline-flex items-center gap-3 mb-3 text-purple-400">
              <ImageIcon size={32} />
              <h3 className="text-lg font-semibold text-white">{fileName}</h3>
            </div>
            <p className="text-sm text-gray-500">{formatFileSize(fileSize)}</p>
            {fileSize > MAX_FILE_SIZE && (
              <div className="flex justify-center items-center gap-2 text-red-500 mt-2">
                <AlertCircle size={16} />
                <span>File exceeds 5MB</span>
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                setFileSize(0);
                setFileName("");
              }}
              className="mt-4 text-sm text-gray-400 hover:text-white underline"
            >
              Remove and select a different file
            </button>
          </div>
        ) : (
          <div className="py-10">
            <div className="relative inline-flex mb-4">
              <div className="absolute inset-0 animate-ping bg-purple-700/20 rounded-full w-[72px] h-[72px]"></div>
              <div className="bg-gradient-to-br from-purple-800/40 to-blue-800/40 p-6 rounded-full z-10">
                <Upload size={36} className="text-purple-400" />
              </div>
            </div>
            <h3 className="text-xl font-medium">
              {isDragging ? "Drop your image here" : "Drag & drop your image here"}
            </h3>
            <p className="text-gray-500 mt-2">or click to browse files</p>
            <p className="text-xs text-gray-600 mt-4">Supported: JPG, JPEG, PNG • Max size: 5MB</p>
          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={(e) => {
            e.preventDefault();
            handleImageUpload();
          }}
          disabled={fileSize > MAX_FILE_SIZE || uploading || !file}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-md ${
            fileSize > MAX_FILE_SIZE
              ? "bg-gray-800 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          }`}
        >
          <div className="flex items-center gap-2 justify-center">
            <Lock size={18} />
            Encrypt & Upload
          </div>
        </button>
      </div>

    
    </div>
  );
};

export default UploadImage;
