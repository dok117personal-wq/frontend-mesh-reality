/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: { bodySizeLimit: '200mb' },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.magicui.design',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hackhouse.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Exclude server directory from the build
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }

    // Avoid watchpack scanning system folders (e.g. E:\System Volume Information on Windows)
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        '**/node_modules/**',
        '**/.next/**',
        '**/System Volume Information/**',
        '**/$RECYCLE.BIN/**',
      ],
    };

    config.module.rules.push({
      test: /\.mjs$/,
      type: 'javascript/esm',
      resolve: {
        fullySpecified: false,
      },
    });

    return config;
  },
};

export default nextConfig;
