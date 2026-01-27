const requiredEnvs = [
  'NEXT_PUBLIC_API_URL',
];

const env = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
};

// Check for missing environment variables
if (typeof window === 'undefined') {
  // Only check on server side to prevent build breaks if validation is strict,
  // or check both if critical.
  // Actually, client-side relies on these too.
}

requiredEnvs.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`Missing environment variable: ${key}`);
    // In strict mode we might throw, but for now just warn to avoid crashing dev if not set yet.
  }
});

export default env;
