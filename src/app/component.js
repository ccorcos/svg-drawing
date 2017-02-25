import { viewBox, colorOptions, widthOptions } from '../defs'

const ColorPalette = (props) => {
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
        opacity: props.state.getIn(['style', 'stroke']) === color ? 1 : 0.3,
      }}
      key={color}
      onClick={() => props.onStyle({stroke: color})}
    />
  )
  return (
    <div
      style={{
        display: 'flex',
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
        opacity: props.state.getIn(['style', 'strokeWidth']) === width ? 1 : 0.3,
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
        alignItems: 'center',
      }}
    >
      <span>Stroke:</span>
      {widths}
    </div>
  )
}

const Undoable = props => {
  const canUndo = props.state.get('paths').size > 1
  const canRedo = props.state.get('paths').size > props.state.get('time') + 1
  return (
    <div style={{
      paddingTop: 5,
      paddingBottom: 5,
    }}>
      <button disabled={!canUndo} onClick={props.onUndo}>undo</button>
      <button disabled={!canRedo} onClick={props.onRedo}>redo</button>
    </div>
  )
}

const Replay = props => {
  const size = props.state.get('states').size - 1
  const button = props.state.get('pause') ? (
    <button onClick={props.onPlay}>
      play
    </button>
  ) : (
    <button onClick={props.onPause}>
      pause
    </button>
  )
  const range = props.state.get('pause') ? (
    <input
      type="range"
      min={0}
      max={size}
      value={props.state.get('replay')}
      onChange={e => props.onReplay(e.target.value)}
    />
  ) : (
    false
  )
  return (
    <div style={{
      paddingTop: 5,
      paddingBottom: 5,
    }}>
      {button}
      {range}
    </div>
  )
}

const makeLine = points => {
  return 'M' +points.map(point => `${point.get('x')} ${point.get('y')}`).join(' L ')
}

const Path = props => {
  const d = makeLine(props.path.get('points'))
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

  const paths = props.state.get('paths').slice(0, props.state.get('time') + 1).map((path, i) =>
    <Path path={path} key={i}/>
  ).toArray()

  let node = undefined
  return (
    <svg
      ref={n => node = n}
      viewBox={`0 0 ${viewBox} ${viewBox}`}
      style={{flex: 1, cursor: 'crosshair'}}
      onMouseDown={e => props.onStart(getPoint(e, node))}
      onTouchStart={e => props.onStart(getPoint(e, node))}
      onMouseMove={e => props.state.get('started') && props.onMove(getPoint(e, node))}
      onTouchMove={e => props.state.get('started') && props.onMove(getPoint(e, node))}
      onMouseUp={e => props.state.get('started') && props.onEnd(getPoint(e, node))}
      onTouchEnd={e => props.state.get('started') && props.onEnd(getPoint(e, node))}
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
      <Undoable {...props}/>
      <Replay {...props}/>
      <Drawing {...props}/>
    </div>
  )
}

const style = {
  height: '500px',
  width: '500px',
  margin: '0 auto',
}

export default props =>
  <div style={style}>
    <SvgDrawing {...props}/>
  </div>
