import React from 'react';
import {render} from 'react-dom';
import CommentInput from './CommentInput'

class App extends React.Component {
  render () {
    <CommentInput />
  }
}

render(<App/>, document.getElementById('app'));
