import React from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import Home from "./Pages/Home";
import UserHome from './Pages/UserHome';
export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/userhome" element={<UserHome/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
