import React, { useEffect, useState } from 'react'
import { PanelSpinner } from '@vkontakte/vkui'
import { DELAY_BEFORE_LOADER } from '../../constants'

type Props = {
  delay?: number
  render?(): JSX.Element
}

function Loader({
  delay = DELAY_BEFORE_LOADER,
  render = () => <PanelSpinner size="large" />,
}: Props): JSX.Element {
  const [pastDelay, setPastDelay] = useState(false)
  useEffect(() => {
    const timerId = setTimeout(() => {
      setPastDelay(true)
    }, delay)
    return () => {
      clearTimeout(timerId)
    }
  }, [delay])

  if (pastDelay) return render()
  return null
}

export default Loader
