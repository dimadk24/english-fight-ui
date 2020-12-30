import React from 'react'
import PropTypes, { InferProps } from 'prop-types'
import * as Sentry from '@sentry/react'
import Button from '@vkontakte/vkui/dist/components/Button/Button'
import { Utils } from '../Utils'

/**
 * Component catches only errors in rendering phase and lifecycle
 * Error in click and async handlers need to be caught and rendered separately
 */
export function ErrorBoundary({
  children,
}: InferProps<typeof ErrorBoundary.propTypes>): JSX.Element {
  if (!Utils.isProductionMode) return children

  return (
    <Sentry.ErrorBoundary
      fallback={({ error, componentStack, resetError }) => (
        <>
          <div>Ошибка отрисовки:</div>
          <p>{error.message}</p>
          <p>{componentStack}</p>
          <Button onClick={resetError}>Попробовать еще раз</Button>
        </>
      )}
    >
      {children}
    </Sentry.ErrorBoundary>
  )
}

ErrorBoundary.propTypes = {
  children: PropTypes.element.isRequired,
}
