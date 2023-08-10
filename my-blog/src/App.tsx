import React, {StrictMode} from 'react';
import './App.css';
import Header from "./components/Header";
import Main from "./components/Main";

function App() {
  return (
      <StrictMode>
          <div id="app">
              <Header></Header>
              <Main></Main>
          </div>
      </StrictMode>
  );
}

export default App;
