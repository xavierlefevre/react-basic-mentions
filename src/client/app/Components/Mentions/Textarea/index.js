import React, { Component, PropTypes } from "react"
import styles from "./index.css"

export default class Textarea extends Component {

  static propTypes = {
    placeholder: PropTypes.string,
    onKeyUp: PropTypes.func,
  }

  getEditableDiv() {
    return this.refs.div
  }

  render() {
    // TODO add a javascript faked placeholder to the textarea
    return (
      <div
        className={ styles.textarea }
        ref="div"
        id="div"
        onKeyUp={ this.props.onKeyUp }
        contentEditable
        onCopy={ (clipboard) => {
          // TODO think a proper logic for the copy/paste action
          // For now, copy is blocked from inside the div, to not have weird behaviors like on iOS
          clipboard.preventDefault()
        } }
      />
    )
  }

}
