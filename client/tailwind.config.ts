import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0058be',
        'on-primary': '#ffffff',
        background: '#f8f9ff',
        'on-background': '#0b1c30',
        surface: '#f8f9ff',
        'on-surface': '#0b1c30',
        'surface-variant': '#d3e4fe',
        'on-surface-variant': '#424754',
        outline: '#727785',
        'outline-variant': '#c2c6d6',
        error: '#ba1a1a',
        'on-error': '#ffffff',
        'secondary-container': '#d5e0f8',
        'on-secondary-container': '#586377',
        'surface-container-low': '#eff4ff',
        'surface-container-lowest': '#ffffff',
      },
      spacing: {
        'margin-mobile': '16px',
        'margin-desktop': '40px',
        'container-max': '1280px',
        gutter: '24px',
        base: '8px',
      },
      fontFamily: {
        'label-md': ['Inter', 'sans-serif'],
        'body-lg': ['Inter', 'sans-serif'],
        'label-sm': ['Inter', 'sans-serif'],
        'display-lg': ['Inter', 'sans-serif'],
        'headline-sm': ['Inter', 'sans-serif'],
        'title-lg': ['Inter', 'sans-serif'],
        'headline-md': ['Inter', 'sans-serif'],
        'body-md': ['Inter', 'sans-serif'],
        'display-lg-mobile': ['Inter', 'sans-serif'],
      },
      fontSize: {
        'label-md': ['14px', { lineHeight: '20px', letterSpacing: '0.01em', fontWeight: '500' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'label-sm': ['12px', { lineHeight: '16px', fontWeight: '600' }],
        'display-lg': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-sm': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'title-lg': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'headline-md': [
          '30px',
          { lineHeight: '38px', letterSpacing: '-0.01em', fontWeight: '600' },
        ],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'display-lg-mobile': [
          '36px',
          { lineHeight: '44px', letterSpacing: '-0.02em', fontWeight: '700' },
        ],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
};

export default config;
