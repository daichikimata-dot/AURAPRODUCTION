/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: '**.onrender.com' },
            { protocol: 'https', hostname: '**.supabase.co' },
            { protocol: 'http', hostname: 'localhost' },
            { protocol: 'http', hostname: '127.0.0.1' },
        ]
    },
    async rewrites() {
        return [
            {
                source: '/api/engine/:path*',
                destination: 'http://127.0.0.1:8000/:path*',
            },
        ]
    },
}

export default nextConfig
