import R from 'ramda'

const size = 200
const half = size / 2
const nhalf = -1 * half

const styles = {
  cube: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
  face: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'black',
    height: size,
    width: size,
    position: 'absolute',
  }
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

// CSS tranform rotation is in axis-angle notation.
// "axis-angle between two 3d vectors"
// http://www.euclideanspace.com/maths/algebra/vectors/angleBetween/

const dot = (v1, v2) =>
  R.zip(v1, v2)
  .map(([a, b]) => a * b)
  .reduce((a, b) => a + b, 0)


const Cube = props => {
  const vec = props.state.get('vec')
  const rotation = `rotate3d(1, 1, 1, 15deg)`
  return (
    <div style={styles.cube}>
      <div style={{
        ...styles.face,
        // center and z+
        transform: [
          center,
          rotation,
          front,
        ].join(' '),
      }}/>
      <div style={{
        ...styles.face,
        // center and z-
        transform: [
          center,
          rotation,
          back,
        ].join(' '),
      }}/>
      <div style={{
        ...styles.face,
        // center, spin y, and z+
        transform: [
          center,
          rotation,
          `rotate3d(0, 1, 0, 90deg)`,
          front,
        ].join(' '),
      }}/>
      <div style={{
        ...styles.face,
        // center, spin y, and z-
        transform: [
          center,
          rotation,
          `rotate3d(0, 1, 0, 90deg)`,
          back,
        ].join(' '),
      }}/>
      <div style={{
        ...styles.face,
        // center, spin x, and z+
        transform: [
          center,
          rotation,
          `rotate3d(1, 0, 0, 90deg)`,
          front,
        ].join(' '),
      }}/>
      <div style={{
        ...styles.face,
        // center, spin x, and z-
        transform: [
          center,
          rotation,
          `rotate3d(1, 0, 0, 90deg)`,
          back,
        ].join(' '),    }}/>
    </div>
  )
}


export default Cube