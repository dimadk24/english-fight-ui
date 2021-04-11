import React, { useContext } from 'react'
import Div from '@vkontakte/vkui/dist/components/Div/Div'
import Button from '@vkontakte/vkui/dist/components/Button/Button'
import './Question.css'
import clsx from 'clsx'
import { QuestionInstance } from '../models/question-model'
import { GAME_TYPES, Themes } from '../constants'
import { QuestionService } from './QuestionService'
import { Group, Headline } from '@vkontakte/vkui'
import { ThemeContext } from '../context/theme'

interface Props {
  question: QuestionInstance
  gameType: string
  onSelectAnswer(answer: string)
}

const renderQuestionMap = {
  [GAME_TYPES.WORD]: (questionWord: string) => (
    <>
      <Headline
        weight="semibold"
        className="word-question"
        style={{ fontSize: '20px', padding: '16px 0', textAlign: 'center' }}
      >
        {questionWord}
      </Headline>
    </>
  ),
  [GAME_TYPES.PICTURE]: (imagePath: string) => (
    <div className="picture-question">
      <div className="picture-wrapper">
        <img
          src={QuestionService.createFullPictureUrl(imagePath)}
          alt="Картинка с вопросом"
        />
      </div>
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
  const theme = useContext(ThemeContext)
  const answerButtonMode =
    theme === Themes.bright_light ? 'primary' : 'secondary'
  return (
    <>
      <Group>{renderQuestion(questionString)}</Group>
      <Div>
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
              mode={answerButtonMode}
              stretched
              className={classes}
              onClick={() => !selectedAnswer && onSelectAnswer(answer)}
            >
              {answer}
            </Button>
          )
        })}
      </Div>
    </>
  )
}

export default Question
