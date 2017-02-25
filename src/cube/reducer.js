import Immutable from 'immutable'
import actionTypes from './actionTypes'
import { minDelta } from '../defs'
import { distance, pipe } from '../utils'
import { Vector3, Vector2, Matrix4 } from 'three'


const Matrix = (...args) => {
  const m = new Matrix4()
  m.set(...args)
  return m
}

const rotationX = angle => {
  const m = new Matrix4()
  m.makeRotationX(angle)
  return m
}

const rotationY = angle => {
  const m = new Matrix4()
  m.makeRotationY(angle)
  return m
}

const rotateX = (angle, m) => rotationX(angle).multiply(m)
const rotateY = (angle, m) => rotationY(angle).multiply(m)

export const orientationInitialState = Immutable.Map({
  orientation: Matrix(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ),
  speed: 1, // rotation speed
  prev: undefined, // previous point
  dragging: false,
})

const rotateToPoint = next => state => {
  const speed = state.get('speed')
  const prev = state.get('prev')
  const diff = next.clone().sub(prev)
  const orientation = state.get('orientation')
  // rotate 2D x-direction via y-axis
  // rotate 2D y-direction via x-axis
  const newOrientation = rotateX(
    speed * diff.y * -2,
    rotateY(speed * diff.x * 2, orientation)
  )
  return state.set('orientation', newOrientation).set('prev', next)
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
