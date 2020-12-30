import React from 'react'
import PropTypes, { InferProps } from 'prop-types'
import {
  PanelHeaderButton,
  PanelHeader as VKPanelHeader,
} from '@vkontakte/vkui'
import BackButton from './BackButton'

export default function PanelHeader({
  panelHeaderProps,
  onBackButtonClick,
  text,
  showBackButton,
}: InferProps<typeof PanelHeader.propTypes>): JSX.Element {
  const vkPanelHeaderProps = { ...panelHeaderProps }
  if (showBackButton)
    vkPanelHeaderProps.left = (
      <PanelHeaderButton onClick={onBackButtonClick}>
        <BackButton />
      </PanelHeaderButton>
    )
  else vkPanelHeaderProps.left = undefined
  return <VKPanelHeader {...vkPanelHeaderProps}>{text}</VKPanelHeader>
}

PanelHeader.propTypes = {
  onBackButtonClick: PropTypes.func,
  text: PropTypes.string.isRequired,
  panelHeaderProps: PropTypes.shape({
    left: PropTypes.node,
  }),
  showBackButton: PropTypes.bool,
}

PanelHeader.defaultProps = {
  panelHeaderProps: {},
  showBackButton: true,
  onBackButtonClick: () => {},
}
