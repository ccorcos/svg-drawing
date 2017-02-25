import Immutable from 'immutable'
import actionTypes from './actionTypes'
import { minDelta } from '../defs'
import { distance, pipe } from '../utils'
import { Vector3, Vector2 } from 'three'

export const orientationInitialState = Immutable.Map({
  vec: new Vector3(1, 0, 0),
  speed: 1, // rotation speed
  prev: undefined, // previous point
  dragging: false,
})

const rotateToPoint = next => state => {
  const speed = state.get('speed')
  const prev = state.get('prev')
  const diff = next.clone().sub(prev)
  const vec = state.get('vec')
  // rotate 2D x-direction via y-axis
  // rotate 2D y-direction via x-axis
  console.log(diff.x, diff.y)
  const newVec = vec.clone()
    .applyAxisAngle(new Vector3(0, 1, 0), speed * diff.x * -2)
    .applyAxisAngle(new Vector3(1, 0, 0), speed * diff.y * -2)
  return state.set('vec', newVec).set('prev', next)
}

const setPoint = point => state => state.set('prev', point)
const startDragging = state => state.set('dragging', true)
const stopDragging = state => state.set('dragging', false)

const orientationReducer = (state=orientationInitialState, action) => {
  switch(action.type) {
    case actionTypes.dragStart: {
      return pipe([
        startDragging,
        setPoint(new Vector2(action.point.x, action.point.y))
      ], state)
    }
    case actionTypes.dragMove: {
      const point = new Vector2(action.point.x, action.point.y)
      return pipe([
        rotateToPoint(point),
        setPoint(point),
      ], state)
    }
    case actionTypes.dragEnd: {
      const point = new Vector2(action.point.x, action.point.y)
      return pipe([
        stopDragging,
        rotateToPoint(point),
        setPoint(undefined),
      ], state)
    }
    default: {
      return state
    }
  }
}

export default orientationReducer
