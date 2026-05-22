import { gql } from "apollo-angular";

export const COMMENT_RATING_DOWN_GQL = gql`
mutation CommentRatingDown($id: ID!) {
  commentRatingDown(id: $id) {
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