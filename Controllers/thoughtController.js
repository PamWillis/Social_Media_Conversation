const { Thought, User } = require('../models');

module.exports = {

    // Get all thoughts
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Get a thought
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId })
                .select('-__v');

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Create a thought
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);

            // Assuming the user is associated with the thought
            const user = await User.findById(req.body.userId);
            user.thoughts.push(thought);
            await user.save();

            res.json(thought);
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    // Update a thought
    async updateThought(req, res) {
        try {

            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId, userId: req.body._id }, // Check if the user is the owner of the thought
                { $set: req.body },
                { new: true }

            );
            console.log(req)
            if (!thought) {
                res.status(404).json({ message: 'No thought with this id!' });
            }
            res.json(thought);
        } catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    },
    // Delete a thought
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndDelete(
                { _id: req.params.thoughtId, userId: req.body._id });

            if (!thought) {
                res.status(404).json({ message: 'No thought with that ID' });
            }

            const user = await User.findOneAndUpdate(
                { thoughts: req.params.thoughtId },
                { $pull: { thoughts: req.params.thoughtId } },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({
                    message: 'Thought deleted, but no user found',
                });
            }
        res.json({ message: 'Thought deleted successfully' });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // add a reaction
    async createReaction(req, res) {

        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body } },
                { runValidators: true, new: true }

            );

            if (!thought) {
                return res
                    .status(404)
                    .json({ message: 'No thought found with that ID :(' });
            }

            res.json(thought);
        } catch (err) {

            res.status(500).json(err);
        }
    },
    // Delete a reaction and remove them from the thought
    async removeReaction(req, res) {
        try {

            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: req.params.reactionId } },
                { new: true }
            );

            if (!thought) {
                return res.status(404).json({
                    message: 'Reaction deleted, but no thought found',
                });
            }

            res.json({ message: 'Reaction successfully deleted' });
        } catch (err) {

            res.status(500).json(err);
        }
    },
};

