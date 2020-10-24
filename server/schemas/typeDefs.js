const { gql } = require('apollo-server-express');

const typeDefs = gql`
    # Data Types
    type Book {
        authors: [String]
        description: String!
        bookId: String!
        image: String
        link: String
        title: String!
    }

    type User {
        _id: ID!
        username: String!
        email: String!
        password: String!
        bookCount: Int!
        savedBooks: [Book]
    }


    type Auth {
        token: ID!
        user: User
    }

    # Input Types
    input UserInput {
        username: String!
        email: String!
        password: String!
    }

    input BookInput {
        authors: [String!]
        description: String!
        bookId: String!
        title: String!
        image: String
        link: String
    }

    input LoginInput {
        username: String!
        password: String!
    }

    # Queries
    type Query {
        me: User
    }

    # Mutations
    type Mutation {
        addUser (user: UserInput!) : Auth
        login (loginInfo: LoginInput!) : Auth
        saveBook (book: BookInput!) : Book
        removeBook (bookId: String!) : User
    }
`;

module.exports = typeDefs;