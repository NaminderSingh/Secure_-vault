import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-hot-toast";
import { useWeb3Context } from "../contexts/useWeb3Context";

const SharedImages = () => {
  const [sharedImages, setSharedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { web3State } = useWeb3Context();
  const { selectedAccount } = web3State;

  useEffect(() => {
    const fetchSharedImages = async () => {

      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            "x-access-token": token,
          },
        };
        // const res = await axios.post("http://localhost:3000/api/getSharedImages", selectedAccount, config);
        const res = await axios.get(
          `http://localhost:3000/api/getSharedImages`,
          config
        );

        setSharedImages(res.data.images);
        
      } catch (err) {

      } finally {
        setLoading(false);
      }
    };

    fetchSharedImages();
  }, [selectedAccount]);

  if (loading) {
    return <div className="flex justify-center items-center py-8">Loading shared images...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-4">{error}</div>;
  }

  if (sharedImages.length === 0) {
    return <div className="text-center py-8">No images have been shared with you yet.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {sharedImages.map((image, index) => (
        <div 
          key={index} 
          className="border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div className="p-4">
            <h3 className="font-medium text-lg mb-2">{image.imageName}</h3>
            <p className="text-sm text-gray-600 mb-2">
              Shared by: {image.senderAddress.substring(0, 6)}...{image.senderAddress.substring(image.senderAddress.length - 4)}
            </p>
            <p className="text-xs text-gray-500 mb-4">
              {new Date(image.timestamp).toLocaleString()}
            </p>
            {/* Uncomment and use this if you want to display the image */}
            <img
              src={`data:image/png;base64,${image.imageData}`}  // Display image using base64 data
              alt={image.imageName}
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SharedImages;
