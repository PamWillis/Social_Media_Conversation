//require in database connection
import { faker } from '@faker-js/faker'

const { Thought } = require('./Thought');
const { User } = require('./User');
//Require in the model names ie const {Thought} = require("file path here")
//open database and delete everything in it
db.once('open', async () => {
    await Thought.deleteMany({})
    await User.deleteMany({})
    //Inside the same function - create fake data and add to model
    const generateFakerUser = () => {
        return {
            id: faker.string.uuid(),
            email: faker.internet.email(),
            thoughts: faker.string.uuid(),
            friends: faker.string.uuid(),
        }
    }
    const generateFakerThought = () => {
        return {
            id: faker.string.uuid(),
            thoughtText: faker.lorem.lines(),
            createdAt: faker.date.past(),
            username: faker.internet.userName(),
            reaction: faker.lorem.lines(),
        }
    }
    await User.collection.insertMany(generateFakerUser)
    Thought.create({generateFakerThought, generateFakerThought})
    console.log("FINISHED SEEDING")
    process.exit(0);
    
    //Create fake data
    //Add to DB --> using await User.collection.insertMany(arrayOfDataYouMadeHere)
    //Now for thoughts you can use the mongo function Thought.create({datahere, datahere})
    //Maybe a console log once it's all done console.log("FINISHED SEEDING")
    //Exit process.exit(0);
}) //Close the db.open function