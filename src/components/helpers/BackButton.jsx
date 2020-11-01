import React from 'react'
import { IOS, platform } from '@vkontakte/vkui/'
import Icon24Back from '@vkontakte/icons/dist/24/back'
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back'

function BackButton() {
  const osName = platform()
  if (osName === IOS) return <Icon28ChevronBack />
  return <Icon24Back />
}

export default BackButton
