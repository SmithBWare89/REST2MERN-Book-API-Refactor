const { gql } = require('apollo-server-express');

const typeDefs = gql`
    # Data Types
    type Book {
        authors: [String]
        description: String!
        bookId: ID!
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

    input BookInput {
        authors: [String] 
        description: String!
        bookId: ID!
        image: String
        link: String
        title: String!
    }

    # Queries
    type Query {
        me: User
    }

    # Mutations
    type Mutation {
        addUser (username: String!, email: String!, password: String! ) : Auth
        login(email: String!, password: String!) : Auth
        saveBook(bookData: BookInput!) : User
        removeBook (bookId: ID!) : User
    }
`;

module.exports = typeDefs;