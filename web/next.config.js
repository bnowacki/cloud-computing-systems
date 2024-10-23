/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    additionalData: `@import "src/styles/_variables.scss"; @import "src/styles/_mixins.scss";`,
  },
}

module.exports = nextConfig
