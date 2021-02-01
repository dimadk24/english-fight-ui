import React, { useEffect, useState } from 'react'
import PanelHeader from '../helpers/PanelHeader'
import { ApiService } from '../../core/ApiService'
import { Div, FixedLayout, Group, List, Tabs, TabsItem } from '@vkontakte/vkui'
import { ScoreboardUser } from '../../models/scoreboard-user-model'
import './ScoreboardHome.css'
import ScoreboardItem from './ScoreboardItem'
import Loader from '../helpers/Loader'
import { UserInstance } from '../../core/user-model'

const SCOREBOARD_TYPES = {
  forever: 'forever',
  monthly: 'monthly',
}

interface Props {
  user: UserInstance
}

function ScoreboardHome({ user = null }: Props): JSX.Element {
  const [usersList, setUsersList] = useState<ScoreboardUser[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState(SCOREBOARD_TYPES.forever)
  const [currentUserInScoreboard, setCurrentUserInScoreboard] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setUsersList([])
      setLoading(true)
      const users = await ApiService.get<ScoreboardUser[]>(
        `${activeTab}_scoreboard`
      )
      const currentScoreboardUser = ScoreboardUser.fromObject({ ...user })
      setCurrentUserInScoreboard(
        Boolean(users.find(({ id }) => id === currentScoreboardUser.id))
      )
      setUsersList(users)
      setLoading(false)
    }

    fetchData()
  }, [activeTab, user])

  return (
    <>
      <PanelHeader text="Рейтинг" showBackButton={false} />
      <FixedLayout vertical="top">
        <Tabs>
          <TabsItem
            selected={activeTab === SCOREBOARD_TYPES.forever}
            onClick={() => setActiveTab(SCOREBOARD_TYPES.forever)}
          >
            За все время
          </TabsItem>
          <TabsItem
            selected={activeTab === SCOREBOARD_TYPES.monthly}
            onClick={() => setActiveTab(SCOREBOARD_TYPES.monthly)}
          >
            За месяц
          </TabsItem>
        </Tabs>
      </FixedLayout>
      <Div>
        <Group style={{ paddingTop: '20px' }}>
          {!loading && (
            <List>
              {usersList.map(
                ({ id, firstName, lastName, photoUrl, score }, index) => (
                  <ScoreboardItem
                    rank={index + 1}
                    score={score}
                    photoUrl={photoUrl}
                    firstName={firstName}
                    lastName={lastName}
                    key={id}
                  />
                )
              )}
              {!currentUserInScoreboard && (
                <ScoreboardItem
                  rank={
                    activeTab === SCOREBOARD_TYPES.forever
                      ? user.foreverRank
                      : user.monthlyRank
                  }
                  score={
                    activeTab === SCOREBOARD_TYPES.forever
                      ? user.score
                      : user.monthlyScore
                  }
                  photoUrl={user.photoUrl}
                  firstName={user.firstName}
                  lastName={user.lastName}
                />
              )}
            </List>
          )}
          {loading && <Loader />}
        </Group>
      </Div>
    </>
  )
}

export default ScoreboardHome
