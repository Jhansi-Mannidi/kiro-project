import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './Home';
import Posts from './Posts';
import Post from './Post';
import Comments from './Comments';
import CreatePost from './CreatePost';
import EditPost from './EditPost';
import CreateComment from './CreateComment';
import EditComment from './EditComment';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/posts" exact component={Posts} />
        <Route path="/post/:id" exact component={Post} />
        <Route path="/comments" exact component={Comments} />
        <Route path="/create-post" exact component={CreatePost} />
        <Route path="/edit-post/:id" exact component={EditPost} />
        <Route path="/create-comment" exact component={CreateComment} />
        <Route path="/edit-comment/:id" exact component={EditComment} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;