import { createContext } from 'react'
import { Themes } from '../constants'

export const ThemeContext = createContext<Themes>(Themes.bright_light)
