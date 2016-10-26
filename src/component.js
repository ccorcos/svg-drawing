import React from 'react'
import { viewBox, colorOptions, widthOptions } from './defs'
import { minus, add, normalize, multiply } from './utils'

const ColorPalette = props => {
  const colors = colorOptions.map(color =>
    <div
      style={{
        backgroundColor: color,
        height: 24,
        width: 24,
        borderRadius: 24,
        margin: 5,
        borderWidth: 1,
        borderColor: 'black',
        borderStyle: 'solid',
        opacity: props.style.get('stroke') === color ? 1 : 0.3,
      }}
      key={color}
      onClick={() => props.onStyle({stroke: color})}
    />
  )
  return (
    <div
      style={{
        display: 'flex',
        margin: -5,
        paddingTop: 5,
        paddingBottom: 5,
        alignItems: 'center',
      }}
    >
      <span>Colors:</span>
      {colors}
    </div>
  )
}

const WidthPalette = props => {
  const widths = widthOptions.map(width =>
    <div
      style={{
        height: 24,
        width: 24,
        borderRadius: 24,
        margin: 5,
        borderWidth: 1,
        borderColor: 'black',
        borderStyle: 'solid',
        opacity: props.style.get('strokeWidth') === width ? 1 : 0.3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      key={width}
      onClick={() => props.onStyle({strokeWidth: width})}
    >
      {width}
    </div>
  )
  return (
    <div
      style={{
        display: 'flex',
        margin: -5,
        paddingTop: 5,
        paddingBottom: 5,
        alignItems: 'center',
      }}
    >
      <span>Stroke:</span>
      {widths}
    </div>
  )
}

// stroke width
// undo / redo

const makeLine = points => {
  return 'M' +points.map(point => `${point.get('x')} ${point.get('y')}`).join(' L ')
}

// const makeCurvedSegment = (left, center, right) => {
//   // r - l, make it a unit vector
//   const delta = multiply(normalize(minus(right, left)), 50)
//   // C x1 y1, x2 y2, x y
//   const start = minus(center, delta)
//   const end = add(center, delta)
//   return `C ${start.x} ${start.y}, ${end.x} ${end.y}, ${center.x} ${center.y}`
// }
//
// const makeCurve = points => {
//   const middle = points.rest().butLast().zipWith(
//     (center, left) => ({center: center.toJS(), left: left.toJS()}),
//     points.butLast().butLast()
//   ).zipWith(
//     (acc, right) => ({...acc, right: right.toJS()}),
//     points.rest().rest()
//   ).map(
//     ({left, center, right}) => makeCurvedSegment(left, center, right)
//   ).join(' ')
//   const first = points.first().toJS()
//   const last = points.last().toJS()
//   return [
//     `M ${first.x} ${first.y}`,
//     middle,
//     `L ${last.x} ${last.y}`,
//   ].join(' ')
// }

const makeCurve = points => {
  // S x2 y2, x y
  let L = ','
  const first = points.first().toJS()
  const last = points.last().toJS()
  console.log(points.map(point => {
    L = L === 'S' ? ',' : 'S'
    return `${L} ${point.get('x')} ${point.get('y')}`
  }).join(' '))
  return [
    `M ${first.x} ${first.y}`,
    points.map(point => {
      L = L === 'S' ? ',' : 'S'
      return `${L} ${point.get('x')} ${point.get('y')}`
    }).join(' '),
    `${L === 'S' ? 'L' : ','} ${last.x} ${last.y}`,
  ].join(' ')
}


const Path = props => {
  const d = makeCurve(props.path.get('points'))
  return (
    <path
      d={d}
      {...props.path.get('style').toJS()}
      fill="transparent"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  )
}

const getPoint = (e, n) => {
  const box = n.getBoundingClientRect()
  return {
    x: (e.pageX - box.left) / box.width * viewBox,
    y: (e.pageY - box.top) / box.height * viewBox,
  }
}

const Drawing = props => {

  const paths = props.paths.map((path, i) =>
    <Path path={path} key={i}/>
  ).toArray()

  let node = undefined
  return (
    <svg
      ref={n => node = n}
      viewBox={`0 0 ${viewBox} ${viewBox}`}
      style={{flex: 1}}
      onMouseDown={e => props.onStart(getPoint(e, node))}
      onTouchStart={e => props.onStart(getPoint(e, node))}
      onMouseMove={e => props.started && props.onMove(getPoint(e, node))}
      onTouchMove={e => props.started && props.onMove(getPoint(e, node))}
      onMouseUp={e => props.started && props.onEnd(getPoint(e, node))}
      onTouchEnd={e => props.started && props.onEnd(getPoint(e, node))}
    >
      {paths}
    </svg>
  )

}

const SvgDrawing = props => {
  return (
    <div>
      <ColorPalette {...props}/>
      <WidthPalette {...props}/>
      <Drawing {...props}/>
    </div>
  )
}

export default SvgDrawing
