import React, { Component, PropTypes } from "react"
import styles from "./styles.js"
import _ from "lodash"
import ListItem from "./ListItem"
import Textarea from "./Textarea"

// TODO Improve even more the regex rule, when typed in the middle of words for instance
const MENTION_REGEX = /(@([A-z]+)(\s[A-z]+|\s){0,2}|@)/gi

export default class Mentions extends Component {

  static defaultProps = {
    unactiveListMessage: "You can mention a user with @",
    emptyListMessage: "No match",
  }

  static propTypes = {
    list: PropTypes.array.isRequired,
    setParsedComment: PropTypes.func,
    unactiveListMessage: PropTypes.string,
    emptyListMessage: PropTypes.string,
    placeholder: PropTypes.string,
    // Elements CSS styles
    textareaStyle: PropTypes.object,
    placeholderStyle: PropTypes.object,
    mentionStyle: PropTypes.object,
    listContainerStyle: PropTypes.object,
    emptyMessageStyle: PropTypes.object,
    itemContainerStyle: PropTypes.object,
    itemStyle: PropTypes.object,
  };

  constructor(props) {
    super(props)
    this.state = {
      showUserList: false,
    }
    this.editedNode = null
    this.matchArray = []
    this.currentMatch = null
  }

  componentDidMount() {
    this.textareaElement = this.refs.textarea.getEditableDiv()
  }

  onTextareaKeyUp(event) {
    const SHIFT_KEY = 16
    const CAPS_KEY = 20

    if (typeof window.getSelection != "undefined"
      && event.keyCode != SHIFT_KEY
      && event.keyCode != CAPS_KEY
    ) {
      const selection = window.getSelection()
      const childNodes = this.textareaElement.childNodes

      if (childNodes) {
        this.watchRegex(selection)
        this.setParsedComment()
      }
    }
  }

  // - - - -
  // Prevents Wrong Enter Event
  // - - - -

  onTextareaKeyDown(event) {
    const ENTER_KEY = 13
    const SHIFT_KEY = 16
    const CAPS_KEY = 20
    const LEFT_ARROW_KEY = 37
    const UP_ARROW_KEY = 38
    const RIGHT_ARROW_KEY = 39
    const DOWN_ARROW_KEY = 40
    const CMD_KEY = 91

    if (typeof window.getSelection != "undefined"
      && event.keyCode != SHIFT_KEY
      && event.keyCode != CAPS_KEY
    ) {
      const selection = window.getSelection()
      // Checks if a Mention is being altered (except arrow keys), if yes deletes it
      // TODO find a better way to auto-delete spans, instead of listing all keys
      if (selection.anchorNode.parentElement.localName == "span"
        && event.keyCode != LEFT_ARROW_KEY
        && event.keyCode != UP_ARROW_KEY
        && event.keyCode != RIGHT_ARROW_KEY
        && event.keyCode != DOWN_ARROW_KEY
        && event.keyCode != CMD_KEY) {
        this.removeMention(this.textareaElement, selection.anchorNode.parentElement)
      }
      if (event.keyCode == ENTER_KEY) {
        // TODO The first "enter" at the end of the comment won't return to the line, but then it is fine
        // document.execCommand('insertHTML', false, '<br><br>')
        event.preventDefault()
        this.enterAction()
        this.state.showUserList && this.showUserList(false)
      }
    }
  }

  enterAction() {
    let selection = window.getSelection()
    let range = selection.getRangeAt(0)
    let newline = document.createElement("br")

    range.deleteContents()
    range.insertNode(newline)
    range.setStartAfter(newline)
    range.setEndAfter(newline)
    range.collapse(false)
    selection.removeAllRanges()
    selection.addRange(range)
  }

  // - - - -
  // Handle Mention Logic
  // - - - -

  watchRegex(selection) {
    const matchArray = []
    const text = selection.anchorNode.textContent
    let currentMatch
    let match

    // When typing fast, two keydown can happen before the two keyup
    // Creating an issue with the logic to find the proper match
    // To prevent that, if the text did not change between those two events,
    // there is no need to continue
    if (this.text && (this.text === text)) return

    while ((match = MENTION_REGEX.exec(text)) != null) {
      matchArray.push(match)
    }

    // If user switches from one node to another, he needs to type once more to be able to mention
    // TODO improve this behavior, and allow the @, to be done directly when switching nodes with several matches
    if (selection.anchorNode.isSameNode(this.editedNode)) {
      matchArray && matchArray.map((match, i) => {
        if (!this.matchArray || !_.isEqual(match, this.matchArray[i])) {
          currentMatch = match
          i = matchArray.length
        }
      })
    } else if (matchArray.length === 1) {
      currentMatch = matchArray[0]
    }

    // Updates the edited node, to know which node needs to receive a mention
    this.editedNode = selection.anchorNode
    // Updates the match array for the future comparison
    this.matchArray = matchArray
    // Updates the current text
    this.text = text

    if (currentMatch) {
      // Updates the current match in order to replace the appropriate element in the textarea later
      this.currentMatch = currentMatch
      this.debouncedFetchUsers()
    } else {
      this.cancelFetch()
    }
  }

  debouncedFetchUsers = _.debounce(() => this.setState({ showUserList: true }), 400);

