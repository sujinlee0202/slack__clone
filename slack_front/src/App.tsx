import React from 'react';
import { Route, Routes } from 'react-router-dom'
import Channel from './pages/Channel';
import LogIn from './pages/LogIn'
import SignUp from './pages/SignUp'

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<LogIn />} />
        <Route path='/login' element={<LogIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/workspace/channel' element={<Channel />} />
      </Routes>
    </div>
  );
}

export default App;
