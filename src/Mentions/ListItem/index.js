import React, { Component, PropTypes } from "react"
import styles from "./index.css"
import Feedback from "./Feedback"

export default class ListItem extends Component {

  static propTypes = {
    title: PropTypes.string,
    onClick: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div
        onClick={ this.props.onClick }
        className={ styles.container }
      >
        { false && <Feedback /> }
        <div
          className={ styles.item }
        >
          { this.props.title }
        </div>
      </div>

    )
  }
}
