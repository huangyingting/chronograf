import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import Annotation from 'src/shared/components/Annotation'
import NewAnnotation from 'src/shared/components/NewAnnotation'
import * as schema from 'src/shared/schemas'

import {ADDING, TEMP_ANNOTATION} from 'src/shared/annotations/helpers'

import {
  updateAnnotation,
  addingAnnotationSuccess,
  dismissAddingAnnotation,
  mouseEnterTempAnnotation,
  mouseLeaveTempAnnotation,
} from 'src/shared/actions/annotations'
import {visibleAnnotations} from 'src/shared/annotations/helpers'

class Annotations extends Component {
  state = {
    lastUpdated: null,
  }

  componentDidMount() {
    this.props.dygraph.updateOptions({
      drawCallback: this.redraw,
    })
  }

  redraw = () => {
    // force a redraw of annotations
    this.setState({lastUpdated: Date.now()})
  }

  render() {
    const {lastUpdated} = this.state
    const {
      mode,
      dygraph,
      isTempHovering,
      handleUpdateAnnotation,
      handleDismissAddingAnnotation,
      handleAddingAnnotationSuccess,
      handleMouseEnterTempAnnotation,
      handleMouseLeaveTempAnnotation,
      staticLegendHeight,
    } = this.props

    return (
      <div className="annotations-container">
        {mode === ADDING &&
          this.tempAnnotation && (
            <NewAnnotation
              dygraph={dygraph}
              isTempHovering={isTempHovering}
              tempAnnotation={this.tempAnnotation}
              staticLegendHeight={staticLegendHeight}
              onUpdateAnnotation={handleUpdateAnnotation}
              onDismissAddingAnnotation={handleDismissAddingAnnotation}
              onAddingAnnotationSuccess={handleAddingAnnotationSuccess}
              onMouseEnterTempAnnotation={handleMouseEnterTempAnnotation}
              onMouseLeaveTempAnnotation={handleMouseLeaveTempAnnotation}
            />
          )}
        {this.annotations.map(a => (
          <Annotation
            key={a.id}
            mode={mode}
            annotation={a}
            dygraph={dygraph}
            lastUpdated={lastUpdated}
            staticLegendHeight={staticLegendHeight}
          />
        ))}
      </div>
    )
  }

  get annotations() {
    return visibleAnnotations(
      this.props.dygraph,
      this.props.annotations
    ).filter(a => a.id !== TEMP_ANNOTATION.id)
  }

  get tempAnnotation() {
    return this.props.annotations.find(a => a.id === TEMP_ANNOTATION.id)
  }
}

const {arrayOf, bool, func, number, shape, string} = PropTypes

Annotations.propTypes = {
  annotations: arrayOf(schema.annotation),
  dygraph: shape({}),
  mode: string,
  isTempHovering: bool,
  handleUpdateAnnotation: func.isRequired,
  handleDismissAddingAnnotation: func.isRequired,
  handleAddingAnnotationSuccess: func.isRequired,
  handleMouseEnterTempAnnotation: func.isRequired,
  handleMouseLeaveTempAnnotation: func.isRequired,
  staticLegendHeight: number,
}

const mapStateToProps = ({
  annotations: {annotations, mode, isTempHovering},
}) => ({
  annotations,
  mode: mode || 'NORMAL',
  isTempHovering,
})

const mapDispatchToProps = dispatch => ({
  handleAddingAnnotationSuccess: bindActionCreators(
    addingAnnotationSuccess,
    dispatch
  ),
  handleDismissAddingAnnotation: bindActionCreators(
    dismissAddingAnnotation,
    dispatch
  ),
  handleMouseEnterTempAnnotation: bindActionCreators(
    mouseEnterTempAnnotation,
    dispatch
  ),
  handleMouseLeaveTempAnnotation: bindActionCreators(
    mouseLeaveTempAnnotation,
    dispatch
  ),
  handleUpdateAnnotation: bindActionCreators(updateAnnotation, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Annotations)
