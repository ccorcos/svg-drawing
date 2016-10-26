import Immutable from 'immutable'
import actionTypes from './actionTypes'
import { minDelta } from './defs'
import { squared, sqrt, distance } from './utils'

export const initialState = Immutable.fromJS({
  started: false,
  style: {
    stroke: 'black',
    strokeWidth: 4,
  },
  paths: [{
    style: {
      stroke: 'blue',
      strokeWidth: 16,
    },
    points: [
      {x: 500, y: 500},
      {x: 600, y: 530},
      {x: 620, y: 410},
    ]
  }, {
    style: {
      stroke: 'red',
      strokeWidth: 2,
    },
    points: [
      {x: 0, y: 0},
      {x: 0, y: 1000},
      {x: 1000, y: 1000},
      {x: 1000, y: 0},
      {x: 0, y: 0},
    ],
  }]
})

const pipe = (fns, state) => state.withMutations(st =>
  fns.reduce((s, fn) => fn(s), st)
)

const createPath = (point, style) => state =>
  state.update('paths', paths =>
    paths.push(Immutable.fromJS({
      style,
      points: [point],
    }))
  )

const startPath = state => state.set('started', true)
const endPath = state => state.set('started', false)

const addPoint = point => state =>
  state.update('paths', paths =>
    paths.update(paths.size - 1, path =>
      path.update('points', points => {
        const lastPoint = points.last()
        const delta = distance(lastPoint.toJS(), point)
        if (delta < minDelta) {
          return points
        }
        return points.push(Immutable.fromJS(point))
      })
    )
  )

export default (state=initialState, action) => {
  switch(action.type) {
    case actionTypes.start: {
      return pipe([
        createPath(action.point, state.get('style')),
        startPath,
      ], state)
    }
    case actionTypes.move: {
      return pipe([
        addPoint(action.point)
      ], state)
    }
    case actionTypes.end: {
      return pipe([
        addPoint(action.point),
        endPath,
      ], state)
    }
    case actionTypes.style: {
      return state.update('style', style => {
        return style.merge(Immutable.fromJS(action.style))
      })
    }
    default: {
      return state
    }
  }
}
