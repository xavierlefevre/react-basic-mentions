import React, { Component } from 'react';
import Mentions from '../../../src/Mentions';

import styles from "./Home.css";
import list from "../FakeData";

export default class Home extends Component {
  render() {
    return (
      <div className={ styles.container }>
        <Mentions
          list={ list }
          mentionStyle={ { color: "black", background: "grey" } }
        />
      </div>
    );
  }
}
