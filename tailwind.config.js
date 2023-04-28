import colors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'ui-serif', 'serif'],
      },
      colors: {
        gray: {
          ...colors.neutral,
        }
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            // variables
            '--tw-prose-body': theme('colors.gray.300'),
            '--tw-prose-headings': theme('colors.gray.100'),
            '--tw-prose-bold': theme('colors.gray-100'), // not working?
            '--tw-prose-quotes': theme('colors.gray.400'),
            '--tw-prose-quote-borders': theme('colors.gray.800'),
            '--tw-prose-counters': theme('colors.gray.500'),
            '--tw-prose-bullets': theme('colors.gray.500'),
            '--tw-prose-pre-code': theme('colors.gray.100'),
            '--tw-prose-pre-bg': theme('colors.gray.900'),

            // overrides
            fontFamily: theme('fontFamily.serif'),
            strong: {
              color: theme('colors.gray.100'), // temporary fix for bold text
            },
            a: {
              color: theme('colors.orange.300'),
              textDecoration: 'underline',
              '&:hover': {
                color: theme('colors.orange.400'),
              },
            }
          },
        }
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}
