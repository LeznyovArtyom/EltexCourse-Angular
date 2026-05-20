import { Article } from "./article.model";

export interface ApiArticleResponse {
  id: string,
  title: string,
  content: string,
  imgSrc: string | null,
  categoryId: string | null,
  rating: number,
  createdAt: string,
  updatedAt: string
}

export interface ApiArticlesResponse {
  items: ApiArticleResponse[],
  total: number,
  page: number,
  limit: number
}

export interface ArticleFormData extends Partial<Article> {
  imageFile?: File | null;
}