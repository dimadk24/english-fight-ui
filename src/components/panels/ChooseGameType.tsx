import React from 'react'
import PanelHeader from '../helpers/PanelHeader'
import { Button, Div, Header } from '@vkontakte/vkui'
import { GAME_TYPES } from '../../constants'
import './ChooseGameType.css'

interface Props {
  onGoBack(): void
  onChoose(type: string): void
}

function ChooseGameType({ onGoBack, onChoose }: Props): JSX.Element {
  return (
    <>
      <PanelHeader text="Тип игры" onBackButtonClick={onGoBack} />
      <Div>
        <Header mode="primary">Выбери тип игры:</Header>
        <div className="choose-game-type-body">
          <Button size="l" onClick={() => onChoose(GAME_TYPES.PICTURE)}>
            Картинка
          </Button>
          <Button size="l" onClick={() => onChoose(GAME_TYPES.WORD)}>
            Перевод
          </Button>
        </div>
      </Div>
    </>
  )
}

export default ChooseGameType
