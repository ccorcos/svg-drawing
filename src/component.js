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
        borderRadius: 12,
        borderWidth: 3,
        borderColor: 'white',
        borderStyle: props.getIn(['style', 'stroke']) === color ? 'solid' : undefined,
      }}
      key={color}
      onClick={() => props.onStyle({stroke: color})}
    />
  )
  return (
    <div
      style={{}}
    >
      {colors}
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
  const body = document.body
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
  return <Drawing {...props}/>
}

export default SvgDrawing
