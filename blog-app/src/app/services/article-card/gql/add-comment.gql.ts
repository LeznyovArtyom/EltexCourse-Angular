import { gql } from "apollo-angular";

export const ADD_COMMENT_GQL = gql`
mutation CreateComment($input: CreateCommentInput!) {
  createComment(createComment: $input) {
    article {
      comments {
        id
        username
        content
        createdAt
        rating
        articleId
      }
    }
  }
}
`;