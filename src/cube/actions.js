import actionTypes from './actionTypes'
import { time } from '../utils'

export default {
  onDragStart: time(point => ({type: actionTypes.dragStart, point})),
  onDragMove: time(point => ({type: actionTypes.dragMove, point})),
  onDragEnd: time(point => ({type: actionTypes.dragEnd, point})),
}
