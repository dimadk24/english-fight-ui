import React from 'react'
import PropTypes, { InferProps } from 'prop-types'
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel'
import Button from '@vkontakte/vkui/dist/components/Button/Button'
import Group from '@vkontakte/vkui/dist/components/Group/Group'
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell'
import Div from '@vkontakte/vkui/dist/components/Div/Div'
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar'
import PanelHeader from '../helpers/PanelHeader'

const Home = ({
  id,
  onStartBattle,
  fetchedUser,
}: InferProps<typeof Home.propTypes>): JSX.Element => (
  <Panel id={id}>
    <PanelHeader text="English Puzzle" showBackButton={false} />
    {fetchedUser && (
      <Group>
        <Cell
          before={
            fetchedUser.photoUrl ? <Avatar src={fetchedUser.photoUrl} /> : null
          }
          description={`Количество очков - ${fetchedUser.score}`}
        >
          {`${fetchedUser.firstName} ${fetchedUser.lastName}`}
        </Cell>
      </Group>
    )}

    <Group>
      <Div>
        <Button size="xl" onClick={onStartBattle}>
          Начать!
        </Button>
      </Div>
    </Group>
  </Panel>
)

Home.propTypes = {
  id: PropTypes.string.isRequired,
  onStartBattle: PropTypes.func.isRequired,
  fetchedUser: PropTypes.shape({
    photoUrl: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
  }),
}

Home.defaultProps = {
  fetchedUser: null,
}

export default Home
