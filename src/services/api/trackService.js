import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

class TrackService {
  constructor() {
    this.tableName = 'tracks_c';
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "artist_c"}},
          {"field": {"Name": "album_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "audioUrl_c"}},
          {"field": {"Name": "isLiked_c"}},
          {"field": {"Name": "lyrics_c"}},
          {"field": {"Name": "albumArt_c"}},
          {"field": {"Name": "albumId_c"}}
        ]
      });

      if (!response.success) {
        console.error('Failed to fetch tracks:', response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching tracks:', error?.response?.data?.message || error.message);
      toast.error('Failed to fetch tracks');
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "artist_c"}},
          {"field": {"Name": "album_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "audioUrl_c"}},
          {"field": {"Name": "isLiked_c"}},
          {"field": {"Name": "lyrics_c"}},
          {"field": {"Name": "albumArt_c"}},
          {"field": {"Name": "albumId_c"}}
        ]
      });

      if (!response.success) {
        console.error('Failed to fetch track:', response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching track ${id}:`, error?.response?.data?.message || error.message);
      toast.error('Failed to fetch track');
      return null;
    }
  }

  async getByIds(ids) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "artist_c"}},
          {"field": {"Name": "album_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "audioUrl_c"}},
          {"field": {"Name": "isLiked_c"}},
          {"field": {"Name": "lyrics_c"}},
          {"field": {"Name": "albumArt_c"}},
          {"field": {"Name": "albumId_c"}}
        ],
        where: [{
          "FieldName": "Id",
          "Operator": "ExactMatch",
          "Values": ids.map(id => parseInt(id)),
          "Include": true
        }]
      });

      if (!response.success) {
        console.error('Failed to fetch tracks by IDs:', response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching tracks by IDs:', error?.response?.data?.message || error.message);
      toast.error('Failed to fetch tracks');
      return [];
    }
  }

  async search(query) {
    try {
      if (!query?.trim()) return [];

      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "artist_c"}},
          {"field": {"Name": "album_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "audioUrl_c"}},
          {"field": {"Name": "isLiked_c"}},
          {"field": {"Name": "lyrics_c"}},
          {"field": {"Name": "albumArt_c"}},
          {"field": {"Name": "albumId_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [{
            "conditions": [
              {
                "fieldName": "title_c",
                "operator": "Contains",
                "values": [query]
              },
              {
                "fieldName": "artist_c",
                "operator": "Contains",
                "values": [query]
              },
              {
                "fieldName": "album_c",
                "operator": "Contains",
                "values": [query]
              }
            ],
            "operator": "OR"
          }]
        }]
      });

      if (!response.success) {
        console.error('Failed to search tracks:', response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error searching tracks:', error?.response?.data?.message || error.message);
      toast.error('Failed to search tracks');
      return [];
    }
  }

  async toggleLike(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      // First get the current track
      const currentTrack = await this.getById(id);
      if (!currentTrack) {
        throw new Error(`Track with ID ${id} not found`);
      }

      // Toggle the like status
      const newLikeStatus = !currentTrack.isLiked_c;

      const response = await apperClient.updateRecord(this.tableName, {
        records: [{
          Id: parseInt(id),
          isLiked_c: newLikeStatus
        }]
      });

      if (!response.success) {
        console.error('Failed to toggle like:', response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to toggle like for track ${id}:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to toggle like');
        }
      }

      // Return updated track
      return {
        ...currentTrack,
        isLiked_c: newLikeStatus
      };
    } catch (error) {
      console.error('Error toggling like:', error?.response?.data?.message || error.message);
      toast.error('Failed to toggle like');
      throw error;
    }
  }

  async getLikedTracks() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "artist_c"}},
          {"field": {"Name": "album_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "audioUrl_c"}},
          {"field": {"Name": "isLiked_c"}},
          {"field": {"Name": "lyrics_c"}},
          {"field": {"Name": "albumArt_c"}},
          {"field": {"Name": "albumId_c"}}
        ],
        where: [{
          "FieldName": "isLiked_c",
          "Operator": "EqualTo",
          "Values": [true],
          "Include": true
        }]
      });

      if (!response.success) {
        console.error('Failed to fetch liked tracks:', response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching liked tracks:', error?.response?.data?.message || error.message);
      toast.error('Failed to fetch liked tracks');
      return [];
    }
  }

  formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }
}

export default new TrackService();