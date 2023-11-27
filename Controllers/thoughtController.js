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
            console.log(err);
            return res.status(500).json(err);
        }
    },
    // Update a thought
    async updateThought(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
            );
            if (!thought) {
                res.status(404).json({ message: 'No thought with this id!' });
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    //delete a thought
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

            if (!thought) {
                res.status(404).json({ message: 'No thought with that ID' });
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },
    
    // add a reaction
    async createReaction(req, res) {
        console.log('You are adding a reaction');
        console.log(req.body);

        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reaction: req.body } },
                { runValidators: true, new: true }
             
            );

            if (!thought) {
                return res
                    .status(404)
                    .json({ message: 'No thought found with that ID :(' });
            }

            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Delete a reaction and remove them from the thought
    async removeReaction(req, res) {
        try {
            const reaction = await Reaction.findOneAndRemove({ _id: req.params.reactionId });

            if (!reaction) {
                return res.status(404).json({ message: 'No such reaction exists' });
            }

            const thought = await Thought.findOneAndUpdate(
                { reactions: req.params.reactionId },
                { $pull: { reaction: req.params.reactionId } },
                { new: true }
            );

            if (!thought) {
                return res.status(404).json({
                    message: 'Reaction deleted, but no thought found',
                });
            }

            res.json({ message: 'Reaction successfully deleted' });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
};

