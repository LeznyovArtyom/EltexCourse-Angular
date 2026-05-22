import { gql } from "apollo-angular";

export const COMMENT_RATING_UP_GQL = gql`
mutation CommentRatingUp($id: ID!) {
  commentRatingUp(id: $id) {
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