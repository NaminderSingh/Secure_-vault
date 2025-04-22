import { useState, useEffect } from "react";
import axios from "axios";
import { useWeb3Context } from "../contexts/useWeb3Context";
import {
  Lock,
  Image,
  Share2,
  Upload,
  Plus,
  UserPlus,
  Clock,
  Search,
  Filter,
  ChevronRight,
  X,
  Shield
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Activity item component
const ActivityItem = ({ icon: Icon, title, time, message, isNew }) => (
  <div className={`p-4 border-b border-gray-800 flex items-start gap-4 ${isNew ? "bg-purple-900/10" : ""}`}>
    <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center shrink-0">
      <Icon size={18} className="text-purple-300" />
    </div>
    <div className="flex-grow">
      <div className="flex justify-between items-start">
        <h4 className="font-medium text-white">{title}</h4>
        <span className="text-xs text-gray-400">{time}</span>
      </div>
      <p className="text-sm text-gray-300 mt-1">{message}</p>
    </div>
    {isNew && (
      <span className="shrink-0 bg-purple-500 text-xs px-2 py-1 rounded-full text-white">New</span>
    )}
  </div>
);

// Stat card component
const StatCard = ({ icon: Icon, title, value, change, changeType = "neutral" }) => {
  const getChangeColor = () => {
    if (changeType === "positive") return "text-green-400";
    if (changeType === "negative") return "text-red-400";
    return "text-gray-400";
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-lg bg-purple-900/30 flex items-center justify-center">
          <Icon size={24} className="text-purple-400" />
        </div>
        {change && (
          <span className={`text-xs ${getChangeColor()}`}>
            {change}
          </span>
        )}
      </div>
      <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
};

// Image thumbnail component
const ImageThumbnail = ({ src, name }) => (
  <div className="group relative bg-gray-800 rounded-lg overflow-hidden aspect-square hover:ring-2 hover:ring-purple-500 transition-all">
    <img 
      src={src} 
      alt={name} 
      className="w-full h-full object-cover group-hover:opacity-50 transition-opacity"
    />
    <div className="absolute top-2 right-2 bg-blue-900/70 p-1 rounded-full">
      <Lock size={14} className="text-blue-300" />
    </div>
    <div className="absolute inset-0 flex flex-col justify-end p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
      <h4 className="text-white font-medium text-sm truncate">{name}</h4>
    </div>
  </div>
);

// Quick action button component
const QuickActionButton = ({ icon: Icon, label, onClick, primary = false }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-300 ${
      primary 
        ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-transparent text-white"
        : "border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white"
    }`}
  >
    <Icon size={18} />
    <span>{label}</span>
  </button>
);

// Usage chart component
const UsageChart = ({ size }) => (
  <div className="mt-4">
    <div className="flex justify-between text-xs text-gray-500 mb-1">
      <span>0 MB</span>
      <span>500 MB</span>
    </div>
    <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden">
      <div 
        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" 
        style={{ width: `${(size / 50) * 100}%` }}
      ></div>
    </div>
    <div className="flex justify-between text-xs text-gray-400 mt-2">
      <span>{size.toFixed(2)} MB used</span>
      <span>{(50 - size).toFixed(2)} MB free</span>
    </div>
  </div>
);

const Dashboard = ({ reload }) => {
  const navigate = useNavigate();
  const { web3State } = useWeb3Context();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sizeMB, setSizeMB] = useState(0);
  const { selectedAccount, contractInstance } = web3State;

  const handleNavigate = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const getImages = async () => {
      try {
        if (!selectedAccount || !contractInstance) return;
        setLoading(true);

        const fileList = await contractInstance.viewFiles(selectedAccount);
        const files = Object.values(fileList);

        if (!files.length) {
          setImages([]);
          setSizeMB(0);
          return;
        }

        const ipfsHashArray = files.map(f => f.ipfsHash);
        const token = localStorage.getItem("token");
        const config = {
          headers: { "x-access-token": token },
        };

        const res = await axios.post("http://localhost:3000/api/getImage", ipfsHashArray, config);
        const decryptedImages = res.data.decryptedImageArr || [];

        const finalImageList = decryptedImages.map((imgData, index) => ({
          image: imgData,
          name: files[index]?.fileName || `Image ${index + 1}`,
        }));

        const getBase64Size = (base64String) => {
          const padding = (base64String.match(/=*$/) || [''])[0].length;
          return (base64String.length * 3) / 4 - padding;
        };

        const totalSizeBytes = decryptedImages.reduce((total, base64) => {
          return total + getBase64Size(base64);
        }, 0);

        const totalSizeMB = totalSizeBytes / (1024 * 1024);

        setImages(finalImageList);
        setSizeMB(totalSizeMB);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getImages();
  }, [contractInstance, selectedAccount, reload]);

  const activity = [
    { icon: Upload, title: "Image Upload", time: "Just now", message: "vacation_photo_23.jpg was encrypted and uploaded successfully.", isNew: true },
    { icon: UserPlus, title: "Access Granted", time: "2 hours ago", message: "You granted access to 0x7Fc...3A4e for 3 images in 'Family Photos'.", isNew: false },
    { icon: Share2, title: "New Share", time: "Yesterday", message: "0x8Ab...7F2d shared 5 images with you.", isNew: false },
    { icon: Clock, title: "Encryption Process", time: "2 days ago", message: "Batch encryption of 12 images completed.", isNew: false }
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-[80px] pb-10">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 -left-10 w-72 h-72 bg-purple-600/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full filter blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to Your Secure Vault</h1>
          <p className="text-gray-400">Your encrypted images are safe and accessible only to you and your approved contacts.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={Image} title="Total Images" value={images.length} change="" changeType="positive" />
              <StatCard icon={Lock} title="Encrypted" value="100%" change="AES-256" changeType="positive" />
              <StatCard icon={Share2} title="Shared" value={images.length} />
              <StatCard icon={Shield} title="Security Score" value="98%" change="" changeType="positive" />
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="flex flex-wrap gap-3">
                <QuickActionButton icon={Upload} label="Upload Images" onClick={() => handleNavigate('/upload')} primary />
                <QuickActionButton icon={Image} label="View Gallery" onClick={() => handleNavigate('/myfiles')} />
                <QuickActionButton icon={Share2} label="Manage Sharing" onClick={() => handleNavigate('/settings/sharing')} />
                <QuickActionButton icon={Plus} label="Create Album" onClick={() => handleNavigate('/gallery/create-album')} />
              </div>
            </div>

            {/* Recent Images */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Recent Images</h2>
                <button onClick={() => handleNavigate('/myfiles')} className="text-sm text-purple-400 hover:text-purple-300 flex items-center">
                  View all <ChevronRight size={16} />
                </button>
              </div>
              {loading ? (
                <p className="text-center text-gray-400">Loading...</p>
              ) : images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {images.map(({ image, name }, index) => (
                    <ImageThumbnail key={index} src={`data:image/jpeg;base64,${image}`} name={name} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">No images found</p>
              )}
            </div>

            {/* Storage Usage */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Storage Usage</h2>
                <button className="text-sm text-purple-400 hover:text-purple-300">Upgrade Storage</button>
              </div>
              {!loading && <UsageChart size={sizeMB} />}
            </div>
          </div>

          {/* Right column - Activity */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl p-4">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input type="text" placeholder="Search images..." className="w-full bg-black/30 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-gray-800">
                <h2 className="text-xl font-bold">Recent Activity</h2>
                <div className="flex items-center gap-2">
                  <button className="p-1 hover:bg-gray-700 rounded-full"><Filter size={16} className="text-gray-400" /></button>
                  <button className="p-1 hover:bg-gray-700 rounded-full"><X size={16} className="text-gray-400" /></button>
                </div>
              </div>
              <div className="max-h-[600px] overflow-y-auto">
                {activity.map((item, index) => (
                  <ActivityItem key={index} {...item} />
                ))}
              </div>
              <div className="p-4 text-center">
                <button className="text-sm text-purple-400 hover:text-purple-300">View All Activity</button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Security Status</h2>
              <div className="space-y-3">
                {["Encryption", "Blockchain Security", "Wallet Connected"].map((title, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Shield size={16} className="text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium">{title}</h4>
                      <p className="text-sm text-gray-400">
                        {title === "Encryption"
                          ? "AES-256-CBC active"
                          : title === "Blockchain Security"
                          ? "Access controls verified"
                          : "Keys secured"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
