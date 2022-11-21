import React from 'react';
import { Route, Routes } from 'react-router-dom'
import LogIn from './pages/LogIn'
import SignUp from './pages/SignUp'
import Workspace from './Layout/Workspace';

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<LogIn />} />
        <Route path='/login' element={<LogIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/workspace/*' element={<Workspace />} />
      </Routes>
    </div>
  );
}

export default App;
