import Immutable from 'immutable'
import actionTypes from './actionTypes'
import { minDelta } from './defs'
import { distance } from './utils'

export const initialState = Immutable.fromJS({
  time: 1,
  actions: [],
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

const incTime = state => state.update('time', time => time + 1)
const decTime = state => state.update('time', time => time - 1)

const newFuture = state => state.update('paths', paths =>
  paths.slice(0, state.get('time') + 1)
)

const setStyles = styles => state =>
  state.update('style', style =>
    style.merge(Immutable.fromJS(styles))
  )

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

const recordAction = action => state => state.update('actions', actions =>
  actions.push(action)
)

export default (state=initialState, action) => {
  switch(action.type) {
    case actionTypes.start: {
      return pipe([
        recordAction(action),
        newFuture,
        createPath(action.point, state.get('style')),
        startPath,
        incTime,
      ], state)
    }
    case actionTypes.move: {
      return pipe([
        recordAction(action),
        addPoint(action.point)
      ], state)
    }
    case actionTypes.end: {
      return pipe([
        recordAction(action),
        addPoint(action.point),
        endPath,
      ], state)
    }
    case actionTypes.style: {
      return pipe([
        recordAction(action),
        setStyles(action.style),
      ], state)
    }
    case actionTypes.undo: {
      return pipe([
        recordAction(action),
        decTime,
      ], state)
    }
    case actionTypes.redo: {
      return pipe([
        recordAction(action),
        incTime,
      ], state)
    }
    default: {
      return state
    }
  }
}
