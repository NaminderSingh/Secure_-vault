import { useWeb3Context } from "../contexts/useWeb3Context";
import { useNavigate, Link } from "react-router-dom";
import { Lock, LogOut, Copy, Check, Home, Upload, FileText, Settings } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const { web3State } = useWeb3Context();
  const { selectedAccount } = web3State;
  const [isScrolled, setIsScrolled] = useState(false);
  const [copied, setCopied] = useState(false);

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    navigate("/");
  };

  const copyToClipboard = () => {
    if (selectedAccount) {
      navigator.clipboard.writeText(selectedAccount);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/80 backdrop-blur-md shadow-lg"
          : "bg-gradient-to-r from-purple-900 to-blue-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-[80px] flex justify-between items-center">
          {/* Left - Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Lock size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-white">SecureVault</h1>
              <p className="text-xs text-gray-300">Encrypted Image Storage</p>
            </div>
          </div>

          {/* Middle - Nav Links */}
          <div className="hidden md:flex gap-6 text-sm text-gray-200 font-medium">
            <Link to="/home" className="hover:text-white transition-colors flex items-center gap-1">
              <Home size={16} /> Dashboard
            </Link>
            <Link to="/upload" className="hover:text-white transition-colors flex items-center gap-1">
              <Upload size={16} /> Upload
            </Link>
            <Link to="/myfiles" className="hover:text-white transition-colors flex items-center gap-1">
              <FileText size={16} /> My Files
            </Link>
            <Link to="/settings" className="hover:text-white transition-colors flex items-center gap-1">
              <Settings size={16} /> Settings
            </Link>
          </div>

          {/* Right - Account + Logout */}
          <div className="flex items-center gap-3">
            {/* Connected Account */}
            <div className="flex items-center bg-black/20 rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="hidden md:inline text-gray-300 text-sm">Connected:</span>
                <span className="font-medium text-white">{formatAddress(selectedAccount)}</span>
              </div>
              <button
                onClick={copyToClipboard}
                className="bg-black/30 px-3 py-2 hover:bg-black/50 transition-colors flex items-center justify-center"
                title="Copy full address"
              >
                {copied ? (
                  <Check size={16} className="text-green-400" />
                ) : (
                  <Copy size={16} className="text-gray-300" />
                )}
              </button>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 px-4 py-2 rounded-lg font-medium transition-all duration-300 text-white shadow-md"
            >
              <LogOut size={16} />
              <span className="hidden md:block">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
