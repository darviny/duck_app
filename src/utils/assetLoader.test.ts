/**
 * Simple test file for asset loader utilities
 * This can be run manually to verify functionality
 */

import { loadImageAsset, validateAssetPath, createAssetInfo, AssetLoadError } from './assetLoader';

// Test function that can be called manually
export const testAssetLoader = async () => {
  console.log('🧪 Testing Asset Loader...');
  
  try {
    // Test 1: Create AssetInfo
    const assetInfo = createAssetInfo('/test.png', 'Test Image', 100, 100);
    console.log('✅ AssetInfo creation:', assetInfo);
    
    // Test 2: Validate existing asset path (this should work)
    const logoExists = await validateAssetPath('../../assets/img/logo.png');
    console.log('✅ Logo validation:', logoExists);
    
    // Test 3: Validate non-existent asset path (this should fail)
    const missingExists = await validateAssetPath('../../assets/img/nonexistent.png');
    console.log('✅ Missing asset validation:', missingExists);
    
    // Test 4: Load existing asset
    try {
      const logoUrl = await loadImageAsset('../../assets/img/logo.png');
      console.log('✅ Logo asset loaded:', logoUrl);
    } catch (error) {
      console.error('❌ Failed to load logo:', error);
    }
    
    // Test 5: Handle missing asset
    try {
      await loadImageAsset('../../assets/img/nonexistent.png');
      console.log('❌ Should have thrown error for missing asset');
    } catch (error) {
      if (error instanceof AssetLoadError) {
        console.log('✅ Missing asset handled correctly:', error.message);
      } else {
        console.error('❌ Unexpected error type:', error);
      }
    }
    
    console.log('🎉 Asset Loader tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Export for manual testing
export default testAssetLoader; 