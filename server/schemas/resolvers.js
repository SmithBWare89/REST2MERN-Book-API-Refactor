const { AuthenticationError } = require('apollo-server-express')
const { User, bookSchema } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            try {
                if (context.user) {
                    const user = await User.findOne({_id: context.user._id});
                    return user
                }
                throw new AuthenticationError('You must be logged in!')
            } catch (error) {
                console.log(error);
            }
        }
    },
    Mutation: {
        addUser: async (parent, args) => {
            try {
                const user = await User.create(args);
                const token = await signToken(user);
                return { token, user };
            } catch (error) {
                console.log(error);
            }
        },
        saveBook: async (parent, {bookData}, context) => {
            try {
                if(context.user) {
                    const userData = await User.findOneAndUpdate(
                        {
                            _id: context.user._id
                        },
                        {
                            $push: {
                                savedBooks: {...bookData}
                            }
                        },
                        {
                            new: true
                        }
                    )
                    return userData;
                }

                throw new AuthenticationError('You need to be logged in!');
            } catch (error) {
                console.log(error);
            }
        },
        login: async (parent, {email, password}) => {
            try {
                const user = await User.findOne({email});
                if (!user) {
                    throw new AuthenticationError('Incorrect credentials!');
                }

                const correctPw = await user.isCorrectPassword(password);

                if (!correctPw) {
                    throw new AuthenticationError('Incorrrect credentials!');
                }

                const token = signToken(user);
                return {token, user};

            } catch (error) {
                console.log(error);
            }
        },
        removeBook: async (parent, {bookId}, context) => {
            try {
                if(context.user) {
                    const userData = await User.findOneAndUpdate(
                        {
                            _id: context.user._id
                        },
                        {
                            $pull: {
                                savedBooks: {
                                    bookId
                                }
                            }
                        },
                        {
                            new: true
                        }
                    );

                    if (!userData) {
                        throw new AuthenticationError('Unable to process deletion.');
                    }

                    return userData;
                }

                throw new AuthenticationError('You must be logged in!')
            } catch (error) {
                console.log(error);
            }
        }
    }
}

module.exports = resolvers;