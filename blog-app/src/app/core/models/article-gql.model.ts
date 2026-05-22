export interface GqlArticleResponse {
  id: string,
  title: string,
  content: string,
  createdAt: string,
  imgSrc: string | null,
  rating: number
}

export interface GqlCommentResponse {
  id: string,
  username: string,
  content: string,
  createdAt: string,
  rating: number,
  articleId: string
}

export interface GqlArticleWithCommentsResponse extends GqlArticleResponse {
  comments: GqlCommentResponse[]
}