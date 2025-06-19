import React from 'react';
import styles from './StyleTest.module.scss';

export const StyleTest: React.FC = () => {
  return (
    <div className={styles.styleTest}>
      <h1>Style System Test</h1>
      
      <section className={styles.testSection}>
        <h2>Color Variables Test</h2>
        <div className={styles.colorGrid}>
          <div className={styles.colorSwatch} style={{ backgroundColor: 'var(--white)' }}>
            <span>White</span>
            <code>var(--white)</code>
          </div>
          <div className={styles.colorSwatch} style={{ backgroundColor: 'var(--black)', color: 'var(--white)' }}>
            <span>Black</span>
            <code>var(--black)</code>
          </div>
          <div className={styles.colorSwatch} style={{ backgroundColor: 'var(--background)' }}>
            <span>Background</span>
            <code>var(--background)</code>
          </div>
          <div className={styles.colorSwatch} style={{ backgroundColor: 'var(--nav-bg)', color: 'var(--white)' }}>
            <span>Nav BG</span>
            <code>var(--nav-bg)</code>
          </div>
          <div className={styles.colorSwatch} style={{ backgroundColor: 'var(--panel-bg)' }}>
            <span>Panel BG</span>
            <code>var(--panel-bg)</code>
          </div>
          <div className={styles.colorSwatch} style={{ backgroundColor: 'var(--primary)' }}>
            <span>Primary</span>
            <code>var(--primary)</code>
          </div>
        </div>
      </section>

      <section className={styles.testSection}>
        <h2>Typography Test</h2>
        <div className={styles.typographyTest}>
          <h1>Heading 1 - DM Sans Font</h1>
          <h2>Heading 2 - DM Sans Font</h2>
          <h3>Heading 3 - DM Sans Font</h3>
          <h4>Heading 4 - DM Sans Font</h4>
          <h5>Heading 5 - DM Sans Font</h5>
          <h6>Heading 6 - DM Sans Font</h6>
          <p>This is a paragraph with DM Sans font. It should have proper line height and spacing.</p>
          <p>Another paragraph to test spacing between elements.</p>
        </div>
      </section>

      <section className={styles.testSection}>
        <h2>Component Styles Test</h2>
        <div className={styles.componentTest}>
          <button className={styles.testButton}>Test Button</button>
          <input 
            type="text" 
            placeholder="Test input field" 
            className={styles.testInput}
          />
          <div className={styles.testPanel}>
            <h3>Test Panel</h3>
            <p>This panel uses the Darwin Duck styling variables.</p>
          </div>
        </div>
      </section>

      <section className={styles.testSection}>
        <h2>SCSS Features Test</h2>
        <div className={styles.scssTest}>
          <div className={styles.nestedElement}>
            <span>Nested SCSS</span>
            <div className={styles.deepNested}>
              <span>Deep nested</span>
            </div>
          </div>
          <div className={styles.pseudoTest}>
            Hover me for pseudo-class test
          </div>
        </div>
      </section>
    </div>
  );
}; 