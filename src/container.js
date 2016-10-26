import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from './actions'
import SvgDrawing from './component'

const mapStateToProps = state => state.toObject()
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SvgDrawing)
