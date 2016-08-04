import React, { Component, PropTypes } from "react"
import styles from "./index.css"
import Feedback from "./Feedback"

export default class ListItem extends Component {

  static propTypes = {
    title: PropTypes.string,
    onTouchTap: PropTypes.func.isRequired,
    setAnyItemSelected: PropTypes.func.isRequired,
    isAnyItemSelected: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props)

    this.state = {
      isSelected: false,
    }
  }

  prepare() {
    this._onSelect = this.props.onTouchTap && !this.props.isAnyItemSelected
      ? (e) => {
        e.preventDefault()
        this.props.setAnyItemSelected(true)
        setTimeout(this.props.onTouchTap, 150)
      }
      : () => {}

    this.touchStart = () => {
      this.onTouchTimeout = !this.props.isAnyItemSelected &&
        setTimeout(() => {
          this.setState({
            isSelected: true,
          })
        }, 100)
    }

    this.touchMove = () => {
      clearTimeout(this.onTouchTimeout)
      this.setState({
        isSelected: false,
      })
    }

    this.touchEnd = () => {
      setTimeout(() => {
        this.setState({
          isSelected: false,
        })
        this.props.setAnyItemSelected(false)
      }, 500)
      return true
    }
  }

  render() {
    this.prepare()

    return (
      <div
        onTouchTap={ this._onSelect }
        onTouchStart={ this.touchStart }
        onTouchMove={ this.touchMove }
        onTouchEnd={ this.touchEnd }
        className={ styles.container }
      >
        { this.state.isSelected &&  <Feedback /> }
        <div
          className={ styles.item }
        >
          { this.props.title }
        </div>
      </div>

    )
  }
}
