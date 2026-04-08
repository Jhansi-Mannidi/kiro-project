import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import PostsPage from './PostsPage';
import PostPage from './PostPage';
import CommentsPage from './CommentsPage';
import CreatePostForm from './CreatePostForm';
import EditPostForm from './EditPostForm';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={PostsPage} />
        <Route path="/posts" component={PostsPage} />
        <Route path="/post/:id" component={PostPage} />
        <Route path="/comments" component={CommentsPage} />
        <Route path="/create-post" component={CreatePostForm} />
        <Route path="/edit-post/:id" component={EditPostForm} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;