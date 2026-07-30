// Sentry webpack plugin config — auto-uploads source maps in production
const { withSentryConfig } = require("@sentry/nextjs") || {};

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
};

// Wrap with Sentry only if SENTRY_DSN is configured
const hasSentry = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
const finalConfig = hasSentry
  ? withSentryConfig(nextConfig, {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      silent: true,
      sourcemaps: { disable: process.env.NODE_ENV !== "production" },
    })
  : nextConfig;

export default finalConfig;
