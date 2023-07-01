/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    apiURL: 'http://127.0.0.1:8000/api/',
  }
}

module.exports = nextConfig
