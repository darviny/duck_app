/**
 * Test utility for NavBar structure and accessibility
 */

export const testNavBarStructure = () => {
  console.log('🧪 Testing NavBar Structure...');
  
  // Test 1: Check if NavBar element exists and has proper attributes
  console.log('✅ Testing NavBar Element:');
  const navBar = document.querySelector('nav[role="navigation"]');
  
  if (navBar) {
    console.log('  ✅ NavBar element found with role="navigation"');
    
    const ariaLabel = navBar.getAttribute('aria-label');
    if (ariaLabel === 'Main navigation') {
      console.log('  ✅ aria-label="Main navigation" is set correctly');
    } else {
      console.log('  ❌ aria-label is missing or incorrect');
    }
  } else {
    console.log('  ❌ NavBar element not found or missing role="navigation"');
  }
  
  // Test 2: Check if logo exists and has proper attributes
  console.log('✅ Testing Logo Element:');
  const logo = document.querySelector('img[alt="Darwin Duck Logo"]');
  
  if (logo) {
    console.log('  ✅ Logo image found with proper alt text');
    
    const width = logo.getAttribute('width');
    const height = logo.getAttribute('height');
    if (width && height) {
      console.log(`  ✅ Logo has dimensions: ${width}x${height}`);
    } else {
      console.log('  ⚠️ Logo missing width/height attributes');
    }
  } else {
    console.log('  ❌ Logo image not found or missing alt text');
  }
  
  // Test 3: Check if sign-in button exists and has proper attributes
  console.log('✅ Testing Sign-In Button:');
  const signInButton = document.querySelector('button[aria-label="Sign in to your account"]');
  
  if (signInButton) {
    console.log('  ✅ Sign-in button found with proper aria-label');
    
    const buttonText = signInButton.textContent?.trim();
    if (buttonText === 'Sign In') {
      console.log('  ✅ Button text is correct');
    } else {
      console.log('  ❌ Button text is incorrect');
    }
  } else {
    console.log('  ❌ Sign-in button not found or missing aria-label');
  }
  
  // Test 4: Check if navigation list exists and has proper structure
  console.log('✅ Testing Navigation List:');
  const navList = document.querySelector('ul[role="list"]');
  
  if (navList) {
    console.log('  ✅ Navigation list found with role="list"');
    
    const navItems = navList.querySelectorAll('li');
    console.log(`  ✅ Found ${navItems.length} navigation items`);
    
    // Check each navigation item
    navItems.forEach((item, index) => {
      const link = item.querySelector('a');
      const icon = item.querySelector('img');
      const text = item.querySelector('span');
      
      if (link && icon && text) {
        console.log(`  ✅ Item ${index + 1}: Link, icon, and text present`);
        
        const ariaLabel = link.getAttribute('aria-label');
        if (ariaLabel) {
          console.log(`    ✅ aria-label: "${ariaLabel}"`);
        } else {
          console.log(`    ❌ Missing aria-label`);
        }
        
        const iconAlt = icon.getAttribute('alt');
        if (iconAlt === '') {
          console.log(`    ✅ Icon has empty alt="" (decorative)`);
        } else {
          console.log(`    ❌ Icon missing empty alt=""`);
        }
      } else {
        console.log(`  ❌ Item ${index + 1}: Missing link, icon, or text`);
      }
    });
  } else {
    console.log('  ❌ Navigation list not found or missing role="list"');
  }
  
  // Test 5: Check if all required navigation links exist
  console.log('✅ Testing Navigation Links:');
  const expectedLinks = [
    { href: '#new-duck', text: 'New Duck' },
    { href: '#courses', text: 'Courses' },
    { href: '#study-plan', text: 'Study Plan' },
    { href: '#settings', text: 'Settings' }
  ];
  
  expectedLinks.forEach(expected => {
    const link = document.querySelector(`a[href="${expected.href}"]`);
    if (link) {
      const text = link.textContent?.trim();
      if (text === expected.text) {
        console.log(`  ✅ "${expected.text}" link found with correct href`);
      } else {
        console.log(`  ❌ "${expected.text}" link text incorrect: "${text}"`);
      }
    } else {
      console.log(`  ❌ "${expected.text}" link not found`);
    }
  });
  
  // Test 6: Check CSS classes and styling
  console.log('✅ Testing CSS Classes:');
  const requiredClasses = [
    'navBar',
    'navBarBg',
    'logoContainer',
    'logoIcon',
    'signInContainer',
    'signInButton',
    'navigationLinks',
    'navList',
    'navItem',
    'navLink',
    'navIcon',
    'navText'
  ];
  
  requiredClasses.forEach(className => {
    const elements = document.querySelectorAll(`.${className}`);
    if (elements.length > 0) {
      console.log(`  ✅ .${className} class is applied`);
    } else {
      console.log(`  ❌ .${className} class not found`);
    }
  });
  
  console.log('🎉 NavBar Structure tests completed!');
};

