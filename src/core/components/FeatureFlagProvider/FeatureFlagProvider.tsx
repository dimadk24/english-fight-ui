import React from 'react'
import { SplitFactory } from '@splitsoftware/splitio-react'
import { UserInstance } from '../../user-model'
import SplitIO from '@splitsoftware/splitio/types/splitio'
import { Utils } from '../../../Utils'
import { FeatureFlagService } from '../../FeatureFlagService'

type Props = {
  children: JSX.Element
  user: UserInstance
}

const SPLIT_KEY = process.env.REACT_APP_SPLIT_KEY

function FeatureFlagProvider({ user, children }: Props): JSX.Element {
  if (user === null) return children
  const splitConfig: SplitIO.IBrowserSettings = {
    core: {
      authorizationKey: SPLIT_KEY,
      key: String(user.vkId),
    },
  }
  if (!Utils.isProductionMode) {
    splitConfig.core.authorizationKey = 'localhost'
    splitConfig.features = FeatureFlagService.getDevFeatureFlags()
  }
  return <SplitFactory config={splitConfig}>{children}</SplitFactory>
}

export default FeatureFlagProvider
