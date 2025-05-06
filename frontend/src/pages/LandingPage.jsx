import { useWeb3Context } from "../contexts/useWeb3Context";
import { connectWallet } from "../utils/connectWallet";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Lock, Shield, Key, Share, Eye, EyeOff } from "lucide-react";
import img from "./image.png"
import web3 from "./web3.webp"
import imgsecurity from "./imagesecurity.webp"
import security from "./security.png"

const Wallet = () => {
  const navigateTo = useNavigate();
  const { updateWeb3State, web3State } = useWeb3Context();
  const { selectedAccount } = web3State;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleNavigate = (path) => {
    navigateTo(path);
  };
  useEffect(() => {
    if (selectedAccount) {
      navigateTo("/home");
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [selectedAccount, navigateTo]);

  const handleWalletConnection = async (event) => {
    // Prevent any default behavior
    if (event) event.preventDefault();
    
    // Show loading state
    setIsLoading(true);
    
    try {
      const { contractInstance, selectedAccount } = await connectWallet();
      updateWeb3State({ contractInstance, selectedAccount });
    } catch (error) {
      console.error("Wallet connection error:", error);
      // You can add user feedback here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black text-white overflow-hidden ">
      {/* Floating navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-black/80 backdrop-blur-md py-2" : "bg-transparent py-6"}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <Lock size={16} />
            </div>
            <span className="font-bold text-xl">SecureVault</span>
          </div>
          <button
            onClick={handleWalletConnection}
            className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 px-6 py-2 rounded-full font-medium transition-all duration-300 shadow-lg shadow-purple-500/25"
            disabled={isLoading}
          >
            {isLoading ? "Connecting..." : "Connect Wallet"}
          </button>
        </div>
      </nav>

      {/* Hero section with animated elements */}
      <section className="relative min-h-screen flex items-center">
        {/* Abstract background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 -left-10 w-72 h-72 bg-purple-600/30 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full filter blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-pink-600/20 rounded-full filter blur-3xl"></div>
          
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Encrypted</span>
              <span className="block">Image Vault</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-lg">
              Store your precious memories with military-grade encryption, blockchain security, and complete privacy control.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleWalletConnection}
                className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                <Key size={20} />
                {isLoading ? "Connecting..." : "Unlock Your Vault"}
              </button>
              <button
              onClick={() => handleNavigate('/userguidenull')}
                className="border border-gray-700 hover:border-gray-500 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 text-center"
              >
                Discover How
              </button>
            </div>
          </div>
          
          <div className="hidden md:block relative">
            {/* 3D floating vault visualization */}
            <div className="relative w-full aspect-square max-w-lg mx-auto perspective-1000">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-3xl border border-gray-800 shadow-2xl shadow-purple-500/10 flex items-center justify-center transform rotate-6 hover:rotate-0 transition-transform duration-500">
                <img 
                  src={img} 
                  alt="Encrypted vault visualization" 
                  className="w-3/4 h-3/4 object-cover rounded-2xl shadow-lg opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock size={64} className="text-white/70" />
                </div>
              </div>
              
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/20 animate-pulse">
                <Shield size={40} className="text-white" />
              </div>
            </div>
          </div> 
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <span className="text-sm text-gray-400 mb-2">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Features section with hover effects */}
      <section id="learn-more" className="py-24 px-6 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/5 w-80 h-80 bg-purple-600/10 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Secure by Design</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Advanced cryptography meets decentralized storage for ultimate privacy and security.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl border border-gray-800 hover:border-purple-500/50 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full filter blur-2xl transform translate-x-1/2 -translate-y-1/2 group-hover:bg-purple-500/20 transition-all duration-300"></div>
              
              <div className="w-14 h-14 bg-purple-900 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20">
                <Lock size={28} className="text-purple-300" />
              </div>
              
              <h3 className="text-xl font-bold mb-3">AES-256-CBC Encryption</h3>
              <p className="text-gray-400">
                Military-grade encryption that secures your images before they ever leave your device, ensuring only you control access.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full filter blur-2xl transform translate-x-1/2 -translate-y-1/2 group-hover:bg-blue-500/20 transition-all duration-300"></div>
              
              <div className="w-14 h-14 bg-blue-900 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                <Shield size={28} className="text-blue-300" />
              </div>
              
              <h3 className="text-xl font-bold mb-3">Blockchain Verification</h3>
              <p className="text-gray-400">
                Immutable access control records on blockchain ensure transparent, tamper-proof permissions management.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl border border-gray-800 hover:border-pink-500/50 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full filter blur-2xl transform translate-x-1/2 -translate-y-1/2 group-hover:bg-pink-500/20 transition-all duration-300"></div>
              
              <div className="w-14 h-14 bg-pink-900 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-pink-500/20">
                <Share size={28} className="text-pink-300" />
              </div>
              
              <h3 className="text-xl font-bold mb-3">Selective Sharing</h3>
              <p className="text-gray-400">
                Grant and revoke access to specific images for specific wallet addresses with complete auditability.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How it works section with animated timeline */}
      <section className="py-24 px-6 bg-gradient-to-b from-black to-gray-900 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">How SecureVault Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              A seamless process that keeps you in control
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="relative pl-12 pb-12 border-l-2 border-gray-800 last:border-0 hover:border-purple-500 transition-colors duration-300 group">
                <div className="absolute left-0 top-0 w-6 h-6 bg-gray-800 rounded-full transform -translate-x-1/2 border-4 border-black group-hover:bg-purple-500 transition-colors duration-300"></div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-400 transition-colors duration-300">Upload & Encrypt</h3>
                <p className="text-gray-400">Your images are encrypted client-side using AES-256 before they ever leave your device, ensuring raw data is never exposed.</p>
              </div>
              
              <div className="relative pl-12 pb-12 border-l-2 border-gray-800 last:border-0 hover:border-blue-500 transition-colors duration-300 group">
                <div className="absolute left-0 top-0 w-6 h-6 bg-gray-800 rounded-full transform -translate-x-1/2 border-4 border-black group-hover:bg-blue-500 transition-colors duration-300"></div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors duration-300">Decentralized Storage</h3>
                <p className="text-gray-400">Encrypted data is stored on IPFS, eliminating single points of failure and ensuring your images exist as long as you want them to.</p>
              </div>
              
              <div className="relative pl-12 pb-12 border-l-2 border-gray-800 last:border-0 hover:border-purple-500 transition-colors duration-300 group">
                <div className="absolute left-0 top-0 w-6 h-6 bg-gray-800 rounded-full transform -translate-x-1/2 border-4 border-black group-hover:bg-purple-500 transition-colors duration-300"></div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-400 transition-colors duration-300">Blockchain Access Control</h3>
                <p className="text-gray-400">Permission records are stored on blockchain, creating a transparent, immutable record of who has access to what.</p>
              </div>
              
              <div className="relative pl-12 border-gray-800 last:border-0 hover:border-blue-500 transition-colors duration-300 group">
                <div className="absolute left-0 top-0 w-6 h-6 bg-gray-800 rounded-full transform -translate-x-1/2 border-4 border-black group-hover:bg-blue-500 transition-colors duration-300"></div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors duration-300">Secure Viewing & Sharing</h3>
                <p className="text-gray-400">Grant and revoke access to specific wallet addresses, with all access permissions verified through smart contracts.</p>
              </div>
            </div>
            
            <div className="relative">
              <div className="w-full aspect-square max-w-md mx-auto relative">
                <img 
                  src={img} 
                  alt="SecureVault process visualization" 
                  className="rounded-2xl shadow-2xl shadow-purple-500/10 border border-gray-800 w-full h-full object-cover"
                />
                
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl flex items-center justify-center">
                  <div className="p-6 bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 max-w-xs text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="relative">
                        <EyeOff size={36} className="text-red-400 absolute inset-0" />
                        <Eye size={36} className="text-green-400 opacity-50" />
                      </div>
                    </div>
                    <h4 className="text-lg font-bold mb-2">Your Eyes Only</h4>
                    <p className="text-sm text-gray-300">Encrypted data appears as random noise without proper decryption keys.</p>
                  </div>
                </div>
              </div>
              
              {/* Floating decoration elements */}
              <div className="absolute -left-10 -bottom-10 w-20 h-20 bg-purple-500/20 rounded-full filter blur-xl animate-pulse"></div>
              <div className="absolute -right-5 -top-5 w-16 h-16 bg-blue-500/20 rounded-full filter blur-xl animate-pulse delay-700"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Trust signals and testimonials */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-5xl mx-auto">
            <div className="w-full h-full bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-purple-500/5 rounded-full filter blur-3xl"></div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Privacy Without Compromise</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Your most valuable memories deserve the strongest protection
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-800 hover:border-purple-500/30 transition-all duration-300">
              <img 
                src={security} 
                alt="Security visualization" 
                className="w-full h-48 object-cover rounded-lg mb-6 opacity-80"
              />
              <h3 className="text-xl font-bold mb-3">Zero Knowledge Design</h3>
              <p className="text-gray-400">
                We can never access your images or encryption keys. Your content remains exclusively yours.
              </p>
            </div>
            
            <div className="p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-800 hover:border-blue-500/30 transition-all duration-300">
              <img 
                src={web3}
                alt="Blockchain technology" 
                className="w-full h-48 object-cover rounded-lg mb-6 opacity-80"
              />
              <h3 className="text-xl font-bold mb-3">Decentralized Authority</h3>
              <p className="text-gray-400">
                No single entity controls your access. Blockchain validation ensures transparency and resilience.
              </p>
            </div>
            
            <div className="p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-800 hover:border-purple-500/30 transition-all duration-300">
              <img 
                src={imgsecurity} 
                alt="Image protection" 
                className="w-full h-48 object-cover rounded-lg mb-6 opacity-80"
              />
              <h3 className="text-xl font-bold mb-3">Future-Proof Security</h3>
              <p className="text-gray-400">
                We use encryption standards designed to withstand next-generation computational attacks.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-24 px-6 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl transform translate-y-1/2"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl transform -translate-y-1/2"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Ready for True Privacy?</h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            Join the growing community of privacy-conscious individuals who trust SecureVault with their most precious digital assets.
          </p>
          
          <div className="relative">
            {/* FIXED: This button now uses the same onClick and functionality as the nav button */}
            <button
              onClick={handleWalletConnection}
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 px-8 py-4 rounded-xl font-bold text-xl transition-all duration-300 shadow-lg shadow-purple-500/25"
              

            >
              {isLoading ? "Connecting..." : "Connect Wallet & Get Started"}
            </button>
            
          
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-6 bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <Lock size={16} />
              </div>
              <span className="font-bold text-xl">SecureVault</span>
            </div>
            
            <div className="flex gap-8">
             
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 mb-4 md:mb-0">© {new Date().getFullYear()} SecureVault. All rights reserved.</p>
            <p className="text-gray-500">Protecting your digital memories with blockchain security</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Wallet;