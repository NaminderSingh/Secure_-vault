import { useState, useEffect } from "react";
import { Shield, Lock, Server, Users, Code, Globe, Heart, CheckCircle } from "lucide-react";

const AboutUs = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full min-h-screen text-white pt-[170px] px-4 bg-[#0a0a0a]">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto mb-20">
        <div className="text-center mb-12">
          <div className="inline-flex mb-6">
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-5 rounded-xl shadow-lg shadow-purple-500/20">
              <Shield size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            About SecureVault
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Your trusted platform for blockchain-secured, encrypted image storage
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 p-8 rounded-xl border border-purple-900/40 mb-16">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-300">
            At SecureVault, we believe that everyone deserves complete control over their digital assets. 
            Our mission is to provide a secure, decentralized platform that leverages blockchain technology 
            and advanced encryption to ensure your images remain private, tamper-proof, and accessible only to you.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-[#111111] p-6 rounded-xl border border-gray-800 hover:border-purple-800 transition-all duration-300 group">
            <div className="mb-4 p-3 bg-purple-900/20 rounded-lg w-fit group-hover:bg-purple-900/30 transition-all">
              <Lock size={24} className="text-purple-400" />
            </div>
            <h3 className="font-semibold text-xl mb-2">End-to-End Encryption</h3>
            <p className="text-gray-400">Your images are encrypted before leaving your device and can only be decrypted with your unique keys, ensuring maximum privacy.</p>
          </div>
          
          <div className="bg-[#111111] p-6 rounded-xl border border-gray-800 hover:border-blue-800 transition-all duration-300 group">
            <div className="mb-4 p-3 bg-blue-900/20 rounded-lg w-fit group-hover:bg-blue-900/30 transition-all">
              <Server size={24} className="text-blue-400" />
            </div>
            <h3 className="font-semibold text-xl mb-2">IPFS Storage</h3>
            <p className="text-gray-400">We utilize the InterPlanetary File System for decentralized storage, making your data resistant to censorship and server failures.</p>
          </div>
          
          <div className="bg-[#111111] p-6 rounded-xl border border-gray-800 hover:border-blue-800 transition-all duration-300 group">
            <div className="mb-4 p-3 bg-blue-900/20 rounded-lg w-fit group-hover:bg-blue-900/30 transition-all">
              <Code size={24} className="text-blue-400" />
            </div>
            <h3 className="font-semibold text-xl mb-2">Blockchain Verification</h3>
            <p className="text-gray-400">Every file upload is registered on the blockchain, creating an immutable record of ownership and authenticity.</p>
          </div>
          
          <div className="bg-[#111111] p-6 rounded-xl border border-gray-800 hover:border-purple-800 transition-all duration-300 group">
            <div className="mb-4 p-3 bg-purple-900/20 rounded-lg w-fit group-hover:bg-purple-900/30 transition-all">
              <Users size={24} className="text-purple-400" />
            </div>
            <h3 className="font-semibold text-xl mb-2">User-Centric Design</h3>
            <p className="text-gray-400">Our platform is built with simplicity in mind, making advanced security technologies accessible to everyone.</p>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-center">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Naminder Singh",
                role: "Founder",
                bio: "Chief backend developer and blockchain expert",
                avatar: "N"
              },
              {
                name: "Pawanpreet Singh",
                role: "Lead Developer",
                bio: "Full-stack engineer specializing in cryptographic systems",
                avatar: "P"
              },
              {
                name: "Prabhsimran Singh",
                role: "Security Architect",
                bio: "Lead Frontend developer ",
                avatar: "P"
              }
            ].map((member, idx) => (
              <div key={idx} className="bg-[#111111] p-6 rounded-xl border border-gray-800 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {member.avatar}
                </div>
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-purple-400 text-sm mb-2">{member.role}</p>
                <p className="text-gray-400 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Why Choose SecureVault?</h2>
          <div className="space-y-4">
            {[
              "Military-grade encryption algorithms protect your sensitive images",
              "No third-party access to your unencrypted data",
              "Transparent blockchain verification ensures data integrity",
              "User-friendly interface makes security accessible",
              "Decentralized storage prevents single points of failure"
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-400 mt-1 flex-shrink-0" />
                <p className="text-gray-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
        
     
      </div>

      {/* Footer */}
      <div className={`w-full py-8 border-t border-gray-800 mt-20 ${
        isScrolled ? "bg-black/50 backdrop-blur-md" : ""
      }`}>
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Lock size={16} className="text-white" />
            </div>
            <h1 className="font-bold text-lg text-white">SecureVault</h1>
          </div>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} SecureVault. All rights reserved. 
            Powered by Blockchain Technology.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;