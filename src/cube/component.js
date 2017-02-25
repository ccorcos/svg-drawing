import { css } from 'glamor'
import R from 'ramda'
import { Vector3 } from 'three'

const size = 200
const half = size / 2
const nhalf = -1 * half

const styles = {
  cube: css({
    position: 'absolute',
    top: '50%',
    left: '50%',
    perspective: '500px', // TODO another parameter
    transformStyle: 'preserve-3d',
  }),
  face: css({
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'black',
    height: size,
    width: size,
    position: 'absolute',
  }),
}


// z----> x
// |
// |
// y
//
// [x, y, z]
const vector = [1, 0, 0]

// get out a piece of paper and draw the transformations

const center = `translate3d(${nhalf}px, ${nhalf}px, 0)`
const front = `translate3d(0px, 0px, ${half}px)`
const back = `translate3d(0px, 0px, ${nhalf}px)`


// http://www.euclideanspace.com/maths/algebra/vectors/angleBetween/
// angle = acos(v1•v2)
// axis = norm(v1 x v2)

const getPoint = (e, n) => {
  const box = n.getBoundingClientRect()
  return {
    x: (e.pageX - box.left) / size,
    y: (e.pageY - box.top) / size,
  }
}

const Cube = props => {
  const vec = props.state.get('vec')
  const unit = new Vector3(1, 0, 0)
  const angle = Math.acos(vec.dot(unit))
  const axis = vec.clone().cross(unit).normalize()
  const rotation = `rotate3d(${axis.x}, ${axis.y}, ${axis.z}, ${angle}rad)`
  let node
  return (
    <div
      className={styles.cube}
      ref={n => node = n}
      onMouseDown={e => props.onDragStart(getPoint(e, node))}
      onTouchStart={e => props.onDragStart(getPoint(e, node))}
      onMouseMove={e => props.state.get('dragging') && props.onDragMove(getPoint(e, node))}
      onTouchMove={e => props.state.get('dragging') && props.onDragMove(getPoint(e, node))}
      onMouseUp={e => props.state.get('dragging') && props.onDragEnd(getPoint(e, node))}
      onTouchEnd={e => props.state.get('dragging') && props.onDragEnd(getPoint(e, node))}
    >
      <div
        id="front"
        style={{
          transform: [
            center,
            rotation,
            front,
          ].join(' '),
          backgroundColor: '#ffffff',
        }}
        className={styles.face}
      />
      <div
        id="back"
        className={styles.face}
        style={{
          transform: [
            center,
            rotation,
            back,
          ].join(' '),
          backgroundColor: '#000000',
        }}
      />
      <div
        id="left"
        className={styles.face}
        style={{
          transform: [
            center,
            rotation,
            `rotate3d(0, 1, 0, 90deg)`,
            front,
          ].join(' '),
          backgroundColor: '#fc9d9d',
        }}
      />
      <div
        id="right"
        className={styles.face}
        style={{
          transform: [
            center,
            rotation,
            `rotate3d(0, 1, 0, 90deg)`,
            back,
          ].join(' '),
          backgroundColor: '#ef9efc',
        }}
      />
      <div
        id="bottom"
        className={styles.face}
        style={{
          transform: [
            center,
            rotation,
            `rotate3d(1, 0, 0, 90deg)`,
            front,
          ].join(' '),
          backgroundColor: '#f8fc9e',
        }}
      />
      <div
        id="top"
        className={styles.face}
        style={{
          transform: [
            center,
            rotation,
            `rotate3d(1, 0, 0, 90deg)`,
            back,
          ].join(' '),
          backgroundColor: '#b6fc9e',
        }}
      />
    </div>
  )
}


export default Cube