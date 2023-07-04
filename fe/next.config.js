/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    apiURL: 'http://127.0.0.1:8000/api/',
  }
}

module.exports = nextConfig
