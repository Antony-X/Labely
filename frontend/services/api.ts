/**
 * Labely Backend API Service
 *
 * Connects to the backend API for dataset management and labeling
 */

// API Configuration
const API_BASE_URL = 'https://bios-wales-jackets-visits.trycloudflare.com';

// Dataset names mapping
export const DATASET_NAMES = {
  BINARY: 'muffin-vs-chihuahua', // or any binary dataset
  MULTI_CLASS: 'multi-class-emotion-classification',
  TEXT_SENTIMENT: 'imdb-movie-review',
  BOUNDING_BOX: 'license-plate-detection',
  SEGMENTATION: 'urban-street-scene-segmentation',
};

// API Service
class APIService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * List all available datasets
   */
  async listDatasets(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/dataset/list`);
    if (!response.ok) throw new Error('Failed to fetch datasets');
    return response.json();
  }

  /**
   * Get dataset information
   */
  async getDataset(name: string): Promise<any> {
    const url = `${this.baseUrl}/dataset/get?name=${encodeURIComponent(name)}`;
    console.log('🔍 Fetching dataset from:', url);

    try {
      const response = await fetch(url);
      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Failed to fetch dataset: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Dataset loaded:', data.dataset_name, '- Items:', data.data?.length);
      return data;
    } catch (error) {
      console.error('❌ Fetch error:', error);
      throw error;
    }
  }

  /**
   * Get image URL for a dataset item
   */
  getImageUrl(datasetName: string, itemId: number): string {
    return `${this.baseUrl}/dataset/getimg?name=${encodeURIComponent(datasetName)}&id=${itemId}`;
  }

  /**
   * Set category for an image dataset item
   */
  async setCategory(datasetName: string, itemId: number, label: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/dataset/setcat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: datasetName,
        id: itemId,
        label: label,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to set category');
    }

    // Handle both text and JSON responses
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      return { success: true, message: text };
    }
  }

  /**
   * Get text dataset
   */
  async getTextDataset(name: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/textdataset/get?name=${encodeURIComponent(name)}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch text dataset');
    }
    return response.json();
  }

  /**
   * Get single text item
   */
  async getTextItem(datasetName: string, itemId: number): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/textdataset/getitem?name=${encodeURIComponent(datasetName)}&id=${itemId}`
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch text item');
    }
    return response.json();
  }

  /**
   * Set label for a text dataset item
   */
  async setTextLabel(datasetName: string, itemId: number, label: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/textdataset/setlabel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: datasetName,
        id: itemId,
        label: label,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to set label');
    }

    // Handle both text and JSON responses
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      return { success: true, message: text };
    }
  }
}

// Export singleton instance
export const apiService = new APIService();

// Export types
export interface DatasetCategory {
  label: string;
  value: number;
}

export interface DatasetItem {
  category: number;
  filename: string;
  id: number;
}

export interface Dataset {
  categories: DatasetCategory[];
  data: DatasetItem[];
  dataset_name: string;
}

export interface TextDatasetItem {
  id: number;
  review: string;
  label: string | null;
}

export interface TextDataset {
  data: TextDatasetItem[];
}
