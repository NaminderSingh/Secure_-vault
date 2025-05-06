import { useState, useEffect } from "react";
import axios from "axios";
import { useWeb3Context } from "../contexts/useWeb3Context";
import {
  Lock,
  Image,
  Share2,
  Upload,
  Plus,
  Shield,
  Clock,
  User,
  ChevronRight,
  TrendingUp,
  Database,
  ServerCrash,
  Info,
  Award,
  FileText,
  Search
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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
      <span>50 MB</span>
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

// Security feature item
const SecurityFeature = ({ icon: Icon, title, description }) => (
  <div className="flex items-start gap-3 p-4 border border-gray-800 rounded-lg hover:border-gray-700 transition-all">
    <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center shrink-0">
      <Icon size={18} className="text-purple-300" />
    </div>
    <div>
      <h4 className="font-medium text-white">{title}</h4>
      <p className="text-sm text-gray-400 mt-1">{description}</p>
    </div>
  </div>
);

// Timeline component
const Timeline = ({ events }) => (
  <div className="relative pl-8 mt-6">
    {events.map((event, index) => (
      <div key={index} className="mb-6 relative">
        <div className="absolute left-[-32px] w-6 h-6 rounded-full bg-purple-900/50 border-2 border-purple-500 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
        </div>
        {index !== events.length - 1 && (
          <div className="absolute left-[-29px] top-6 w-[2px] h-[calc(100%+24px-6px)] bg-gray-700"></div>
        )}
        <div>
          <h4 className="text-white font-medium text-sm">{event.title}</h4>
          <p className="text-gray-400 text-xs mt-1">{event.time}</p>
          <p className="text-gray-300 text-sm mt-2">{event.description}</p>
        </div>
      </div>
    ))}
  </div>
);

const Dashboard = ({ reload }) => {
  const navigate = useNavigate();
  const { web3State } = useWeb3Context();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sizeMB, setSizeMB] = useState(0);
  const { selectedAccount, contractInstance } = web3State;
  const [imageCount, setImageCount] = useState(0);
  const [networkStatus, setNetworkStatus] = useState({ status: "connected", network: "Ethereum Mainnet" });
  const [gasPrice, setGasPrice] = useState("42");
  const [searchQuery, setSearchQuery] = useState("");
  
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
          name: files[index]?.name || `Image ${index + 1}`,
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
    
    const fetchImageCount = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            "x-access-token": token,
          },
        };
    
        const res = await axios.get("http://localhost:3000/api/numberOfImages", config);
    
        setImageCount(res.data.count);
      } catch (err) {
        console.error("Error fetching image count:", err);
      } finally {
        setLoading(false);
      }
    };
    
    // Simulate fetching gas price
    const fetchGasPrice = () => {
      // In a real app, you would fetch from an API
      setGasPrice(Math.floor(Math.random() * (60 - 30) + 30).toString());
    };
    
    fetchImageCount();
    getImages();
    fetchGasPrice();
    
    // Simulate network status change
    const networkInterval = setInterval(() => {
      const statuses = ["connected", "syncing", "connected", "connected"];
      const networks = ["Ethereum Mainnet", "Ethereum Mainnet", "Goerli Testnet"];
      setNetworkStatus({
        status: statuses[Math.floor(Math.random() * statuses.length)],
        network: networks[Math.floor(Math.random() * networks.length)]
      });
    }, 15000);
    
    return () => clearInterval(networkInterval);
  }, [contractInstance, selectedAccount, reload]);


  // Filter images based on search query
  const filteredImages = images.filter(img => 
    img.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to Your Secure Vault</h1>
            <p className="text-gray-400">Your encrypted images are safe and accessible only to you and your approved contacts.</p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={Image} title="Total Images" value={images.length} change="" changeType="positive" />
              <StatCard icon={Lock} title="Encrypted" value="100%" change="AES-256" changeType="positive" />
              <StatCard icon={Share2} title="Shared" value={imageCount} />
              <StatCard icon={Shield} title="Security Score" value="98%" change="" changeType="positive" />
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="flex flex-wrap gap-3">
                <QuickActionButton icon={Upload} label="Upload Images" onClick={() => handleNavigate('/upload')} primary />
                <QuickActionButton icon={Image} label="View Gallery" onClick={() => handleNavigate('/myfiles')} />
                <QuickActionButton icon={User} label="About Us" onClick={() => handleNavigate('/aboutus')} />
               
              </div>
            </div>

            {/* Storage Usage */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Storage Usage</h2>
                
              </div>
              {!loading && <UsageChart size={sizeMB} />}
            </div>
            
            {/* IPFS Status */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">IPFS Network Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Database size={18} className="text-green-400" />
                    <h3 className="font-medium text-white">Content Status</h3>
                  </div>
                  <p className="text-sm text-gray-400">All content pinned</p>
                  <div className="mt-2 flex items-center text-xs">
                    <div className="w-2 h-2 rounded-full bg-green-400 mr-1.5"></div>
                    <span className="text-green-400">Healthy</span>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <ServerCrash size={18} className="text-blue-400" />
                    <h3 className="font-medium text-white">Node Status</h3>
                  </div>
                  <p className="text-sm text-gray-400">3 nodes active</p>
                  <div className="mt-2 flex items-center text-xs">
                    <div className="w-2 h-2 rounded-full bg-green-400 mr-1.5"></div>
                    <span className="text-green-400">Operational</span>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp size={18} className="text-purple-400" />
                    <h3 className="font-medium text-white">Gateway Health</h3>
                  </div>
                  <p className="text-sm text-gray-400">25ms response time</p>
                  <div className="mt-2 flex items-center text-xs">
                    <div className="w-2 h-2 rounded-full bg-green-400 mr-1.5"></div>
                    <span className="text-green-400">Optimal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Security Status */}
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
{/* recent images */}
<div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl p-6">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-bold">Recent Images</h2>
    <button
      onClick={() => handleNavigate('/myfiles')}
      className="text-sm text-purple-400 hover:text-purple-300 flex items-center"
    >
      View all <ChevronRight size={16} />
    </button>
  </div>

  {/* Search Bar */}
  <div className="relative mb-4">
    <input
      type="text"
      placeholder="Search images..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
    />
    <Search size={18} className="absolute left-3 top-2.5 text-gray-500" />
  </div>

  {/* Adjusted Grid */}
  <div className="pb-2">
    {loading ? (
      <div className="flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    ) : filteredImages.length > 0 ? (
      <div className="grid grid-cols-2 gap-4">
        {filteredImages.slice(0, 4).map(({ image, name }, index) => (
          <div key={index} className="p-1 rounded-xl hover:z-10 focus-within:ring-2 focus-within:ring-purple-500">
            <ImageThumbnail
              src={`data:image/jpeg;base64,${image}`}
              name={name}
            />
          </div>
        ))}
      </div>
    ) : (
      <div className="flex items-center justify-center">
        <p className="text-gray-500">
          {searchQuery ? "No matching images found" : "No images found"}
        </p>
      </div>
    )}
  </div>
</div>


            {/* Enhanced Security Features */}
            
          </div>
        </div>
        
        {/* Bottom Full Width Sections */}
        <div className="mt-6 space-y-6">
          {/* Documentation and Resources */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Resources & Documentation</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-colors">
                <FileText className="text-purple-400 mb-2" size={24} />
                <h3 className="text-white font-medium mb-1">User Guide</h3>
                <p className="text-sm text-gray-400 mb-3">Learn how to use all features of your secure vault.</p>
                <button onClick={() => handleNavigate('/userguide')} className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
                  Read Guide <ChevronRight size={14} />
                </button>
              </div>
              
              <div className="p-4 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-colors">
                <Info className="text-blue-400 mb-2" size={24} />
                <h3 className="text-white font-medium mb-1">Technical Docs</h3>
                <p className="text-sm text-gray-400 mb-3">Understand the encryption and blockchain technology.</p>
                <button className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
                  View Docs <ChevronRight size={14} />
                </button>
              </div>
              
              <div className="p-4 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-colors">
                <Award className="text-green-400 mb-2" size={24} />
                <h3 className="text-white font-medium mb-1">Best Practices</h3>
                <p className="text-sm text-gray-400 mb-3">Security recommendations for your encrypted content.</p>
                <button className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
                  Learn More <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Footer information */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Your data is encrypted with AES-256-CBC and secured on IPFS with Ethereum blockchain verification.
            </p>
            <div className="flex justify-center gap-4 mt-3">
              <button className="text-xs text-purple-400 hover:text-purple-300">Privacy Policy</button>
              <button className="text-xs text-purple-400 hover:text-purple-300">Terms of Service</button>
              <button className="text-xs text-purple-400 hover:text-purple-300">Contact Support</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;