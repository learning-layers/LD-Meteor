import React, { Component, PropTypes } from 'react'
import styles from './MainContainer.styles'

class MainContainer extends Component {
  componentDidMount () {
  }
  render () {
    return (
      <div style={styles.container}>
        <div style={styles.innerContainer}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

MainContainer.contextTypes = {
  router: PropTypes.object.isRequired
}

MainContainer.propTypes = {
  children: PropTypes.object.isRequired
}

export default MainContainer
