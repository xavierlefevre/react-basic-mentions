import React, { Component, PropTypes } from "react"
import styles from "./styles.js"

export default class Textarea extends Component {

  static propTypes = {
    placeholder: PropTypes.string,
    textareaStyle: PropTypes.object,
    onKeyUp: PropTypes.func,
    onKeyDown: PropTypes.func,
  }

  getEditableDiv() {
    return this.refs.div
  }

  render() {
    // TODO add a javascript faked placeholder to the textarea
    return (
      <div
        ref="div"
        id="div"
        style={ { ...styles.defaultTextareaStyle, ...this.props.textareaStyle } }
        onKeyUp={ this.props.onKeyUp }
        onKeyDown={ this.props.onKeyDown }
        contentEditable
        onCopy={ (clipboard) => {
          // TODO think a proper logic for the copy/paste action
          // Copy, and cut, can be blocked from inside the div, to not have weird behaviors like on iOS
          // clipboard.preventDefault()
        } }
      />
    )
  }

}
