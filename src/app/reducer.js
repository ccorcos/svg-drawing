import Immutable from 'immutable'
import actionTypes from './actionTypes'
import { minDelta } from '../defs'
import { distance, pipe } from '../utils'
import { Matrix4, Vector3 } from 'three'

export const drawingInitialState = Immutable.fromJS({
  time: 1,
  started: false,
  style: {
    stroke: 'black',
    strokeWidth: 4,
  },
  paths: [
    // {
    //   style: {
    //     stroke: 'blue',
    //     strokeWidth: 16,
    //   },
    //   points: [
    //     {x: 500, y: 500},
    //     {x: 600, y: 530},
    //     {x: 620, y: 410},
    //   ]
    // }, {
    //   style: {
    //     stroke: 'red',
    //     strokeWidth: 2,
    //   },
    //   points: [
    //     {x: 0, y: 0},
    //     {x: 0, y: 1000},
    //     {x: 1000, y: 1000},
    //     {x: 1000, y: 0},
    //     {x: 0, y: 0},
    //   ],
    // }
  ],
  orientation: (new Matrix4()).makeRotationAxis(
    (new Vector3(1, 1, 1)).normalize(),
    0.8
  )
})

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


const drawingReducer = (state=drawingInitialState, action) => {
  switch(action.type) {
    case actionTypes.start: {
      return pipe([
        newFuture,
        createPath(action.point, state.get('style')),
        startPath,
        incTime,
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
      return pipe([
        setStyles(action.style),
      ], state)
    }
    case actionTypes.undo: {
      return pipe([
        decTime,
      ], state)
    }
    case actionTypes.redo: {
      return pipe([
        incTime,
      ], state)
    }
    default: {
      return state
    }
  }
}

const pause = state => state.set('pause', true)
const play = state => state.set('pause', false)
const setReplay = time => state => state.set('replay', time)
const computeReplay = state => state.set(
  'states',
  state.get('actions').reduce(
    (states, action) => {
      return states.push(drawingReducer(states.last(), action))
    },
    Immutable.fromJS([drawingInitialState])
  )
)
const setReplayDrawingState = state => state.merge(state.getIn(['states', state.get('replay')]))

const recordAction = action => state => state.update('actions', actions =>
  actions.push(action)
)

const replayInitialState = drawingInitialState.merge(Immutable.fromJS({
  pause: false,
  replay: 0,
  actions: [],
  states: [],
}))

const replayReducer = (state=replayInitialState, action) => {
  switch(action.type) {
    case actionTypes.start:
    case actionTypes.move:
    case actionTypes.end:
    case actionTypes.style:
    case actionTypes.undo:
    case actionTypes.redo: {
      if (state.get('pause')) {
        return state
      }
      return drawingReducer(recordAction(action)(state), action)
    }
    case actionTypes.pause: {
      return pipe([
        pause,
        computeReplay,
        setReplayDrawingState,
      ], state)
    }
    case actionTypes.play: {
      return pipe([
        play,
      ], state)
    }
    case actionTypes.replay: {
      return pipe([
        setReplay(action.value),
        setReplayDrawingState,
      ], state)
    }
    default: {
      return state
    }
  }
}

export default replayReducer
