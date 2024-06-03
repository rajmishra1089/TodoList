const User = require('../module/User'); // Import the User Schema
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require("dotenv").config();


exports.addtodo = async (req, res) => {
    try {
        const { newdata } = req.body;
        console.log(newdata);
        let payload = req.user;
        let LoggedInUser = await User.findOne({ _id: payload.id });
        // Add new todo item to user's data array
        if (!LoggedInUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Initialize the 'data' property as an empty array if it doesn't exist
        if (!LoggedInUser.data) {
            LoggedInUser.data = [];
        }

        // Add new todo item to user's data array
        LoggedInUser.data.push({
            content: newdata,
        });

        // Save the updated user document
        await LoggedInUser.save();

        res.status(200).json({
            success: true,
            message: 'New todo added successfully',
            actualdata: { content: newdata }
        });
    } catch (error) {
        console.error('Issue in creating a new todo:', error);
        return res.status(500).json({
            success: false,
            message: 'Issue in creating todo, please try again later'
        });
    }
};

exports.deletetodo = async (req, res) => {
    try {
        const { _id } = req.body; // Assuming you're sending _id in the request body
        let payload = req.user;
        let LoggedInUser = await User.findOne({ _id: payload.id });
        console.log(LoggedInUser)
        console.log(_id)
        if (!LoggedInUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Find the index of the todo item with the given _id
        const indexToDelete = LoggedInUser.data.findIndex(todo => todo._id.toString() === _id);

        if (indexToDelete === -1) {
            return res.status(404).json({
                success: false,
                message: 'Todo item not found'
            });
        }

        // Remove the todo item from the user's data array
        LoggedInUser.data.splice(indexToDelete, 1);

        // Save the updated user document
        await LoggedInUser.save();

        return res.status(200).json({
            success: true,
            message: 'Todo item deleted successfully'
        });
    } catch (error) {
        console.error('Issue in deleting todo:', error);
        return res.status(500).json({
            success: false,
            message: 'Issue in deleting todo, please try again later'
        });
    }
};


exports.edittodo = async (req, res) => {
    try {
        const { uniqueId, updateData } = req.body;
        let payload = req.user;
        let LoggedInUser = await User.findOne({ _id: payload.id });

        if (!LoggedInUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Find the todo item with the given uniqueId
        const todoToEdit = LoggedInUser.data.find(todo => todo._id.toString() === uniqueId);

        if (!todoToEdit) {
            return res.status(404).json({
                success: false,
                message: 'Todo item not found'
            });
        }
        console.log(todoToEdit);
        // Update the content field of the todo item
        todoToEdit.content = updateData;

        // Save the updated user document 
        await LoggedInUser.save();

        return res.status(200).json({
            success: true,
            message: 'Todo item updated successfully'
        });
    } catch (error) {
        console.error('Issue in updatind todo:', error);
        return res.status(500).json({
            success: false,
            message: 'Issue in updating todo, please try again later'
        });
    }
} 

exports.getAllTodo = async (req, res) => {
    try {
        let payload = req.user;
        let LoggedInUser = await User.findOne({ _id: payload.id });

        if (!LoggedInUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Find the todo item with the given uniqueId
        const todoItems = LoggedInUser.data;

        if (!todoItems) {
            return res.status(404).json({
                success: false,
                message: 'Todo items not found'
            });
        }
        console.log(todoItems);

        return res.status(200).json({
            success: true,
            message: 'Todo items fetched successfully',
            data:todoItems
        });
    } catch (error) {
        console.error('Issue in fetching items:', error);
        return res.status(500).json({
            success: false,
            message: 'Issue in fetching todo items, please try again later'
        });
    }
}
