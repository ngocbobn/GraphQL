import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import SongList from './components/SongList';
import App from './components/App';
import CreateSong from './components/CreateSong';

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  dataIdFromObject: o => o.id
});

const Root = () => {
  return (
    <ApolloProvider client={client}>
      <Router history={hashHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={SongList}></IndexRoute>
          <Route path="song/create" component={CreateSong} />
        </Route>
      </Router>
    </ApolloProvider>
  )
};

ReactDOM.render(
  <Root />,
  document.querySelector('#root')
);