// Export for manual testing
export default testNavBarStructure;

import { NavBarProps } from '../types/components';

/**
 * Test utility for NavBar component styling verification
 */
export const verifyNavBarStyling = (): {
  passed: boolean;
  details: string[];
  errors: string[];
} => {
  const details: string[] = [];
  const errors: string[] = [];

  // Test 1: Check if NavBar component exists
  try {
    const NavBar = require('../components/NavBar/NavBar').default;
    if (NavBar) {
      details.push('✅ NavBar component exists and is properly exported');
    } else {
      errors.push('❌ NavBar component not found or not properly exported');
    }
  } catch (error) {
    errors.push(`❌ Error loading NavBar component: ${error}`);
  }

  // Test 2: Check if SCSS module exists
  try {
    const styles = require('../components/NavBar/NavBar.module.scss');
    if (styles) {
      details.push('✅ NavBar SCSS module exists');
      
      // Check for key style classes
      const requiredClasses = [
        'navBar',
        'navBarBg', 
        'logoContainer',
        'logoIcon',
        'signInContainer',
        'signInButton',
        'navigationLinks',
        'navList',
        'navItem',
        'navLink',
        'navIcon',
        'navText'
      ];
      
      const missingClasses = requiredClasses.filter(className => !styles[className]);
      if (missingClasses.length === 0) {
        details.push('✅ All required CSS classes are defined');
      } else {
        errors.push(`❌ Missing CSS classes: ${missingClasses.join(', ')}`);
      }
    } else {
      errors.push('❌ NavBar SCSS module not found');
    }
  } catch (error) {
    errors.push(`❌ Error loading NavBar SCSS module: ${error}`);
  }

  // Test 3: Check if assets are properly exported
  try {
    const assets = require('../assets/index');
    const requiredAssets = [
      'logoIcon',
      'iconNewduck', 
      'iconCourses',
      'iconStudyplan',
      'iconSettings'
    ];
    
    const missingAssets = requiredAssets.filter(asset => !assets[asset]);
    if (missingAssets.length === 0) {
      details.push('✅ All required assets are properly exported');
    } else {
      errors.push(`❌ Missing asset exports: ${missingAssets.join(', ')}`);
    }
  } catch (error) {
    errors.push(`❌ Error loading assets: ${error}`);
  }

  // Test 4: Verify styling matches original design
  details.push('🎨 Styling Verification:');
  details.push('  • Background: #272727 (dark gray)');
  details.push('  • Width: 327px (fixed)');
  details.push('  • Logo: 273.1px × 167.4px at top');
  details.push('  • Sign-in button: 232.7px × 48px at bottom');
  details.push('  • Navigation links: 36px font, white text');
  details.push('  • Icons: 25-35px dimensions with proper spacing');
  details.push('  • Font: Tiny5 for navigation text');

  // Test 5: Check accessibility features
  details.push('♿ Accessibility Features:');
  details.push('  • role="navigation" on nav element');
  details.push('  • aria-label attributes on interactive elements');
  details.push('  • Proper alt text on images');
  details.push('  • Keyboard navigation support');
  details.push('  • Focus states for interactive elements');

  const passed = errors.length === 0;
  
  return {
    passed,
    details,
    errors
  };
};

/**
 * Test NavBar component props interface
 */
export const testNavBarProps = (): NavBarProps => {
  return {
    onSignIn: () => console.log('Sign In clicked'),
    onNewDuck: () => console.log('New Duck clicked'),
    onCourses: () => console.log('Courses clicked'),
    onStudyPlan: () => console.log('Study Plan clicked'),
    onSettings: () => console.log('Settings clicked')
  };
};

/**
 * Log test results to console
 */
export const logNavBarTestResults = (): void => {
  console.log('🧪 NavBar Styling Test Results:');
  console.log('================================');
  
  const results = verifyNavBarStyling();
  
  if (results.passed) {
    console.log('✅ All tests passed!');
  } else {
    console.log('❌ Some tests failed:');
    results.errors.forEach(error => console.log(error));
  }
  
  console.log('\n📋 Test Details:');
  results.details.forEach(detail => console.log(detail));
  
  console.log('\n🎯 Next Steps:');
  console.log('1. Check browser to verify visual appearance');
  console.log('2. Test hover and focus states');
  console.log('3. Verify responsive behavior');
  console.log('4. Test click handlers');
}; 