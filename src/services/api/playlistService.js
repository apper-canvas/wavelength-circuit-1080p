import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';
import trackService from '@/services/api/trackService';

class PlaylistService {
  constructor() {
    this.tableName = 'playlists_c';
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "trackIds_c"}},
          {"field": {"Name": "coverImage_c"}}
        ]
      });

      if (!response.success) {
        console.error('Failed to fetch playlists:', response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching playlists:', error?.response?.data?.message || error.message);
      toast.error('Failed to fetch playlists');
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "trackIds_c"}},
          {"field": {"Name": "coverImage_c"}}
        ]
      });

      if (!response.success) {
        console.error('Failed to fetch playlist:', response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching playlist ${id}:`, error?.response?.data?.message || error.message);
      toast.error('Failed to fetch playlist');
      return null;
    }
  }

  async getWithTracks(id) {
    try {
      const playlist = await this.getById(id);
      if (!playlist) return null;

      // For now, return empty tracks array since trackIds_c is a number field
      // In a real implementation, this would need proper track relationship handling
      return {
        ...playlist,
        trackDetails: []
      };
    } catch (error) {
      console.error(`Error fetching playlist with tracks ${id}:`, error?.response?.data?.message || error.message);
      toast.error('Failed to fetch playlist with tracks');
      return null;
    }
  }

  async create(playlistData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const response = await apperClient.createRecord(this.tableName, {
        records: [{
          Name: playlistData.name || "New Playlist",
          description_c: playlistData.description || "",
          duration_c: 0,
          trackIds_c: 0
        }]
      });

      if (!response.success) {
        console.error('Failed to create playlist:', response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create playlist:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to create playlist');
        }

        return response.results[0].data;
      }

      throw new Error('No response data');
    } catch (error) {
      console.error('Error creating playlist:', error?.response?.data?.message || error.message);
      toast.error('Failed to create playlist');
      throw error;
    }
  }

  async update(id, playlistData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const updateData = {};
      if (playlistData.name) updateData.Name = playlistData.name;
      if (playlistData.description !== undefined) updateData.description_c = playlistData.description;
      if (playlistData.duration !== undefined) updateData.duration_c = playlistData.duration;

      const response = await apperClient.updateRecord(this.tableName, {
        records: [{
          Id: parseInt(id),
          ...updateData
        }]
      });

      if (!response.success) {
        console.error('Failed to update playlist:', response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update playlist ${id}:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to update playlist');
        }

        return response.results[0].data;
      }

      throw new Error('No response data');
    } catch (error) {
      console.error('Error updating playlist:', error?.response?.data?.message || error.message);
      toast.error('Failed to update playlist');
      throw error;
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const response = await apperClient.deleteRecord(this.tableName, {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error('Failed to delete playlist:', response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete playlist ${id}:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to delete playlist');
        }
      }

      return true;
    } catch (error) {
      console.error('Error deleting playlist:', error?.response?.data?.message || error.message);
      toast.error('Failed to delete playlist');
      throw error;
    }
  }

  async addTrack(playlistId, trackId) {
    // This would need proper implementation with track relationship handling
    toast.info("Add track functionality needs proper track relationship implementation");
    return null;
  }

  async removeTrack(playlistId, trackId) {
    // This would need proper implementation with track relationship handling  
    toast.info("Remove track functionality needs proper track relationship implementation");
    return null;
  }

  async reorderTracks(playlistId, trackIds) {
    // This would need proper implementation with track relationship handling
    toast.info("Reorder tracks functionality needs proper track relationship implementation");
    return null;
  }

  formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }
}

export default new PlaylistService();