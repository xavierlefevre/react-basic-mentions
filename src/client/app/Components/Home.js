import React, { Component } from 'react';
import Mentions from './Mentions';

export default class Home extends Component {
  render() {
    return (
      <div>
        <Mentions />
        { "Hello World" }
      </div>
    );
  }
}
