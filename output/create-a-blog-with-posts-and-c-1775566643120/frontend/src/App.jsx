import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import PostsPage from './PostsPage';
import PostPage from './PostPage';
import CommentsPage from './CommentsPage';
import NewPostForm from './NewPostForm';
import EditPostForm from './EditPostForm';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={PostsPage} />
        <Route path="/posts" component={PostsPage} />
        <Route path="/post/:id" component={PostPage} />
        <Route path="/comments" component={CommentsPage} />
        <Route path="/new-post" component={NewPostForm} />
        <Route path="/edit-post/:id" component={EditPostForm} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;