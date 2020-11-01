import React from 'react'
import PropTypes from 'prop-types'
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
}) {
  const vkPanelHeaderProps = panelHeaderProps
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
  // eslint-disable-next-line react/forbid-prop-types
  panelHeaderProps: PropTypes.object,
  showBackButton: PropTypes.bool,
}

PanelHeader.defaultProps = {
  panelHeaderProps: {},
  showBackButton: true,
  onBackButtonClick: () => {},
}
