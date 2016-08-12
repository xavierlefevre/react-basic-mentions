import React, { Component } from 'react';
import Mentions from '../../../lib/Mentions';

import styles from "./Home.css";
import list from "../FakeData";

export default class Home extends Component {

  setFinalComment(comment) {
    this.comment = comment
  }

  showComment() {
    console.log(this.comment)
  }

  render() {
    return (
      <div className={ styles.container }>
        <div
          className={ styles.sendButton }
          onClick={ () => this.showComment() }
        >
          Send
        </div>
        <Mentions
          list={ list }
          setParsedComment={ (comment) => this.setFinalComment(comment) }
        />
      </div>
    );
  }
}
