import React, { Component, PropTypes } from "react"
import styles from "./styles.js"

export default class Textarea extends Component {

  static defaultProps = {
    placeholder: "Enter a comment...",
  };

  static propTypes = {
    placeholder: PropTypes.string,
    placeholderStyle: PropTypes.object,
    textareaStyle: PropTypes.object,
    onKeyUp: PropTypes.func,
    onKeyDown: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      showPlaceholder: true,
    }
  }

  componentDidMount() {
    if (this.state.showPlaceholder && this.props.placeholder) {
      this.refs.div.innerText = this.props.placeholder
    }
  }

  getEditableDiv() {
    return this.refs.div
  }

  render() {
    const placeholderStyle = this.state.showPlaceholder
    && { ...styles.defaultPlaceholderStyle, ...this.props.placeholderStyle }

    return (
      <div
        ref="div"
        id="div"
        style={ {
          ...styles.defaultTextareaStyle,
          ...this.props.textareaStyle,
          ...placeholderStyle,
        } }
        onKeyUp={ this.props.onKeyUp }
        onKeyDown={ this.props.onKeyDown }
        onFocus={ (e) => {
          if (this.state.showPlaceholder) {
            this.setState({
              showPlaceholder: false,
            })
            this.refs.div.innerText = ""
          }
        } }
        onBlur={ (e) => {
          if (!this.refs.div.innerText) {
            this.setState({
              showPlaceholder: true,
            })
            this.refs.div.innerText = this.props.placeholder
          }
        } }
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
