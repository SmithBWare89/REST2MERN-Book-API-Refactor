import gql from 'graphql-tag';

export const LOGIN_USER = gql`
    mutation login($loginInfo: LoginInput!) {
        login(loginInfo: $loginInfo) {
            token
            user {
                _id
                username
            }
        }
    }
`;

export const ADD_USER = gql`
    mutation addUser($user: UserInput!) {
        addUser(user: $user) {
            token
            user {
                _id
                username
            }
        }
    }
`;

export const SAVE_BOOK = gql`
    mutation saveBook($book: BookInput!) {
        saveBook(book: $book) {
            _id
            username
            bookCount
            savedBooks {
                bookId
                title
                authors
                description
                link
                image
            }
        }
    }
`;

export const REMOVE_BOOK = gql`
    mutation removeBook(bookId: String!) {
        username
        bookCount
        savedBooks {
            bookId
            title
            authors
            description
            link
            image
        }
    }
`