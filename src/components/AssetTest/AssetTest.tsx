import React, { useState, useEffect } from 'react';
import { loadImageAsset, validateAssetPath, AssetLoadError, createAssetInfo } from '../../utils/assetLoader';
import styles from './AssetTest.module.scss';

// Import some test assets
import logoImage from '../../assets/img/logo.png';
import helpImage from '../../assets/img/help.png';

export const AssetTest: React.FC = () => {
  const [testResults, setTestResults] = useState<{
    logoLoaded: boolean;
    helpLoaded: boolean;
    missingAssetHandled: boolean;
    validationWorks: boolean;
  }>({
    logoLoaded: false,
    helpLoaded: false,
    missingAssetHandled: false,
    validationWorks: false,
  });

  useEffect(() => {
    const runTests = async () => {
      const results = { ...testResults };

      try {
        // Test 1: Load existing assets
        const logoUrl = await loadImageAsset('../../assets/img/logo.png');
        results.logoLoaded = !!logoUrl;
        console.log('✅ Logo asset loaded successfully:', logoUrl);
      } catch (error) {
        console.error('❌ Failed to load logo:', error);
      }

      try {
        const helpUrl = await loadImageAsset('../../assets/img/help.png');
        results.helpLoaded = !!helpUrl;
        console.log('✅ Help asset loaded successfully:', helpUrl);
      } catch (error) {
        console.error('❌ Failed to load help icon:', error);
      }

      // Test 2: Handle missing assets
      try {
        await loadImageAsset('../../assets/img/nonexistent.png');
      } catch (error) {
        if (error instanceof AssetLoadError) {
          results.missingAssetHandled = true;
          console.log('✅ Missing asset handled correctly:', error.message);
        }
      }

      // Test 3: Validate asset paths
      const logoExists = await validateAssetPath('../../assets/img/logo.png');
      const missingExists = await validateAssetPath('../../assets/img/nonexistent.png');
      results.validationWorks = logoExists && !missingExists;
      console.log('✅ Asset validation works:', { logoExists, missingExists });

      setTestResults(results);
    };

    runTests();
  }, []);

  const assetInfo = createAssetInfo(logoImage, 'Darwin Duck Logo', 273, 167);

  return (
    <div className={styles.assetTest}>
      <h2>Asset Management System Test</h2>
      
      <div className={styles.testSection}>
        <h3>Test Results:</h3>
        <ul>
          <li className={testResults.logoLoaded ? styles.success : styles.error}>
            Logo asset loading: {testResults.logoLoaded ? '✅ PASS' : '❌ FAIL'}
          </li>
          <li className={testResults.helpLoaded ? styles.success : styles.error}>
            Help icon loading: {testResults.helpLoaded ? '✅ PASS' : '❌ FAIL'}
          </li>
          <li className={testResults.missingAssetHandled ? styles.success : styles.error}>
            Missing asset handling: {testResults.missingAssetHandled ? '✅ PASS' : '❌ FAIL'}
          </li>
          <li className={testResults.validationWorks ? styles.success : styles.error}>
            Asset validation: {testResults.validationWorks ? '✅ PASS' : '❌ FAIL'}
          </li>
        </ul>
      </div>

      <div className={styles.testSection}>
        <h3>Visual Test:</h3>
        <div className={styles.imageTest}>
          <div>
            <h4>Logo (imported directly):</h4>
            <img 
              src={logoImage} 
              alt="Darwin Duck Logo" 
              className={styles.testImage}
            />
          </div>
          <div>
            <h4>Help Icon (imported directly):</h4>
            <img 
              src={helpImage} 
              alt="Help Icon" 
              className={styles.testImage}
            />
          </div>
          <div>
            <h4>Logo (using AssetInfo):</h4>
            <img 
              src={assetInfo.src} 
              alt={assetInfo.alt}
              width={assetInfo.width}
              height={assetInfo.height}
              className={styles.testImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 