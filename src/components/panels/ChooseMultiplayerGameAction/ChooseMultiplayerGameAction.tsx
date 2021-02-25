import React from 'react'
import PanelHeader from '../../helpers/PanelHeader'
import { Button, Div, Header } from '@vkontakte/vkui'
import './ChooseMultiplayerGameAction.css'

type Props = {
  onCreateNew(): void
  onJoin(): void
  onGoBack(): void
}

function ChooseMultiplayerGameAction({
  onCreateNew,
  onJoin,
  onGoBack,
}: Props): JSX.Element {
  return (
    <>
      <PanelHeader text="Выбери действие" onBackButtonClick={onGoBack} />
      <Div>
        <Header mode="primary">Выбери действие:</Header>
        <div className="choose-action-buttons-wrapper">
          <Button onClick={onCreateNew} size="xl" stretched>
            Начать новую игру
          </Button>
          <Button onClick={onJoin} size="xl" stretched>
            Присоединиться к существующей
          </Button>
        </div>
      </Div>
    </>
  )
}

export default ChooseMultiplayerGameAction
