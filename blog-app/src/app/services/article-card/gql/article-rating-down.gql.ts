import { gql } from "apollo-angular";

export const ARTICLE_RATING_DOWN_GQL = gql`
mutation ArticleRatingDown($id: ID!) {
  articleRatingDown(id: $id) {
    id
    title
    content
    createdAt
    imgSrc
    rating
  }
}
`;