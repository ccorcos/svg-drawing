import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from './actions'
import Cube from './component'

const mapStateToProps = state => ({state: state.get('cube')})
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Cube)
