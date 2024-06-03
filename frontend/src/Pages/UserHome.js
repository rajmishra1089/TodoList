import React from 'react';
import Navbar from '../Components/Navbar';
import { useUser } from "../user-context";
import { useNavigate } from 'react-router-dom';
import Todo from "../Components/Todo";
export default function UserHome() {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <div>
      {user ? (
        <div>
          <Navbar />
          <Todo/>
        </div>
      ) : (
        navigate("/") // Redirect to the login page if user is not logged in
      )}
    </div>
  );
}
