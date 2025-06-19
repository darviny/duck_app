/**
 * Utility function to safely import images with error handling
 */

export interface AssetInfo {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export class AssetLoadError extends Error {
  constructor(assetPath: string) {
    super(`Failed to load asset: ${assetPath}`);
    this.name = 'AssetLoadError';
  }
}

/**
 * Safely imports an image asset
 * @param assetPath - Path to the image asset
 * @returns Promise that resolves to the image URL or rejects with AssetLoadError
 */
export const loadImageAsset = async (assetPath: string): Promise<string> => {
  try {
    // Dynamic import for the asset
    const module = await import(assetPath);
    return module.default;
  } catch (error) {
    throw new AssetLoadError(assetPath);
  }
};

/**
 * Preloads multiple image assets
 * @param assetPaths - Array of asset paths to preload
 * @returns Promise that resolves when all assets are loaded
 */
export const preloadAssets = async (assetPaths: string[]): Promise<void> => {
  const loadPromises = assetPaths.map(path => loadImageAsset(path));
  await Promise.all(loadPromises);
};

/**
 * Creates an AssetInfo object for an image
 * @param src - Image source path
 * @param alt - Alt text for accessibility
 * @param width - Optional width
 * @param height - Optional height
 * @returns AssetInfo object
 */
export const createAssetInfo = (
  src: string,
  alt: string,
  width?: number,
  height?: number
): AssetInfo => ({
  src,
  alt,
  width,
  height,
});

/**
 * Validates if an asset path exists
 * @param assetPath - Path to validate
 * @returns Promise that resolves to boolean indicating if asset exists
 */
export const validateAssetPath = async (assetPath: string): Promise<boolean> => {
  try {
    await loadImageAsset(assetPath);
    return true;
  } catch {
    return false;
  }
}; 