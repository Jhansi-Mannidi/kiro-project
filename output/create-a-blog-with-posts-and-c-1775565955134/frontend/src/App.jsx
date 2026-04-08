import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import PostsPage from './PostsPage';
import PostPage from './PostPage';
import CommentForm from './CommentForm';
import CommentsList from './CommentsList';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={PostsPage} />
        <Route path="/posts/:postId" component={PostPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;