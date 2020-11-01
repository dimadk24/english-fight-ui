import React from 'react'
import PropTypes from 'prop-types'
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel'
import PanelHeader from '../helpers/PanelHeader'

const Battle = ({ id, go }) => {
  return (
    <Panel id={id}>
      <PanelHeader onBackButtonClick={() => go('home')} text="Сражение" />
    </Panel>
  )
}

Battle.propTypes = {
  id: PropTypes.string.isRequired,
  go: PropTypes.func.isRequired,
}

export default Battle
