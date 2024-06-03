import React, { useState, useEffect } from 'react';
import { useUser } from "../user-context";
import axios from "axios";
import './Todo.css'; // Import CSS file for styling
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import edit and delete icons

export default function Todo() {
    const { user } = useUser();
    const [todoList, setTodoList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editItemId, setEditItemId] = useState(null); // State to track the item being edited
    const [newTodo, setNewTodo] = useState('');
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        // Fetch todo items when component mounts
        getAllTodo();
    }, []);

    const getAllTodo = () => {
        const getAllTodoEndPoint=`${apiBaseUrl}/user/getAllTodo`
        axios.get(getAllTodoEndPoint,{withCredentials:true})
            .then(response => {
                if (response.data.success) {
                    setTodoList(response.data.data);
                } else {
                    console.error(response.data.message);
                }
            }) 
            .catch(error => {
                console.error('Error fetching todo items:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleEdit = (id) => {
        // Set the id of the item being edited
        setEditItemId(id);
    };

    const handleSave = (id, editedContent) => {
        // Send the edited content to the backend
        const editedTodoEndPoint=`${apiBaseUrl}/user/edittodo`
        axios.post(editedTodoEndPoint, { uniqueId: id, updateData:  editedContent }, { withCredentials: true })
            .then((result) => {
                // Handle success response from the backend if needed
                console.log(result);
                const updatedTodoList = todoList.map(todo => {
                    if (todo._id === id) {
                        return { ...todo, content: editedContent };
                    } else {
                        return todo;
                    }
                });
                setTodoList(updatedTodoList);
            })
            .catch((error) => {
                console.error('Error editing todo item:', error);
                // Handle error response from the backend if needed
            });
        // Clear the editItemId to stop editing mode
        setEditItemId(null);
    };

    const handleDelete = (id) => {
        // Perform delete operation or call back function with the id
        const deletetodoEndPoint=`${apiBaseUrl}/user/deletetodo`
        axios.post(deletetodoEndPoint,{_id:id},{withCredentials:true})
        .then((result)=>{
            console.log(result);
            const updatedTodoList = todoList.filter(todo => todo._id !== id);
            setTodoList(updatedTodoList);
        })
        .catch((error)=>{
            console.log(error);
        })
    };

    const handleAddTodo = () => {
        // Add new todo item
        const addTodoEndPoint=`${apiBaseUrl}/user/addtodo`
        axios.post(addTodoEndPoint, { newdata: newTodo }, { withCredentials: true })
            .then((result) => {
                console.log(result);
                if (result.data.success) {
                    // Fetch the updated todo list
                    getAllTodo();
                    setNewTodo('');
                } else {
                    console.error(result.data.message);
                }
            })
            .catch((error) => {
                console.error('Error adding todo item:', error);
                // Handle error response from the backend if needed
            });
    };
    

    return (
        (user&&
        <div className="todo-container">
            <div className="add-todo">
                <input type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} placeholder="Enter todo..." />
                <button className="add-btn" onClick={handleAddTodo}>Add Todo</button>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="todo-list">
                    {todoList.length > 0 ? (
                        todoList.map(todo => (
                            <div key={todo._id} className="todo-item">
                                <div className="content-container">
                                    {editItemId === todo._id ? (
                                        // Render input field for editing if editItemId matches current todo item id
                                        <input id={`input-${todo._id}`} type="text" defaultValue={todo.content} />
                                    ) : (
                                        // Render todo content if not in edit mode
                                        <div className="todo-content">{todo.content}</div>
                                    )}
                                </div>
                                <div className="button-group">
                                    {editItemId === todo._id ? (
                                        <button className="save-btn" onClick={() => handleSave(todo._id, document.getElementById(`input-${todo._id}`).value)}>Save</button>
                                    ) : (
                                        <button className="edit-btn" onClick={() => handleEdit(todo._id)}>
                                            <FaEdit />
                                        </button>
                                    )}
                                    <button className="delete-btn" onClick={() => handleDelete(todo._id)}>
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No todo items found.</p>
                    )}
                </div>
            )}
        </div>
        )
    );
}
