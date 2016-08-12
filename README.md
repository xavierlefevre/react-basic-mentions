# [React Basic Mentions](https://github.com/xavierlefevre/react-basic-mentions)

React Basic Mentions is a first shot at a mention system : a user can mention someone in a comment (like Twitter or Facebook) with a "@".

The user will enter a comment in the textarea, and when needed mention someone with a "@". The list of potential users will appear below the textarea, and on select, the matching string will be replaced by the name of the user with a specific style. Any modification to the mentioned user will remove it.

**/!\  NOT YET AVAILABLE ON NPM  /!\**

### Getting started

Install _react-basic-mentions_ package with NPM:

```
npm install react-basic-mentions --save
```

Import the package in the react component where you need it:

```javascript
import { Mentions } from 'react-basic-mentions'
```

And then add it somewhere in your JSX:

```
<Mentions
  list={ [ { name: "Paul", id: 1 }, {  name: "Jenny", id: 2 } ] }
/>
```

### Props

```javascript
// The array list from which to mention, must include a "name" and an "id" property, the first for display, the second as the key for your API
list: PropTypes.array.isRequired,
// Setter building the final comment all along the typing of the comment, in order to retrieve it and send it to your API
// If the comment is : Hello Daniel, How are you?
// The parsedComment is : Hello [144342], how are you?
setParsedComment: PropTypes.func,
// The inline style of the mentionned name, by default the text is blue, and the background light-blue
mentionStyle: PropTypes.object,
// The inline style of the container around the list
listContainerStyle: PropTypes.object,
// The inline style of the textarea
textareaStyle: PropTypes.object,
// The inline style around each item of the list
itemContainerStyle: PropTypes.object,
// The inline style of the item itself
itemStyle: PropTypes.object,
```

### To notice

Before anything, this is my first package. I am doing my best to make it great. If you encounter either a bug, or a lacking feature, don't hesitate to raise an issue! It is always amazing to have feedbacks from other developers, and much needed, otherwise my package has no purpose.

Do not hesitate to go check the other react package "React Mentions", much more advanced. Simply that it was not exactly fitting my needs, hence I prefered to build another one.

What did I do differently?
- You can "only" mention with a "@" for the moment
- The list of users appear beneath the textarea and is not floating, it was necessary for making it work well on mobile
- I used a div contenteditable for the textarea

Check the "to improve" section below to understand what's remaining to do and not yet perfect

### To improve

- [X] - Retrieve the full comment from the parent component

#### Bugs

- [ ] - iOS: a weird behavior of copy/pasting can happen
- [ ] - Refine which key when hit can delete a mentionned user
- [ ] - The first time you hit "enter" at the end of the textarea, it won't yet break the line, the following "enter" will work
- [ ] - If the user selects half of a mention and a bit of other texts, then deletes, it won't make the mention disappear

#### Features

- [ ] - Allow for other "markers" and not only "@"
- [ ] - Offer the possibility to put a placeholder in the textarea
- [ ] - Option to filter the list through your own back-end calls
- [ ] - Thinks of a loader
- [ ] - Add a feedback on click or touch

#### Readme

- [ ] - Detail default style
- [ ] - Give examples
