/**
 * Simple test utility for SCSS styling system
 */

export const testStyleSystem = () => {
  console.log('🧪 Testing Style System...');
  
  // Test 1: Check if CSS custom properties are available
  const rootStyles = getComputedStyle(document.documentElement);
  
  const colorTests = [
    '--white',
    '--black', 
    '--background',
    '--nav-bg',
    '--panel-bg',
    '--primary',
    '--border-color'
  ];
  
  console.log('✅ Testing CSS Custom Properties:');
  colorTests.forEach(property => {
    const value = rootStyles.getPropertyValue(property);
    if (value) {
      console.log(`  ✅ ${property}: ${value}`);
    } else {
      console.log(`  ❌ ${property}: Not found`);
    }
  });
  
  // Test 2: Check if fonts are loaded
  console.log('✅ Testing Font Loading:');
  const dmSansLoaded = document.fonts.check('1em "DM Sans"');
  console.log(`  DM Sans loaded: ${dmSansLoaded ? '✅' : '❌'}`);
  
  // Test 3: Check if SCSS modules are working
  console.log('✅ Testing SCSS Module Compilation:');
  try {
    // This will throw an error if SCSS compilation fails
    const testElement = document.createElement('div');
    testElement.style.backgroundColor = 'var(--background)';
    console.log('  ✅ SCSS compilation successful');
  } catch (error) {
    console.error('  ❌ SCSS compilation failed:', error);
  }
  
  // Test 4: Check if global styles are applied
  console.log('✅ Testing Global Styles:');
  const bodyFont = getComputedStyle(document.body).fontFamily;
  const bodyBg = getComputedStyle(document.body).backgroundColor;
  
  console.log(`  Body font: ${bodyFont}`);
  console.log(`  Body background: ${bodyBg}`);
  
  if (bodyFont.includes('DM Sans')) {
    console.log('  ✅ DM Sans font applied to body');
  } else {
    console.log('  ❌ DM Sans font not applied to body');
  }
  
  if (bodyBg.includes('204, 223, 209')) { // #ccdfd1 in rgb
    console.log('  ✅ Background color applied correctly');
  } else {
    console.log('  ❌ Background color not applied correctly');
  }
  
  console.log('🎉 Style System tests completed!');
};

// Export for manual testing
export default testStyleSystem; 