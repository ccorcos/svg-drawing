import Immutable from 'immutable'
import actionTypes from './actionTypes'
import { minDelta } from '../defs'
import { distance, pipe } from '../utils'

export const orientationInitialState = Immutable.Map({
  vec: [1, 0, 0], // representing [x,y,z] orientation
  speed: 1, // rotation speed
  prev: undefined, // previous point
})

// https://en.wikipedia.org/wiki/Rotation_matrix
const rotateX = (vector, angle) => {
  const [x, y, z] = vector
  return [
    x,
    Math.cos(angle) * y - Math.sin(angle) * z,
    Math.sin(angle) * y + Math.cos(angle) * z,
  ]
}

const rotateY = (vector, angle) => {
  const [x, y, z] = vector
  return [
    Math.cos(angle) * x + Math.sin(angle) * z,
    y,
    -1*Math.sin(angle) * x + Math.cos(angle) * z,
  ]
}

const rotateZ = (vector, angle) => {
  const [x, y, z] = vector
  return [
    Math.cos(angle) * x - Math.sin(angle) * y,
    Math.sin(angle) * x + Math.cos(angle) * y,
    z,
  ]
}

const rotateToPoint = point => state => {
  const [x0, y0] = state.get('prev')
  const [x1, y1] = point
  const dx = x1 - x0
  const dy = y1 - y0
  const vec = state.get('vec')
  const speed = state.get('speed')
  const result = rotateY(rotateX(vec, dx * speed / 10), dy * speed / 10)
  return state.set('vec', result)
}

const orientationReducer = (state=orientationInitialState, action) => {
  switch(action.type) {
    case actionTypes.dragStart: {
      return state.set('prev', action.point)
    }
    case actionTypes.dragMove: {
      return pipe([
        rotateToPoint(action.point),
        s => s.set('prev', action.point)
      ], state)
    }
    case actionTypes.dragEnd: {
      return pipe([
        rotateToPoint(action.point),
        s => s.set('prev', undefined)
      ], state)
    }
    default: {
      return state
    }
  }
}

export default orientationReducer
