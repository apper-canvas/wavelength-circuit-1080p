import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import playlistService from '@/services/api/playlistService';
import ApperFileFieldComponent from '@/components/atoms/FileUploader/ApperFileFieldComponent';

const CreatePlaylistWithUpload = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

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
    } catch (error) {
      console.error("Failed to create playlist:", error);
      toast.error("Failed to create playlist");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4 text-gray-400 hover:text-white"
        >
          <ApperIcon name="ArrowLeft" className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <h1 className="text-4xl font-display font-bold text-white mb-2">
          Create New Playlist
        </h1>
        <p className="text-gray-400">
          Create your own custom playlist and add your favorite tracks
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form Fields */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Playlist Name *
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="My Awesome Playlist"
                className="w-full"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your playlist..."
                rows={4}
                className="w-full px-3 py-2 bg-surface border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary focus:outline-none resize-none"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cover Image
              </label>
              <ApperFileFieldComponent
                elementId="playlist-cover"
                config={{
                  fieldName: 'coverImage_c',
                  fieldKey: 'coverImage_c',
                  tableName: 'playlists_c',
                  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
                  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY,
                  existingFiles: [],
                  fileCount: 0
                }}
              />
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:pl-8">
            <div className="sticky top-8">
              <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
              <div className="bg-gradient-to-br from-surface/80 to-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <ApperIcon name="Music" className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold truncate">
                      {formData.name || "Untitled Playlist"}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {formData.description || "No description"}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      0 songs
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6 border-t border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || !formData.name.trim()}
            className="bg-gradient-to-r from-primary to-secondary"
          >
            {loading ? (
              <>
                <ApperIcon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <ApperIcon name="Plus" className="mr-2 h-4 w-4" />
                Create Playlist
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePlaylistWithUpload;