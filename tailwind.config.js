/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'], // fine even if you use data-theme; our CSS uses vars
  content: [
    './app/**/*.{js,jsx,ts,tsx,mdx}',
    './components/**/*.{js,jsx,ts,tsx,mdx}',
    './content/**/*.{md,mdx}',
  ],
  theme: { extend: {} },
  plugins: [require('@tailwindcss/typography')],
};
