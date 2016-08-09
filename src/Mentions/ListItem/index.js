import React, { Component, PropTypes } from "react"
import styles from "./styles.js"
import Feedback from "./Feedback"

export default class ListItem extends Component {

  static propTypes = {
    title: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    itemContainerStyle: PropTypes.object,
    itemStyle: PropTypes.object,
  };

  render() {
    return (
      <div
        onClick={ this.props.onClick }
        style={ { ...styles.defaultItemContainerStyle, ...this.props.itemContainerStyle } }
      >
        { false && <Feedback /> }
        <div
          style={ { ...styles.defaultItemStyle, ...this.props.itemStyle } }
        >
          { this.props.title }
        </div>
      </div>

    )
  }
}
