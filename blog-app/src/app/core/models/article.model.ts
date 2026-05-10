export interface Article {
  id: string,
  title: string,
  text: string,
  date: Date,
  img_path: string,
  rating: number
};

export interface PaginatedArticles {
  articles: Article[],
  total: number
};

export interface Comment {
  id: string,
  author: string,
  text: string,
  date: Date,
  rating: number,
  articleId: string
};

export interface ArticleInfo {
  article: Article,
  comments: Comment[]
};

export interface RatingPayload {
  commentId: string,
  action: 'down' | 'up'
}