import React from 'react'
import PropTypes, { InferProps } from 'prop-types'
import Div from '@vkontakte/vkui/dist/components/Div/Div'
import Button from '@vkontakte/vkui/dist/components/Button/Button'
import './Question.css'
import clsx from 'clsx'

function Question({
  question,
  answerWords,
  selectedAnswer,
  isCorrect,
  correctAnswer,
  onSelectAnswer,
}: InferProps<typeof Question.propTypes>): JSX.Element {
  return (
    <Div>
      <p>Слово на английском: {question}</p>
      <p> Выбери его перевод на русский:</p>
      {answerWords.map((answer) => {
        const isCorrectAnswer = answer === correctAnswer
        const isFailure = !isCorrect && answer === selectedAnswer
        const classes = clsx('answer-button', {
          correct: isCorrectAnswer,
          failure: isFailure,
        })
        return (
          <Button
            key={answer}
            size="xl"
            mode="primary"
            stretched
            className={classes}
            onClick={() => !selectedAnswer && onSelectAnswer(answer)}
          >
            {answer}
          </Button>
        )
      })}
    </Div>
  )
}

Question.propTypes = {
  question: PropTypes.string.isRequired,
  answerWords: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedAnswer: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  correctAnswer: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  isCorrect: PropTypes.bool,
  onSelectAnswer: PropTypes.func.isRequired,
}

Question.defaultProps = {
  correctAnswer: null,
  selectedAnswer: null,
  isCorrect: false,
}

export default Question
