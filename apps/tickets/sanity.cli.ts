import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  app: {
    organizationId: 'oIcF54Pch',
    entry: './src/App.tsx',
  },
  deployment: {
    appId: 'v8w5e18m59g9wrhi2hwdx4m7',
  }
})
