import React, { useEffect, useState } from 'react'
import PropTypes, { InferProps } from 'prop-types'
import { PanelSpinner } from '@vkontakte/vkui'

function Loader({
  delay,
  render,
}: InferProps<typeof Loader.propTypes>): JSX.Element {
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

Loader.propTypes = {
  delay: PropTypes.number,
  render: PropTypes.func,
}

Loader.defaultProps = {
  delay: 200,
  render: () => <PanelSpinner size="large" />,
}

export default Loader
