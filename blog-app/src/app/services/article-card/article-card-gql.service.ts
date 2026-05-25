import { inject, Injectable } from "@angular/core";
import { IArticleCardService } from "./article-card-service.interface";
import { catchError, map, Observable, of, throwError } from "rxjs";
import { Article, ArticleInfo, Comment } from "../../core/models/article.model";
import { Apollo } from "apollo-angular";
import { GET_ARTICLE_GQL } from "./gql/get-article.gql";
import { AddCommentGqlResponse, ArticleRatingMutationGqlResponse, ArticleWithCommentsGqlResponse, CommentRatingMutationGqlResponse } from "../../core/types/article-gql-response.type";
import { GqlArticleResponse, GqlArticleWithCommentsResponse, GqlCommentResponse } from "../../core/models/article-gql.model";
import { ARTICLE_RATING_DOWN_GQL } from "./gql/article-rating-down.gql";
import { ARTICLE_RATING_UP_GQL } from "./gql/article-rating-up.gql";
import { COMMENT_RATING_DOWN_GQL } from "./gql/comment-rating-down.gql";
import { COMMENT_RATING_UP_GQL } from "./gql/comment-rating-up.gql";
import { ADD_COMMENT_GQL } from "./gql/add-comment.gql";

@Injectable()
export class ArticleCardGqlService implements IArticleCardService {
  private apollo = inject(Apollo);

  public getArticle(id: string): Observable<ArticleInfo> {
    return this.apollo.query<ArticleWithCommentsGqlResponse>({
      query: GET_ARTICLE_GQL,
      variables: { id }
    }).pipe(
      map((result: Apollo.QueryResult<ArticleWithCommentsGqlResponse>) => {
        if (result.error) {
          throw new Error(result.error.message);
        }

        const articleDataResponse = result.data?.article;

        if (!articleDataResponse) {
          throw new Error("Статья не найдена");
        }

        return this.mapToArticleWithComments(articleDataResponse);
      }),
      catchError((error) => {
        console.error(`[ArticleCardGqlService] Ошибка при загрузке статьи ${id}:`, error);

        return throwError(() => error)
      })
    )
  }

  public addComment(articleId: string, comment: Partial<Comment>): Observable<Comment[]> {
    return this.apollo.mutate<AddCommentGqlResponse>({
      mutation: ADD_COMMENT_GQL,
      variables: {
        input: {
          articleId,
          content: comment.text,
          username: comment.author
        }
      }
    }).pipe(
      map((result: Apollo.MutateResult<AddCommentGqlResponse>) => {
        if (result.error) {
          throw new Error(result.error.message);
        }

        const commentsDataResponse = result.data?.['createComment'].article.comments;

        if (!commentsDataResponse) {
          throw new Error("Комментарии после добавления нового комментария не найдены");
        }

        return this.mapToComments(commentsDataResponse);
      }),
      catchError((error) => {
        console.error(`[ArticleCardGqlService] Ошибка при добавлении комментария к статье ${articleId}:`, error);

        return throwError(() => error);
      })
    )
  }

  public changeCommentRating(id: string, action: string): Observable<Comment[]> {
    const mutationName = action === 'down' ? 'commentRatingDown' : 'commentRatingUp';

    return this.apollo.mutate<CommentRatingMutationGqlResponse>({
      mutation: action === 'down' ? COMMENT_RATING_DOWN_GQL : COMMENT_RATING_UP_GQL,
      variables: { id }
    }).pipe(
      map((result: Apollo.MutateResult<CommentRatingMutationGqlResponse>) => {
        if (result.error) {
          throw new Error(result.error.message);
        }

        const commentsDataResponse = result.data?.[mutationName].article.comments;

        if (!commentsDataResponse) {
          throw new Error("Комментарии после изменения рейтинга не найдены");
        }

        return this.mapToComments(commentsDataResponse);
      }),
      catchError((error) => {
        console.error(`[ArticleCardGqlService] Ошибка при изменении рейтинга комментария ${id}:`, error);

        return throwError(() => error);
      })
    )
  }

  public changeArticleRating(id: string, action: 'down' | 'up'): Observable<Article> {
    const mutationName = action === 'down' ? 'articleRatingDown' : 'articleRatingUp';

    return this.apollo.mutate<ArticleRatingMutationGqlResponse>({
      mutation: action === 'down' ? ARTICLE_RATING_DOWN_GQL : ARTICLE_RATING_UP_GQL,
      variables: { id }
    }).pipe(
      map((result: Apollo.MutateResult<ArticleRatingMutationGqlResponse>) => {
        if (result.error) {
          throw new Error(result.error.message);
        }

        const articleDataResponse = result.data?.[mutationName];

        if (!articleDataResponse) {
          throw new Error("Статья не найдена");
        }

        return this.mapToArticle(articleDataResponse);
      }),
      catchError((error) => {
        console.error(`[ArticleCardGqlService] Ошибка при изменении рейтинга статьи ${id}:`, error);

        return throwError(() => error)
      })
    )
  }

  private mapToArticleWithComments(item: GqlArticleWithCommentsResponse): ArticleInfo {
    return {
      article: {
        id: item.id,
        title: item.title, 
        text: item.content,
        date: new Date(item.createdAt),
        imgSrc: item.imgSrc,
        rating: item.rating
      },
      comments: this.mapToComments(item.comments)
    }
  }

  private mapToArticle(item: GqlArticleResponse): Article {
    return {
      id: item.id,
      title: item.title, 
      text: item.content,
      date: new Date(item.createdAt),
      imgSrc: item.imgSrc,
      rating: item.rating
    }
  }

  private mapToComments(items: GqlCommentResponse[]) {
    return items.map((item) => ({
      id: item.id,
      author: item.username,
      text: item.content,
      date: new Date(item.createdAt),
      rating: item.rating,
      articleId: item.articleId
    }))
  }
}