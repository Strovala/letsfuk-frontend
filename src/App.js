import React, { Component } from 'react';
import Layout from './components/Layout/Layout';
import ChatList from './components/ChatList/ChatList';

class App extends Component {
  render() {
    return (
      <div>
        <Layout>
          <ChatList />
        </Layout>
      </div>
    );
  }
}

export default App;
