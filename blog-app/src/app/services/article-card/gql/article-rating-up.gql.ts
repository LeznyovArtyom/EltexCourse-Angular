import { gql } from "apollo-angular";

export const ARTICLE_RATING_UP_GQL = gql`
mutation ArticleRatingUp($id: ID!) {
  articleRatingUp(id: $id) {
    id
    title
    content
    createdAt
    imgSrc
    rating
  }
}
`;