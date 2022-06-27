function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`
    }
    return `rgba(var(${variableName}))`
  }
}

module.exports = {
  content: [
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.js',
    './nuxt.config.ts',
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ['Asap', 'Helvetica', 'Arial', 'sans-serif'],
      },
      textColor: {
        theme: {
          primary: withOpacity('--color-text-primary'),
          secondary: withOpacity('--color-text-secondary'),
          accent: withOpacity('--color-text-accent'),
          decent: withOpacity('--color-text-decent'),
          base: withOpacity('--color-text-base'),
          active: withOpacity('--color-text-active'),
        },
      },
      backgroundColor: {
        theme: {
          primary: withOpacity('--color-background-primary'),
          secondary: withOpacity('--color-background-secondary'),
          thirdly: withOpacity('--color-background-thirdly'),
          accent: withOpacity('--color-background-accent'),
          'accent-dark': withOpacity('--color-background-accent-dark'),
          base: withOpacity('--color-background-base'),
          active: withOpacity('--color-background-active'),
        },
      },
      borderColor: {
        theme: {
          primary: withOpacity('--color-border-primary'),
          secondary: withOpacity('--color-border-secondary'),
        },
      },
      colors: {
        current: 'currentColor',
      },
      width: {
        100: '25rem',
        112: '28rem',
      },
      screens: {
        '3xl': '1920px',
      },
    },
  },
}
