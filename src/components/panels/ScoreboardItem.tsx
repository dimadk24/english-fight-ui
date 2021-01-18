import React from 'react'
import PropTypes, { InferProps } from 'prop-types'
import { Avatar, Counter, SimpleCell } from '@vkontakte/vkui'

function ScoreboardItem({
  rank,
  score,
  photoUrl,
  firstName,
  lastName,
}: InferProps<typeof ScoreboardItem.propTypes>): JSX.Element {
  return (
    <SimpleCell before={<Counter>{rank}</Counter>} after={score}>
      <div className="scoreboard-item">
        <Avatar size={40} src={photoUrl} />
        <div className="scoreboard-item-name">
          {firstName} {lastName}
        </div>
      </div>
    </SimpleCell>
  )
}

ScoreboardItem.propTypes = {
  rank: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
  photoUrl: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
}

export default ScoreboardItem
