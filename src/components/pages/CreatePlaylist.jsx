import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import playlistService from "@/services/api/playlistService";

const CreatePlaylist = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center"
  });
  const [loading, setLoading] = useState(false);

  const coverImageOptions = [
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&h=400&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop&crop=center"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Please enter a playlist name");
      return;
    }

    try {
      setLoading(true);
      const playlist = await playlistService.create(formData);
      toast.success("Playlist created successfully!");
      navigate(`/playlist/${playlist.Id}`);
    } catch (err) {
      toast.error("Failed to create playlist");
      console.error("Create playlist error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-dark via-surface/20 to-dark">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white"
          >
            <ApperIcon name="ArrowLeft" className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-4xl font-display font-bold text-white">
              Create Playlist
            </h1>
            <p className="text-gray-400 text-lg">
              Build your perfect music collection
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Cover Image Selection */}
            <div>
              <label className="block text-lg font-medium text-white mb-4">
                Choose Cover Image
              </label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {coverImageOptions.map((imageUrl, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, coverImage: imageUrl }))}
                    className={`relative aspect-square rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 ${
                      formData.coverImage === imageUrl 
                        ? "ring-4 ring-primary shadow-xl shadow-primary/30" 
                        : "hover:ring-2 hover:ring-gray-400"
                    }`}
                  >
                    <img 
                      src={imageUrl} 
                      alt={`Cover option ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {formData.coverImage === imageUrl && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <ApperIcon name="Check" className="h-8 w-8 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Playlist Name */}
            <div>
              <label htmlFor="name" className="block text-lg font-medium text-white mb-3">
                Playlist Name *
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="My Awesome Playlist"
                className="text-lg py-4"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-lg font-medium text-white mb-3">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your playlist..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-surface border border-gray-600 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>

            {/* Preview */}
            <div className="bg-gradient-to-r from-surface/50 to-gray-700/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
              <div className="flex items-center gap-4">
                <img 
                  src={formData.coverImage} 
                  alt="Playlist cover"
                  className="w-20 h-20 rounded-xl object-cover shadow-lg"
                />
                <div>
                  <h4 className="text-xl font-display font-bold text-white">
                    {formData.name || "Untitled Playlist"}
                  </h4>
                  <p className="text-gray-400">
                    {formData.description || "No description"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    0 songs • 0 min
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(-1)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                icon="Plus"
                className="flex-1 bg-gradient-to-r from-primary to-accent"
              >
                Create Playlist
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylist;