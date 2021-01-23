import React from 'react'
import PropTypes, { InferProps } from 'prop-types'
import Button from '@vkontakte/vkui/dist/components/Button/Button'
import Group from '@vkontakte/vkui/dist/components/Group/Group'
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell'
import Div from '@vkontakte/vkui/dist/components/Div/Div'
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar'
import PanelHeader from '../helpers/PanelHeader'

const Home = ({
  onStartBattle,
  user,
}: InferProps<typeof Home.propTypes>): JSX.Element => (
  <>
    <PanelHeader text="English Clash" showBackButton={false} />
    {user && (
      <Group>
        <Cell
          before={user.photoUrl ? <Avatar src={user.photoUrl} /> : null}
          description={
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span>Количество очков - {user.score}</span>{' '}
              <span>Место в рейтинге: {user.foreverRank}</span>
            </div>
          }
          multiline
        >
          {`${user.firstName} ${user.lastName}`}
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
  </>
)

Home.propTypes = {
  onStartBattle: PropTypes.func.isRequired,
  user: PropTypes.shape({
    photoUrl: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
    foreverRank: PropTypes.number.isRequired,
    monthlyRank: PropTypes.number.isRequired,
    notificationsStatus: PropTypes.string.isRequired,
  }),
}

Home.defaultProps = {
  user: null,
}

export default Home
