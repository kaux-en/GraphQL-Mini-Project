import { gql } from 'urql';

export const USER_INFO = gql`
query getUserInfo($id: ID!){
  user(id: $id) {
    id
    name
    email
    phone
    website
    company{
      name
    }
    address {
      geo {
        lat
        lng
      }
    }
  }
}
`

export const USER_POST = gql`
    query {
  user(id: 1) {
    posts {
      data {
        id
        title
        comments {
          data {
            name
            body
          }
        }
      }
    }
  }
}
`

export const CREATE_POST = gql`
    mutation (
  $input: CreatePostInput!
) {
  createPost(input: $input) {
    id
    title
    body
  }
}
`

export const UPDATE_POST = gql`
mutation (
  $id: ID!,
  $input: UpdatePostInput!
) {
  updatePost(id: $id, input: $input) {
    id
    title
    body
  }
}
`

export const DELETE_POST = gql`
    mutation (
  $id: ID!
) {
  deletePost(id: $id)
}
`

export const GET_ALBUM_TODOS = gql`
query {
  users {
      data {
        id
        name
        albums {
          data {
            title
          }
        }
        todos {
          data {
            title
            completed
          }
        }
      }
    }
  }
`