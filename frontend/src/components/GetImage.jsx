import { useWeb3Context } from "../contexts/useWeb3Context";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { 
  ImageIcon, 
  Users, 
  Search, 
  Share2, 
  Trash2, 
  X, 
  Lock, 
  ExternalLink, 
  Clock,
  Copy,
  Check
} from "lucide-react";
import clsx from "clsx";

const MyFilesPage = () => {
  const { web3State } = useWeb3Context();
  const { selectedAccount, contractInstance } = web3State;

  const [tab, setTab] = useState("my");
  const [searchQuery, setSearchQuery] = useState("");
  const [myImages, setMyImages] = useState([]);
  const [sharedImages, setSharedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [copiedHash, setCopiedHash] = useState(null);

  useEffect(() => {
    if (tab === "my") fetchMyImages();
    if (tab === "shared") fetchSharedImages();
    // eslint-disable-next-line
  }, [tab]);

  const fetchMyImages = async () => {
    try {
      if (!selectedAccount || !contractInstance) return;
      setLoading(true);

      const fileList = await contractInstance.viewFiles(selectedAccount);
      const files = Object.values(fileList);

      if (!files.length) return setMyImages([]);

      const ipfsHashArray = files.map((f) => f.ipfsHash);
      const token = localStorage.getItem("token");
      const config = { headers: { "x-access-token": token } };

      const res = await axios.post(
        "http://localhost:3000/api/getImage",
        ipfsHashArray,
        config
      );
      const decryptedImages = res.data.decryptedImageArr || [];

      const finalImageList = decryptedImages.map((imgData, index) => ({
        image: imgData,
        name: files[index]?.name || `Image ${index + 1}`,
        ipfsHash: files[index]?.ipfsHash,
      }));
console.log(finalImageList)
      setMyImages(finalImageList);
    } catch (err) {
      toast.error("No Images Found");
    } finally {
      setLoading(false);
    }
  };

  const fetchSharedImages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = { headers: { "x-access-token": token } };

      const res = await axios.get(
        "http://localhost:3000/api/getSharedImages",
        config
      );
      setSharedImages(res.data.images || []);
    } catch (err) {

      toast.error("No images found");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (index) => {
    try {
      await contractInstance.deleteFile(selectedAccount, index);
      toast.success("Image deleted from blockchain");
      setMyImages((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete image");
    }
  };

  const handleShare = async (receiverAddress, imageHash, name) => {
    try {
      if (!receiverAddress) {
        toast.error("Please enter a valid wallet address");
        return;
      }

      const res = await axios.post("http://localhost:3000/api/shareImage", {
        senderAddress: selectedAccount,
        receiverAddress,
        imageHash,
        name,
      });
      if (res.status === 200) {
        toast.success("Image shared successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error sharing image");
    }
  };

  const copyToClipboard = (hash) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + " • " + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const filteredMyImages = myImages.filter((img) =>
    img.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-28 px-4 md:px-8 bg-[#0a0a0a] text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">📁 My Files</h2>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setTab("my")}
          className={clsx(
            "px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all duration-200",
            tab === "my"
              ? "bg-purple-700 text-white shadow-lg"
              : "bg-gray-800 hover:bg-gray-700 text-gray-300"
          )}
        >
          <ImageIcon size={16} /> My Images
        </button>
        <button
          onClick={() => setTab("shared")}
          className={clsx(
            "px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all duration-200",
            tab === "shared"
              ? "bg-blue-700 text-white shadow-lg"
              : "bg-gray-800 hover:bg-gray-700 text-gray-300"
          )}
        >
          <Users size={16} /> Shared With Me
        </button>
      </div>

      {/* Search Bar */}
      {tab === "my" && (
        <div className="mb-6 flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name..."
              className="pl-10 pr-4 py-2 w-full rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-12 h-12 rounded-full border-4 border-purple-500 border-t-transparent animate-spin mb-4"></div>
          <p className="text-gray-400">Loading images...</p>
        </div>
      ) : tab === "my" ? (
        <>
          {filteredMyImages.length === 0 ? (
            <div className="text-center py-16">
              <ImageIcon size={48} className="mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-medium text-gray-300 mb-2">No images found</h3>
              <p className="text-gray-500 mb-4">Upload your first encrypted image to get started</p>
              <a
                href="/upload"
                className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-medium hover:opacity-90"
              >
                Upload an Image
              </a>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredMyImages.map(({ image, name, ipfsHash }, index) => (
                <div
                  key={index}
                  className="bg-[#111] rounded-lg overflow-hidden border border-gray-800 hover:border-purple-900/30 transition-all hover:shadow-lg cursor-pointer"
                  onClick={() => setEnlargedImage({ image, name, ipfsHash, index })}
                >
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={`data:image/jpeg;base64,${image}`}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="bg-black/60 text-xs px-2 py-1 rounded flex items-center text-purple-400">
                        <Lock size={10} className="mr-1" /> Encrypted
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="text-white text-lg font-medium truncate">{name}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(ipfsHash);
                          }}
                          className="text-xs text-gray-400 hover:text-white flex items-center"
                          title="Copy IPFS hash"
                        >
                          {copiedHash === ipfsHash ? (
                            <Check size={14} className="mr-1 text-green-500" />
                          ) : (
                            <Copy size={14} className="mr-1" />
                          )}
                          {ipfsHash.substring(0, 10)}...
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const receiver = prompt("Enter receiver's wallet address:");
                            if (receiver) handleShare(receiver, ipfsHash, name);
                          }}
                          className="p-1 bg-blue-600 hover:bg-blue-700 rounded text-white"
                          title="Share image"
                        >
                          <Share2 size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                              handleDelete(index);
                          }}
                          className="p-1 bg-red-600 hover:bg-red-700 rounded text-white"
                          title="Delete image"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {sharedImages.length === 0 ? (
            <div className="text-center py-16">
              <Users size={48} className="mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-medium text-gray-300 mb-2">No shared images</h3>
              <p className="text-gray-500">Images shared with you will appear here</p>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sharedImages.map((image, index) => (
                <div
                  key={index}
                  className="bg-[#111] rounded-lg overflow-hidden border border-gray-800 hover:border-blue-900/30 transition-all hover:shadow-lg cursor-pointer"
                  onClick={() => setEnlargedImage({
                    image: image.imageData,
                    name: image.imageName,
                    sender: image.senderAddress,
                    timestamp: image.timestamp,
                    shared: true
                  })}
                >
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={`data:image/png;base64,${image.imageData}`}
                      alt={image.imageName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="bg-black/60 text-xs px-2 py-1 rounded flex items-center text-blue-400">
                        <Users size={10} className="mr-1" /> Shared
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="text-white text-lg font-medium truncate">{image.imageName}</h3>
                    <div className="mt-2 text-sm">
                      <div className="flex items-center text-gray-400">
                        <Users size={12} className="mr-1 flex-shrink-0" />
                        <span className="truncate">From: {image.senderAddress.slice(0, 6)}...{image.senderAddress.slice(-4)}</span>
                      </div>
                      <div className="flex items-center text-gray-500 text-xs mt-1">
                        <Clock size={10} className="mr-1 flex-shrink-0" />
                        <span>{formatDate(image.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Enlarged Image Modal */}
      {enlargedImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="relative bg-[#111] rounded-lg shadow-2xl overflow-hidden max-w-4xl w-full">
            <div className="absolute top-4 right-4 z-10">
              <button
                className="bg-black/60 hover:bg-black/80 p-2 rounded-full"
                onClick={() => setEnlargedImage(null)}
              >
                <X size={20} className="text-white" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white text-xl font-bold">{enlargedImage.name}</h3>
                
                {enlargedImage.shared ? (
                  <div className="flex items-center">
                    <span className="bg-blue-900/30 text-blue-400 text-xs rounded-full px-3 py-1 flex items-center">
                      <Users size={12} className="mr-1" /> Shared with you
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="bg-purple-900/30 text-purple-400 text-xs rounded-full px-3 py-1 flex items-center">
                      <Lock size={12} className="mr-1" /> Your encrypted image
                    </span>
                  </div>
                )}
              </div>
              
              <div className="bg-black/30 rounded-lg overflow-hidden">
                <img
                  src={`data:image/${enlargedImage.shared ? 'png' : 'jpeg'};base64,${enlargedImage.image}`}
                  alt={enlargedImage.name}
                  className="w-full object-contain max-h-[70vh]"
                />
              </div>
              
              <div className="mt-4 flex flex-wrap justify-between items-center">
                {enlargedImage.shared ? (
                  <div className="text-sm text-gray-400">
                    <div className="flex items-center">
                      <Users size={14} className="mr-2" />
                      <span>From: {enlargedImage.sender.slice(0, 10)}...{enlargedImage.sender.slice(-8)}</span>
                    </div>
                    <div className="flex items-center mt-1 text-gray-500">
                      <Clock size={14} className="mr-2" />
                      <span>{formatDate(enlargedImage.timestamp)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center text-sm text-gray-400">
                    <div className="flex items-center">
                      <button
                        onClick={() => copyToClipboard(enlargedImage.ipfsHash)}
                        className="flex items-center hover:text-white transition-colors"
                      >
                        {copiedHash === enlargedImage.ipfsHash ? (
                          <Check size={14} className="mr-1 text-green-500" />
                        ) : (
                          <Copy size={14} className="mr-1" />
                        )}
                        <span>IPFS: {enlargedImage.ipfsHash.substring(0, 18)}...</span>
                      </button>
                    </div>
                  </div>
                )}
                
                {!enlargedImage.shared && (
                  <div className="flex gap-3 mt-2 sm:mt-0">
                    <button
                      onClick={() => {
                        const receiver = prompt("Enter receiver's wallet address:");
                        if (receiver) handleShare(receiver, enlargedImage.ipfsHash, enlargedImage.name);
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1 text-white"
                    >
                      <Share2 size={16} /> Share
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this image?")) {
                          handleDelete(enlargedImage.index);
                          setEnlargedImage(null);
                        }
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg flex items-center gap-1 text-white"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyFilesPage;