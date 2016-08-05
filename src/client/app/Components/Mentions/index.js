import React, { Component, PropTypes } from "react"
import styles from "./index.css"
import _ from "lodash"
import ListItem from "./ListItem"
import Textarea from "./Textarea"

// TODO Improve even more the regex rule, when typed in the middle of words for instance
const MENTION_REGEX = /(@([A-z]+)(\s[A-z]+|\s){0,2}|@)/gi

export default class Mentions extends Component {

  static propTypes = {
    list: PropTypes.array.isRequired,
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
    if (typeof window.getSelection != "undefined"
      && event.keyCode != 16
      && event.keyCode != 20
    ) {
      const selection = window.getSelection()
      const childNodes = this.textareaElement.childNodes

      if (childNodes) {
        // Checks if a Mention is being altered (except arrow keys), if yes deletes it
        if (selection.anchorNode.parentElement.localName == "span"
          && event.keyCode != 37
          && event.keyCode != 38
          && event.keyCode != 39
          && event.keyCode != 40) {
          this.removeMention(this.textareaElement, selection.anchorNode.parentElement)
        } else if (event.keyCode == 13) {
          this.state.showUserList && this.showUserList(false)
        } else {
          this.watchRegex(selection)
        }
      }
    }
  }

  // - - - -
  // Handle Mention Logic
  // - - - -

  watchRegex(selection) {
    const matchArray = []
    const text = selection.anchorNode.textContent
    let currentMatch
    let match

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

    if (currentMatch) {
      // Updates the current match in order to know what to replace it in the text later
      this.currentMatch = currentMatch
      // Removes the @ and potential end spaces
      const currentMatchText = currentMatch[1] && currentMatch[1].substring(1).trim()
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

    const insertedName = document.createElement("span")
    insertedName.innerHTML = userName
    insertedName.style.color = "#00A0EE"
    insertedName.style.fontFamily = "lato, sans-serif"
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
  // Handle Post Comment
  // - - - -

  onCommentPost() {
    const commenttext = this.generateFinalComment(this.refs.textarea.refs.div)
  }

  generateFinalComment(DOMParent) {
    let finalComment = ""
    const textareaNodes = DOMParent.childNodes
    for (let i = 0; i <	textareaNodes.length; i++) {
      if (textareaNodes[i].nodeName === "SPAN") {
        finalComment += `[u:${textareaNodes[i].id}]`
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

    if (newList) {
      return newList.map((item, index)=>(
        <ListItem
          key={ index }
          onClick={ () => this.selectUser(item) }
          title={ item.name }
        />
      ))
    }
  }

  render() {
    return (
      <div className={ styles.container }>
        <div className={ styles.inputArea } ref="inputArea">
          <Textarea
            placeholder={ "Enter a comment" }
            ref="textarea"
            onKeyUp={ (e) => this.onTextareaKeyUp(e) }
          />
        </div>
        <div className={ styles.listContainer }>
          { this.state.showUserList && this.renderUserList(this.currentMatch) }
        </div>
      </div>
    )
  }

}
