export class FeatureFlagService {
  static getDevFlagsFrom(params: string): Record<string, string> {
    const result = {}
    const searchParams = new URLSearchParams(params)
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of searchParams.entries()) {
      if (key.startsWith('feature')) {
        const featureFlagName = key.replace(/^feature_/, '')
        result[featureFlagName] = value
      }
    }
    return result
  }

  static getDevFeatureFlags(): Record<string, string> {
    return {
      ...FeatureFlagService.getDevFlagsFrom(window.location.search),
      ...FeatureFlagService.getDevFlagsFrom(window.location.hash.slice(1)),
    }
  }
}
