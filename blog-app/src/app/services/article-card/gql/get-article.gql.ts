import { gql } from "apollo-angular";

export const GET_ARTICLE_GQL = gql`
query Article($id: ID!) {
  article(id: $id) {
    id
    title
    content
    createdAt
    imgSrc
    rating
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
`;