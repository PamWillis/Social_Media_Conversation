const { Thought, Reaction } = require('../models');

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
            const user = await User.findById(req.user.id);
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
    
          await User.deleteMany({ _id: { $in: thought.users } });
          res.json({ message: 'Thought and Users deleted!' });
        } catch (err) {
          res.status(500).json(err);
        }
      },
};

