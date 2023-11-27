const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend
} = require('../../controllers/userController');

// /api/user
router.route('/users').get(getUsers).post(createUser);

// /api/users/:userId
router.route('/:userId').get(getSingleUser).delete(deleteUser);

// /api/users/:userId/
router.route('/:userId').put(updateUser);

// /api/users/:userId/friends/:friendId
router.route('/users/:userId/friends/:friendId').delete(removeFriend).post(addFriend);

module.exports = router;