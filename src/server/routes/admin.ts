import express from 'express'
import {
    deleteUser,
    deleteUserTask,
    getAllTasks,
    getAllUsers,
    getUserTasks,
    updateUserTask,
} from '../controllers/admin.js'
import { checkRole, isAuthenticated } from '../middlewares/auth.js'

const router = express.Router()

router.delete('/delete/:id', isAuthenticated, checkRole('admin'), deleteUser)

router.get('/user/:id', isAuthenticated, checkRole('admin', 'testAdmin'), getUserTasks)

router.get('/users/all', isAuthenticated, checkRole('admin', 'testAdmin'), getAllUsers)

router.get('/tasks/all/:id', isAuthenticated, checkRole('admin', 'testAdmin'), getAllTasks)

router
    .route('/task/:id')
    .put(isAuthenticated, checkRole('admin'), updateUserTask)
    .delete(isAuthenticated, checkRole('admin'), deleteUserTask)

export default router
