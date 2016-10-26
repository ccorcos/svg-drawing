import React from 'react'

const colorOptions = [
  'black',
  'white',
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
]

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

const widthOptions = [
  1,
  2,
  4,
  8,
  16,
  32,
  64,
]

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

const Path = props => {
  const d = 'M' + props.path.get('points').map(point => `${point.get('x')} ${point.get('y')}`).join(' L ')
  return (
    <path
      d={d}
      {...props.path.get('style').toJS()}
      fill="transparent"
      strokeLinecap="round"
    />
  )
}
//
// var parentOffset = $(this).parent().offset();
// //or $(this).offset(); if you really just want the current element's offset
// var relX = e.pageX - parentOffset.left;
// var relY = e.pageY - parentOffset.top;

const viewBox = 1000

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
