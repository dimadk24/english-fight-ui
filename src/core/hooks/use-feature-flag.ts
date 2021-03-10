import { useContext } from 'react'
import { SplitContext, useTreatments } from '@splitsoftware/splitio-react'
import { ISplitContextValues } from '@splitsoftware/splitio-react/types/SplitContext'

const trueValues = ['on', '1', 'true', 'yes']

export default function useFeatureFlag(
  name: string
): {
  isReady: boolean
  enabled: boolean
} {
  const { isReady } = useContext<ISplitContextValues>(SplitContext)

  const treatments = useTreatments([name])
  const value = Boolean(treatments[name]) && treatments[name].treatment
  const enabled = trueValues.includes(value)

  return {
    isReady,
    enabled,
  }
}
