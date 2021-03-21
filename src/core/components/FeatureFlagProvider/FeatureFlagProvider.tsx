import React from 'react'
import { SplitClient, SplitFactory } from '@splitsoftware/splitio-react'
import { UserInstance } from '../../user-model'
import SplitIO from '@splitsoftware/splitio/types/splitio'
import { Utils } from '../../../Utils'
import { FeatureFlagService } from '../../FeatureFlagService'

type Props = {
  children: JSX.Element
  user: UserInstance | null
}

const SPLIT_KEY = process.env.REACT_APP_SPLIT_KEY

function FeatureFlagProvider({ user, children }: Props): JSX.Element {
  const splitConfig: SplitIO.IBrowserSettings = {
    core: {
      authorizationKey: SPLIT_KEY,
      // https://github.com/splitio/react-client/issues/10
      key: 'anonymous',
    },
  }
  if (!Utils.isProductionMode) {
    splitConfig.core.authorizationKey = 'localhost'
    splitConfig.features = FeatureFlagService.getDevFeatureFlags()
  }
  const splitClientKey = user ? String(user.vkId) : 'anonymous'
  return (
    <SplitFactory config={splitConfig}>
      <SplitClient splitKey={splitClientKey}>{children}</SplitClient>
    </SplitFactory>
  )
}

export default FeatureFlagProvider
