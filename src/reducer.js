import Immutable from 'immutable'
import actionTypes from './actionTypes'

export const initialState = Immutable.fromJS({
  started: false,
  style: {
    stroke: 'black',
    strokeWidth: '1'
  },
  paths: [{
    style: {
      stroke: 'blue',
      strokeWidth: '1'
    },
    points: [
      {x: 500, y: 500},
      {x: 600, y: 530},
      {x: 620, y: 410},
    ]
  }, {
    style: {
      stroke: 'red',
      strokeWidth: '1'
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


export default (state=initialState, action) => {
  switch(action.type) {
    case actionTypes.start: {
      return state.update('paths', paths => {
        return paths.push(Immutable.fromJS({
          style: state.get('style'),
          points: [action.point],
        }))
      }).update('started', () => true)
    }
    case actionTypes.move: {
      return state.update('paths', paths => {
        return paths.update(paths.size - 1, path => {
          return path.update('points', points => {
            return points.push(Immutable.fromJS(action.point))
          })
        })
      })
    }
    case actionTypes.end: {
      return state.update('paths', paths => {
        return paths.update(paths.size - 1, path => {
          return path.update('points', points => {
            return points.push(Immutable.fromJS(action.point))
          })
        })
      }).update('started', () => false)
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
