import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';
import trackService from '@/services/api/trackService';

class AlbumService {
  constructor() {
    this.tableName = 'albums_c';
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
          {"field": {"Name": "releaseYear_c"}},
          {"field": {"Name": "coverArt_c"}},
          {"field": {"Name": "artistId_c"}}
        ]
      });

      if (!response.success) {
        console.error('Failed to fetch albums:', response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching albums:', error?.response?.data?.message || error.message);
      toast.error('Failed to fetch albums');
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
          {"field": {"Name": "releaseYear_c"}},
          {"field": {"Name": "coverArt_c"}},
          {"field": {"Name": "artistId_c"}}
        ]
      });

      if (!response.success) {
        console.error('Failed to fetch album:', response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching album ${id}:`, error?.response?.data?.message || error.message);
      toast.error('Failed to fetch album');
      return null;
    }
  }

  async getWithTracks(id) {
    try {
      const album = await this.getById(id);
      if (!album) return null;

      // Get tracks that belong to this album
      const tracks = await trackService.search(album.title_c || album.Name || '');
      
      return {
        ...album,
        trackDetails: tracks
      };
    } catch (error) {
      console.error(`Error fetching album with tracks ${id}:`, error?.response?.data?.message || error.message);
      toast.error('Failed to fetch album with tracks');
      return null;
    }
  }

  async getByArtist(artistName) {
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
          {"field": {"Name": "releaseYear_c"}},
          {"field": {"Name": "coverArt_c"}},
          {"field": {"Name": "artistId_c"}}
        ],
        where: [{
          "FieldName": "artist_c",
          "Operator": "Contains",
          "Values": [artistName],
          "Include": true
        }]
      });

      if (!response.success) {
        console.error('Failed to fetch albums by artist:', response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching albums by artist:', error?.response?.data?.message || error.message);
      toast.error('Failed to fetch albums by artist');
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
          {"field": {"Name": "releaseYear_c"}},
          {"field": {"Name": "coverArt_c"}},
          {"field": {"Name": "artistId_c"}}
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
              }
            ],
            "operator": "OR"
          }]
        }]
      });

      if (!response.success) {
        console.error('Failed to search albums:', response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error searching albums:', error?.response?.data?.message || error.message);
      toast.error('Failed to search albums');
      return [];
    }
  }

  async getFeatured() {
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
          {"field": {"Name": "releaseYear_c"}},
          {"field": {"Name": "coverArt_c"}},
          {"field": {"Name": "artistId_c"}}
        ],
        pagingInfo: {
          limit: 6,
          offset: 0
        }
      });

      if (!response.success) {
        console.error('Failed to fetch featured albums:', response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching featured albums:', error?.response?.data?.message || error.message);
      toast.error('Failed to fetch featured albums');
      return [];
    }
  }

  async getRecent() {
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
          {"field": {"Name": "releaseYear_c"}},
          {"field": {"Name": "coverArt_c"}},
          {"field": {"Name": "artistId_c"}}
        ],
        orderBy: [{
          "fieldName": "releaseYear_c",
          "sorttype": "DESC"
        }],
        pagingInfo: {
          limit: 8,
          offset: 0
        }
      });

      if (!response.success) {
        console.error('Failed to fetch recent albums:', response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching recent albums:', error?.response?.data?.message || error.message);
      toast.error('Failed to fetch recent albums');
      return [];
    }
  }

  getDuration(album) {
    // Calculate total duration if tracks are available
    if (album.trackDetails) {
      return album.trackDetails.reduce((total, track) => total + (track.duration_c || 0), 0);
    }
    return 0;
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

export default new AlbumService();