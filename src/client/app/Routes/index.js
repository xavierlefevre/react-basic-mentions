import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Main from '../components';
import Home from '../components/Home';

export default (
  <Route path="/" component={Main}>
    <IndexRoute component={Home} />
  </Route>
);
