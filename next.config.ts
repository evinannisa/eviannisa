import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // WA_ME diteruskan ke browser karena dipakai komponen client (FloatingContacts).
  // Nomor ini tetap terlihat publik di link wa.me, jadi bukan rahasia.
  env: {
    WA_ME: process.env.WA_ME ?? '',
  },
}

export default nextConfig
