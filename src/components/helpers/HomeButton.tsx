import React from 'react'
import Button, {
  ButtonProps,
} from '@vkontakte/vkui/dist/components/Button/Button'
import Icon24Home from '@vkontakte/icons/dist/24/home'

function HomeButton(props: ButtonProps): JSX.Element {
  return (
    <Button size="l" before={<Icon24Home />} {...props}>
      Домой
    </Button>
  )
}

export default HomeButton
