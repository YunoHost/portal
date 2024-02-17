module.exports = {
  // Safelisting some classes to avoid content purge
  plugins: [require('daisyui')],
  safelist: [
    'safelisted',
    'bg-primary',
    'bg-secondary',
    'bg-accent',
    'bg-neutral',
    'bg-base-100',
    'bg-base-200',
    'bg-base-300',
    'bg-base-content',
    'bg-info',
    'bg-success',
    'bg-warning',
    'bg-error',
  ],
  daisyui: {
    themes: true,
  },
}
