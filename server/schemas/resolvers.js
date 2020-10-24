const { AuthenticationError } = require('apollo-server-express')
const { User, bookSchema } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, {username}, {user}) => {
            try {
                user
                    ? await (await User.findOne({username})).select('-__v -password').populate('savedBooks')
                    : new AuthenticationError('You must be logged in!')
            } catch (error) {
                console.log(error);
            }
        }
    },
    Mutation: {
        addUser: async (parent, args) => {
            try {
                const user = await User.create(args.user).select('-__v -password');
                !user
                    ? console.log('Unable to create user')
                    : {token: signToken(user), user}
                // const token = await signToken(user);
                // return { token, user };
            } catch (error) {
                console.log(error);
            }
        },
        saveBook: async (parent, {book}, {user}) => {
            try {
                if(user) {
                    const userData = await User.findOneAndUpdate(
                        {
                            username: user.username
                        },
                        {
                            $addToSet: {
                                savedBooks: {...book}
                            }
                        },
                        {
                            new: true
                        }
                    )
                    .select('-password')
                    return userData;
                }

                throw new AuthenticationError('You need to be logged in!');
            } catch (error) {
                console.log(error);
            }
        },
        login: async (parent, {loginInfo}) => {
            try {
                const user = await User.findOne({email: loginInfo.email}).select('-password');
                // if (!user) {
                //     throw new AuthenticationError('Incorrect credentials!');
                // }

                // const correctPw = await user.isCorrectPassword(loginInfo.password);

                // if (!correctPw) {
                //     throw new AuthenticationError('Incorrrect credentials!');
                // }

                // const token = signToken(user);
                // return {token, user};

                !user
                    ? new AuthenticationError('Incorrect credentials!')
                    : !correctPw
                        ? new AuthenticationError('Incorrect credentials!')
                        : { token: signToken(user), user }
            } catch (error) {
                console.log(error);
            }
        },
        removeBook: async (parent, {bookId}, {user}) => {
            try {
                if(context.user) {
                    const userData = await User.findOneAndUpdate(
                        {
                            username: user.username
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
                    
                    userData
                        ? userData
                        : new AuthenticationError('Unable to process deletion.')
                }

                throw new AuthenticationError('You must be logged in!')
            } catch (error) {
                console.log(error);
            }
        }
    }
}

module.exports = resolvers;