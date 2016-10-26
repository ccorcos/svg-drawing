import actionTypes from './actionTypes'

export default {
  onStart: point => ({type: actionTypes.start, point: {...point, timestamp: Date.now()}}),
  onMove: point => ({type: actionTypes.move, point: {...point, timestamp: Date.now()}}),
  onEnd: point => ({type: actionTypes.end, point: {...point, timestamp: Date.now()}}),
  onStyle: style => ({type: actionTypes.style, style}),
  onUndo: () => ({type: actionTypes.undo}),
  onRedo: () => ({type: actionTypes.redo}),
}
