import { useState } from "react";
import { 
  Shield, 
  Upload, 
  Share2, 
  Lock, 
  Key, 
  FileText, 
  Download, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function HowToUse() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleFaq = (id) => {
    if (expandedFaq === id) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(id);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-5xl mx-auto px-4 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
         
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            How to Use SecureVault
          </h1>
          
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { id: "getting-started", label: "Getting Started", icon: <Shield size={16} /> },
            { id: "uploading", label: "Uploading Images", icon: <Upload size={16} /> },
            { id: "sharing", label: "Sharing Images", icon: <Share2 size={16} /> },
            { id: "security", label: "Security Best Practices", icon: <Key size={16} /> },
            { id: "faq", label: "FAQ", icon: <FileText size={16} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                activeSection === tab.id
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                  : "bg-gray-800/50 text-gray-300 hover:bg-gray-800"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700/50">
          {/* Getting Started */}
          {activeSection === "getting-started" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-purple-400 mb-4">Getting Started with SecureVault</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <span className="font-bold">1</span>
                    </div>
                    Connect Your Wallet
                  </h3>
                  <p className="text-gray-300">
                    To get started with SecureVault, you'll need to connect your blockchain wallet. This allows you to securely authenticate and manage access to your encrypted images.
                  </p>
                  <ul className="mt-3 space-y-1 text-gray-300">
                    <li className="flex gap-2">
                      <CheckCircle size={16} className="text-green-400 mt-1 flex-shrink-0" />
                      <span>Click "Connect Wallet" on the homepage</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle size={16} className="text-green-400 mt-1 flex-shrink-0" />
                      <span>Select your preferred wallet provider</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle size={16} className="text-green-400 mt-1 flex-shrink-0" />
                      <span>Approve the connection request</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <span className="font-bold">2</span>
                    </div>
                    Explore Your Dashboard
                  </h3>
                  <p className="text-gray-300">
                    Once connected, you'll access your personal dashboard where you can view and manage all your encrypted images.
                  </p>
                  <ul className="mt-3 space-y-1 text-gray-300">
                    <li className="flex gap-2">
                      <CheckCircle size={16} className="text-green-400 mt-1 flex-shrink-0" />
                      <span>View recently uploaded images</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle size={16} className="text-green-400 mt-1 flex-shrink-0" />
                      <span>Check storage usage statistics</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle size={16} className="text-green-400 mt-1 flex-shrink-0" />
                      <span>Monitor sharing activity</span>
                    </li>
                  </ul>
                </div>
                
                <div className="md:col-span-2 bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-5 rounded-lg border border-purple-700/30">
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle size={20} className="text-yellow-400" />
                    Important Security Note
                  </h3>
                  <p className="text-gray-300">
                    SecureVault utilizes AES-256-CBC encryption, which means your images are protected with military-grade security. Always keep your wallet credentials and access keys secure, and never share them with anyone.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Uploading Images */}
          {activeSection === "uploading" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-purple-400 mb-4">Uploading & Encrypting Images</h2>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex flex-col">
                    <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
                      <Upload size={24} className="text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Select Images</h3>
                    <p className="text-gray-300 text-sm flex-grow">
                      Click the "Upload" button from the navigation menu and select the images you want to encrypt and store.
                    </p>
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <p className="text-xs text-gray-400">Supported formats: JPG, PNG, GIF, WEBP</p>
                    </div>
                  </div>
                  
                 
                  
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex flex-col">
                    <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
                      <Shield size={24} className="text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Encrypt & Store</h3>
                    <p className="text-gray-300 text-sm flex-grow">
                      Click "Encrypt & Upload" to securely process your images using AES-256-CBC encryption and store them on IPFS.
                    </p>
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <p className="text-xs text-gray-400">Blockchain transaction required</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-5 rounded-lg border border-blue-700/30">
                  <h3 className="text-xl font-semibold mb-3">The Encryption Process</h3>
                  <ol className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-sm font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Client-Side Encryption</h4>
                        <p className="text-sm text-gray-300">Your image is encrypted directly in your browser using AES-256-CBC encryption, ensuring it never leaves your device unprotected.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-sm font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium">IPFS Storage</h4>
                        <p className="text-sm text-gray-300">The encrypted image is then stored on IPFS (InterPlanetary File System), a decentralized storage network for enhanced security and availability.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-sm font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Blockchain Registration</h4>
                        <p className="text-sm text-gray-300">Access rights are recorded on the blockchain, creating a tamper-proof record of who can decrypt and view your images.</p>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* Sharing Images */}
          {activeSection === "sharing" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-purple-400 mb-4">Sharing Your Encrypted Images</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 p-5 rounded-lg border border-gray-700">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Share2 size={20} className="text-blue-400" />
                    Grant Access
                  </h3>
                  <p className="text-gray-300 mb-4">
                    You can grant access to specific wallet addresses, allowing those users to view your encrypted images.
                  </p>
                  <ol className="space-y-3">
                    <li className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm">1</span>
                      </div>
                      <div className="text-sm text-gray-300">
                        Navigate to "My Files" and select the image you want to share
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm">2</span>
                      </div>
                      <div className="text-sm text-gray-300">
                        Click "Manage Access" and enter the wallet address of the recipient
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm">3</span>
                      </div>
                      <div className="text-sm text-gray-300">
                        Confirm the transaction to update access permissions on the blockchain
                      </div>
                    </li>
                  </ol>
                </div>
                
                <div className="bg-gray-800/50 p-5 rounded-lg border border-gray-700">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Users size={20} className="text-blue-400" />
                    Manage Recipients
                  </h3>
                  <p className="text-gray-300 mb-4">
                    You have complete control over who can access your encrypted images at all times.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-sm">View current access list</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-sm">Add new recipients anytime</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-sm">Revoke access when needed</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2 bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-5 rounded-lg border border-blue-700/30">
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Download size={20} className="text-purple-400" />
                    How Recipients View Your Images
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-gray-800/40 p-3 rounded border border-gray-700/50">
                      <h4 className="font-medium text-purple-300 mb-2">Receive Notification</h4>
                      <p className="text-sm text-gray-300">
                        Recipients will receive a notification when you've granted them access to an image.
                      </p>
                    </div>
                    <div className="bg-gray-800/40 p-3 rounded border border-gray-700/50">
                      <h4 className="font-medium text-purple-300 mb-2">Connect Their Wallet</h4>
                      <p className="text-sm text-gray-300">
                        They'll need to connect their wallet to verify their identity and access rights.
                      </p>
                    </div>
                    <div className="bg-gray-800/40 p-3 rounded border border-gray-700/50">
                      <h4 className="font-medium text-purple-300 mb-2">View & Download</h4>
                      <p className="text-sm text-gray-300">
                        The image will be decrypted in their browser, allowing them to view or download it.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Best Practices */}
          {activeSection === "security" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-purple-400 mb-4">Security Best Practices</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 p-5 rounded-lg border border-gray-700">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle size={20} className="text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Wallet Security</h3>
                      <ul className="space-y-2 text-gray-300">
                        <li className="flex gap-2">
                          <CheckCircle size={16} className="text-green-400 mt-1 flex-shrink-0" />
                          <span>Never share your private keys or seed phrases with anyone</span>
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle size={16} className="text-green-400 mt-1 flex-shrink-0" />
                          <span>Use hardware wallets for enhanced security when possible</span>
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle size={16} className="text-green-400 mt-1 flex-shrink-0" />
                          <span>Always disconnect your wallet after using SecureVault</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 p-5 rounded-lg border border-gray-700">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                      <Key size={20} className="text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Access Management</h3>
                      <ul className="space-y-2 text-gray-300">
                        <li className="flex gap-2">
                          <CheckCircle size={16} className="text-green-400 mt-1 flex-shrink-0" />
                          <span>Regularly review who has access to your encrypted images</span>
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle size={16} className="text-green-400 mt-1 flex-shrink-0" />
                          <span>Revoke access immediately when no longer needed</span>
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle size={16} className="text-green-400 mt-1 flex-shrink-0" />
                          <span>Double-check wallet addresses before granting access</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2 bg-gray-800/50 p-5 rounded-lg border border-gray-700">
                  <h3 className="text-xl font-semibold mb-4">Understanding AES-256-CBC Encryption</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-900/50 rounded-lg">
                      <h4 className="font-medium text-blue-300 mb-2">Military-Grade Security</h4>
                      <p className="text-sm text-gray-300">
                        AES-256-CBC is one of the strongest encryption standards available, used by governments and financial institutions worldwide.
                      </p>
                    </div>
                    <div className="p-4 bg-gray-900/50 rounded-lg">
                      <h4 className="font-medium text-blue-300 mb-2">Client-Side Processing</h4>
                      <p className="text-sm text-gray-300">
                        All encryption happens directly in your browser, meaning your original images never travel over the internet unprotected.
                      </p>
                    </div>
                    <div className="p-4 bg-gray-900/50 rounded-lg">
                      <h4 className="font-medium text-blue-300 mb-2">Decentralized Storage</h4>
                      <p className="text-sm text-gray-300">
                        IPFS ensures your encrypted images are distributed across multiple nodes, preventing single points of failure.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FAQ */}
          {activeSection === "faq" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-purple-400 mb-4">Frequently Asked Questions</h2>
              
              <div className="space-y-3">
                {[
                  {
                    id: "faq-1",
                    question: "What happens if I lose access to my wallet?",
                    answer: "If you lose access to your wallet, you will unfortunately lose access to your encrypted images. There is no recovery mechanism as the encryption keys are tied to your wallet. We strongly recommend keeping secure backups of your wallet recovery phrases in a safe location."
                  },
                  {
                    id: "faq-2",
                    question: "How much does it cost to use SecureVault?",
                    answer: "SecureVault operates on a blockchain network, so there are small transaction fees when uploading images, granting access, or revoking access. These fees vary based on network congestion. Additionally, there is a small storage fee for maintaining your images on IPFS, which is based on file size and storage duration."
                  },
                  {
                    id: "faq-3",
                    question: "Can SecureVault access my original images?",
                    answer: "No. SecureVault uses client-side encryption, which means your images are encrypted in your browser before being uploaded. We never have access to your unencrypted images or encryption keys."
                  },
                  {
                    id: "faq-4",
                    question: "Is there a limit to how many images I can store?",
                    answer: "There's no hard limit on the number of images you can store. However, larger storage usage will incur higher storage fees. Your dashboard shows your current storage usage and associated costs."
                  },
                  {
                    id: "faq-5",
                    question: "How do I completely delete an image from the system?",
                    answer: "To delete an image, navigate to 'My Files', select the image, and click 'Delete'. This will remove the blockchain record and request removal from IPFS. Due to the nature of decentralized storage, it may take some time for the file to be completely purged from all nodes."
                  }
                ].map((faq) => (
                  <div 
                    key={faq.id}
                    className="bg-gray-800/40 border border-gray-700 rounded-lg overflow-hidden"
                  >
                    <button
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-800/60 transition-colors"
                      onClick={() => toggleFaq(faq.id)}
                    >
                      <span className="font-medium text-lg">{faq.question}</span>
                      {expandedFaq === faq.id ? (
                        <ChevronUp size={20} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-400" />
                      )}
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="p-4 pt-0 border-t border-gray-700">
                        <p className="text-gray-300">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              
            </div>
          )}
        </div>
      </div>
    </div>
  );
}