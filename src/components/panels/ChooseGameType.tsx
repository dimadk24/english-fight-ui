import React from 'react'
import PanelHeader from '../helpers/PanelHeader'
import { Cell, Group, Header, List } from '@vkontakte/vkui'
import { GAME_TYPES } from '../../constants'
import {
  Icon28PictureOutline,
  Icon28SortHorizontalOutline,
} from '@vkontakte/icons'

interface Props {
  onGoBack(): void
  onChoose(type: string): void
}

function ChooseGameType({ onGoBack, onChoose }: Props): JSX.Element {
  return (
    <>
      <PanelHeader text="Тип игры" onBackButtonClick={onGoBack} />
      <Group header={<Header mode="primary">Выбери тип игры:</Header>}>
        <List>
          <Cell
            before={<Icon28PictureOutline />}
            expandable
            onClick={() => onChoose(GAME_TYPES.PICTURE)}
          >
            Картинка
          </Cell>
          <Cell
            before={<Icon28SortHorizontalOutline />}
            expandable
            onClick={() => onChoose(GAME_TYPES.WORD)}
          >
            Перевод
          </Cell>
        </List>
      </Group>
    </>
  )
}

export default ChooseGameType
