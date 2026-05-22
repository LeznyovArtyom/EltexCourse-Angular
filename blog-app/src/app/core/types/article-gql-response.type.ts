import { GqlArticleResponse, GqlArticleWithCommentsResponse, GqlCommentResponse } from "../models/article-gql.model"

export type ArticleWithCommentsGqlResponse = {
  article: GqlArticleWithCommentsResponse
}

export type ArticleGqlResponse = {
  article: GqlArticleResponse
}

export type AddCommentGqlResponse = {
  createComment: {
    article: {
      comments: GqlCommentResponse[]
    }
  }
}

export type ArticleRatingDownGqlResponse = {
  articleRatingDown: GqlArticleResponse
}

export type ArticleRatingUpGqlResponse = {
  articleRatingUp: GqlArticleResponse
}

export type ArticleRatingMutationGqlResponse = ArticleRatingDownGqlResponse & ArticleRatingUpGqlResponse;

export type CommentRatingDownGqlResponse = {
  commentRatingDown: {
    article: {
      comments: GqlCommentResponse[]
    }
  }
}

export type CommentRatingUpGqlResponse = {
  commentRatingUp: {
    article: {
      comments: GqlCommentResponse[]
    }
  }
}

export type CommentRatingMutationGqlResponse = CommentRatingDownGqlResponse & CommentRatingUpGqlResponse;