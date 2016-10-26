import actionTypes from './actionTypes'

export default {
  onStart: point => ({type: actionTypes.start, point}),
  onMove: point => ({type: actionTypes.move, point}),
  onEnd: point => ({type: actionTypes.end, point}),
  onStyle: style => ({type: actionTypes.style, style}),
}
