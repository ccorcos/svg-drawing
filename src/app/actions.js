import actionTypes from './actionTypes'
import { time } from '../utils'

export default {
  onStart: time(point => ({type: actionTypes.start, point})),
  onMove: time(point => ({type: actionTypes.move, point})),
  onEnd: time(point => ({type: actionTypes.end, point})),
  onStyle: time(style => ({type: actionTypes.style, style})),
  onUndo: time(() => ({type: actionTypes.undo})),
  onRedo: time(() => ({type: actionTypes.redo})),
  onPause: () => ({type: actionTypes.pause}),
  onPlay: () => ({type: actionTypes.play}),
  onReplay: value => ({type: actionTypes.replay, value}),
}
