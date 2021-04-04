import React from 'react'
import Div from '@vkontakte/vkui/dist/components/Div/Div'
import Button from '@vkontakte/vkui/dist/components/Button/Button'
import './Question.css'
import clsx from 'clsx'
import { QuestionInstance } from '../models/question-model'
import { GAME_TYPES } from '../constants'
import { QuestionService } from './QuestionService'
import { Group } from '@vkontakte/vkui'

interface Props {
  question: QuestionInstance
  gameType: string
  onSelectAnswer(answer: string)
}

const renderQuestionMap = {
  [GAME_TYPES.WORD]: (questionWord: string) => (
    <>
      <p>Слово на английском: {questionWord}</p>
      <p>Выбери его перевод на русский:</p>
    </>
  ),
  [GAME_TYPES.PICTURE]: (imagePath: string) => (
    <div className="picture-question">
      <img
        src={QuestionService.createFullPictureUrl(imagePath)}
        alt="Картинка с вопросом"
      />
      <span>Это -</span>
    </div>
  ),
}

function Question({ question, gameType, onSelectAnswer }: Props): JSX.Element {
  const {
    answerWords,
    selectedAnswer,
    isCorrect,
    correctAnswer,
    question: questionString,
  } = question
  const renderQuestion = renderQuestionMap[gameType]
  return (
    <Div>
      <Group>{renderQuestion(questionString)}</Group>
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
            mode="secondary"
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

export default Question
