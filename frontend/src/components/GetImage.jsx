import axios from "axios";
import { useWeb3Context } from "../contexts/useWeb3Context";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const GetImage = ({ reload }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { web3State } = useWeb3Context();
  const { selectedAccount, contractInstance } = web3State;

  useEffect(() => {
    const getImages = async () => {
      try {
        if (!selectedAccount || !contractInstance) return;
        setLoading(true);

        // Get files from contract
        const fileList = await contractInstance.viewFiles(selectedAccount);
        const files = Object.values(fileList); // Array of { ipfsHash, fileName }

        if (!files.length) return setImages([]);

        const ipfsHashArray = files.map(f => f.ipfsHash);
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            "x-access-token": token,
          },
        };

        const res = await axios.post("http://localhost:3000/api/getImage", ipfsHashArray, config);
        const decryptedImages = res.data.decryptedImageArr || [];

        // Combine file names and decrypted images
        const finalImageList = decryptedImages.map((imgData, index) => ({
          image: imgData,
          name: files[index]?.fileName || `Image ${index + 1}`,
        }));

        setImages(finalImageList);
      } catch (error) {
        console.error(error);
        toast.error("Error fetching images");
      } finally {
        setLoading(false);
      }
    };

    getImages();
  }, [contractInstance, selectedAccount, reload]);

  return (
    <div className="p-44  bg-black min-h-screen">
      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : images.length > 0 ? (
        <div className="flex justify-center items-start flex-wrap gap-6">
          {images.map(({ image, name }, index) => (
            <div key={index} className="w-[300px] text-center">
              <img
                src={`data:image/jpeg;base64,${image}`}
                alt={name}
                className="w-full h-[240px] object-cover rounded-lg shadow"
              />
              <p className="mt-2 text-sm text-white truncate">{name}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No images found</p>
      )}
    </div>
  );
};

export default GetImage;
