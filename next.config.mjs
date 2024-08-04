/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ezvoyqyobltsardvbeox.supabase.co',
        port: '',
        pathname: '**',
      },
    ],
  },
}

export default nextConfig