  cancelFetch() {
    this.debouncedFetchUsers && this.debouncedFetchUsers.cancel()
    this.showUserList && this.showUserList(false)
  }

  showUserList(isShown) {
    this.setState({ showUserList: isShown })
  }

  removeMention(parentElement, elementToRemove) {
    // TODO Make sure than when someone selects half a text node half a span, and deletes, it deletes the whole mention
    if (!elementToRemove.nextSibling) {
      const extraText = document.createTextNode("\u00A0")
      this.textareaElement.insertBefore(extraText, elementToRemove.nextSibling)
    }
    this.placeCursor(elementToRemove.nextSibling, 0)
    parentElement.removeChild(elementToRemove)
  }

  // - - - -
  // Handle User Selection
  // - - - -

  selectUser(user) {
    const { userID, userName } = this.getUserDetails(user)
    this.insertMentionInText(userID, userName)
    this.setParsedComment()
    this.showUserList(false)
  }

  getUserDetails(user) {
    const userID = user.id
    const userName = user.name
    return { userID, userName }
  }

  insertMentionInText(userID, userName) {
    const editedNodeText = this.editedNode.textContent
    const matchIndex = this.currentMatch.index
    const matchedString = this.currentMatch[1].substring(1).trim()

    const begText = document.createTextNode(
      editedNodeText.substr(0, matchIndex) || "\u00A0"
    )

    const mentionStyle = { ...styles.defaultMentionStyle, ...this.props.mentionStyle }
    const insertedName = document.createElement("span")
    insertedName.innerHTML = userName
    insertedName.style.color = mentionStyle.color
    insertedName.style.fontFamily = mentionStyle.fontFamily
    insertedName.style.background = mentionStyle.background
    insertedName.style.borderRadius = mentionStyle.borderRadius
    insertedName.style.padding = mentionStyle.padding
    insertedName.id = userID

    const endTextStartingPoint = matchedString ? matchedString.length + matchIndex + 1 : matchIndex + 1
    const endText = document.createTextNode(
      editedNodeText.substr(endTextStartingPoint) || "\u00A0"
    )

    this.textareaElement.insertBefore(begText, this.editedNode.nextSibling)
    this.textareaElement.insertBefore(insertedName, this.editedNode.nextSibling.nextSibling)
    this.textareaElement.insertBefore(endText, this.editedNode.nextSibling.nextSibling.nextSibling)
    this.placeCursor(this.editedNode.nextSibling.nextSibling.nextSibling, 1)
    this.textareaElement.removeChild(this.editedNode)
  }

  placeCursor(element, offset = 0) {
    if (typeof window.getSelection != "undefined") {
      const selection = window.getSelection()
      const range = selection.getRangeAt(0)
      range.setStart(element, offset)
      range.collapse(true)
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }

  // - - - -
  // Parses Final Comment
  // - - - -

  setParsedComment() {
    const commenttext = this.generateFinalComment(this.refs.textarea.refs.div)
    this.props.setParsedComment(commenttext)
  }

  generateFinalComment(DOMParent) {
    let finalComment = ""
    const textareaNodes = DOMParent.childNodes
    for (let i = 0; i <	textareaNodes.length; i++) {
      if (textareaNodes[i].nodeName === "SPAN") {
        finalComment += `[${textareaNodes[i].id}]`
      } else if (textareaNodes[i].nodeName === "BR" && i !== (textareaNodes.length-1)) {
        finalComment += "\n"
      } else {
        finalComment += textareaNodes[i].textContent
      }
    }
    return finalComment
  }

  // - - - -
  // Render View
  // - - - -

  renderEmptyMessage(message) {
    return (
      <div style={ { ...styles.emptyMessageStyle, ...this.props.emptyMessageStyle } }>
        { message }
      </div>
    )
  }

  renderUserList(currentMatch) {
    const userList = this.props.list
    let items
    let newList

    if (currentMatch[1]) {
      newList = userList.filter((element) => {
        const match = element.name.toLowerCase().match(currentMatch[1].substring(1).trim().toLowerCase())
        return match
      })
    } else {
      newList = userList
    }

    if (newList && newList.length) {
      return newList.map((item, index)=>(
        <ListItem
          key={ index }
          onClick={ () => this.selectUser(item) }
          title={ item.name }
          itemContainerStyle={ this.props.itemContainerStyle }
          itemStyle={ this.props.itemStyle }
        />
      ))
    } else {
      return this.renderEmptyMessage(this.props.emptyListMessage)
    }
  }

  render() {
    return (
      <div style={ styles.containerStyle }>
        <Textarea
          placeholder={ this.props.placeholder }
          placeholderStyle={ this.props.placeholderStyle }
          ref="textarea"
          textareaStyle={ this.props.textareaStyle }
          onKeyUp={ (e) => this.onTextareaKeyUp(e) }
          onKeyDown={ (e) => this.onTextareaKeyDown(e) }
        />
        <div style={ { ...styles.defaultListContainerStyle, ...this.props.listContainerStyle } }>
          { !this.state.showUserList && this.renderEmptyMessage(this.props.unactiveListMessage) }
          { this.state.showUserList && this.renderUserList(this.currentMatch) }
        </div>
      </div>
    )
  }

}
