import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";
import React from "react";
import trackService from "@/services/api/trackService";
import albumService from "@/services/api/albumService";

class ArtistService {
  constructor() {
    this.tableName = 'artists_c';
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
          {"field": {"Name": "bio_c"}},
          {"field": {"Name": "image_c"}}
        ]
      });

      if (!response.success) {
        console.error('Failed to fetch artists:', response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching artists:', error?.response?.data?.message || error.message);
      toast.error('Failed to fetch artists');
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
          {"field": {"Name": "bio_c"}},
          {"field": {"Name": "image_c"}}
        ]
      });

      if (!response.success) {
        console.error('Failed to fetch artist:', response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching artist ${id}:`, error?.response?.data?.message || error.message);
      toast.error('Failed to fetch artist');
      return null;
    }
  }

  async getWithDetails(id) {
    try {
      const artist = await this.getById(id);
      if (!artist) return null;

      // Get albums by this artist
      const albums = await albumService.getByArtist(artist.Name || '');
      
      // Get tracks by this artist  
      const tracks = await trackService.search(artist.Name || '');
      
      return {
        ...artist,
        albumDetails: albums,
        topTrackDetails: tracks.slice(0, 10) // Limit to top 10 tracks
      };
    } catch (error) {
      console.error(`Error fetching artist with details ${id}:`, error?.response?.data?.message || error.message);
      toast.error('Failed to fetch artist details');
      return null;
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
          {"field": {"Name": "bio_c"}},
          {"field": {"Name": "image_c"}}
        ],
        where: [{
          "FieldName": "Name",
          "Operator": "Contains",
          "Values": [query],
          "Include": true
        }]
      });

      if (!response.success) {
        console.error('Failed to search artists:', response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error searching artists:', error?.response?.data?.message || error.message);
      toast.error('Failed to search artists');
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
          {"field": {"Name": "bio_c"}},
          {"field": {"Name": "image_c"}}
        ],
        pagingInfo: {
          limit: 6,
          offset: 0
        }
      });

      if (!response.success) {
        console.error('Failed to fetch featured artists:', response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching featured artists:', error?.response?.data?.message || error.message);
      toast.error('Failed to fetch featured artists');
      return [];
    }
  }

  async getPopular() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "bio_c"}},
          {"field": {"Name": "image_c"}}
        ]
      });

      if (!response.success) {
        console.error('Failed to fetch popular artists:', response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching popular artists:', error?.response?.data?.message || error.message);
      toast.error('Failed to fetch popular artists');
      return [];
    }
  }

  async getDiscography(artistId) {
    try {
      const artist = await this.getById(artistId);
      if (!artist) return [];

      return await albumService.getByArtist(artist.Name || '');
    } catch (error) {
      console.error(`Error fetching discography for artist ${artistId}:`, error?.response?.data?.message || error.message);
      toast.error('Failed to fetch discography');
      return [];
    }
  }

  async getTopTracks(artistId) {
    try {
      const artist = await this.getById(artistId);
      if (!artist) return [];

      const tracks = await trackService.search(artist.Name || '');
      return tracks.slice(0, 10); // Return top 10 tracks
    } catch (error) {
      console.error(`Error fetching top tracks for artist ${artistId}:`, error?.response?.data?.message || error.message);
      toast.error('Failed to fetch top tracks');
      return [];
    }
  }
}

export default new ArtistService();