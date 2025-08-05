import type { NextConfig } from "next";

// -------------------------------------------------------------------------------------------------
// Images configuration
// -------------------------------------------------------------------------------------------------
// In production, BUILD-time environment variables are sometimes not passed correctly which results
// in an *empty* hostname in the `remotePatterns` array. When that happens the default image optimizer
// rejects every request with the error: `"url" parameter is not allowed`.
//
// To make sure the blob storage domain is always allowed we:
//  1. Read the NEXT_PUBLIC_BLOB_STORAGE_URL value (if provided).
//  2. Fallback to the default Azure blob domain used by the application.
//  3. Strip protocol/path so that only the bare hostname is used (required by Next.js).
// -------------------------------------------------------------------------------------------------

function extractHostname(url: string): string {
  // Remove protocol
  let hostname = url.replace(/^https?:\/\//i, "");
  // Remove everything after first slash (path / query / etc.)
  hostname = hostname.split("/")[0];
  return hostname;
}

const DEFAULT_BLOB_HOST = "stoaappstorage.blob.core.windows.net";

const blobStorageUrlEnv = process.env.NEXT_PUBLIC_BLOB_STORAGE_URL;
const blobStorageHost = blobStorageUrlEnv
  ? extractHostname(blobStorageUrlEnv)
  : DEFAULT_BLOB_HOST;

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.yapily.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: blobStorageHost,
        port: "",
        pathname: "/**",
      },
      // Support any additional blob containers in the same Azure account
      {
        protocol: "https",
        hostname: "*.blob.core.windows.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.azurewebsites.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.stoa.money",
        port: "",
        pathname: "/**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true
  },
};

export default nextConfig;
