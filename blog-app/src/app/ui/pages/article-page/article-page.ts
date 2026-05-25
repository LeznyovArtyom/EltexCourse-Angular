import { Component, DestroyRef, inject, OnInit, OnDestroy } from '@angular/core';
import { ArticleCard } from '../../components/article-card/article-card';
import { Comments } from '../../components/comments/comments';
import { ARTICLE_CARD_SERVICE_TOKEN } from '../../../services/article-card/article-card-service.token';
import { ArticleCardService } from '../../../services/article-card/article-card.service';
import { ARTICLE_CARD_STORE_TOKEN } from '../../../services/article-card/article-card-store.token';
import { ArticleCardStore } from '../../../services/article-card/article-card-store.service';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, switchMap } from 'rxjs';
import { CommentForm } from '../../components/comment-form/comment-form';
import { Comment, RatingPayload } from '../../../core/models/article.model';
import { environment } from '../../../../environments/environment';
import { ArticleCardGqlService } from '../../../services/article-card/article-card-gql.service';
import { ArticleCardWsService } from '../../../services/article-card/article-card-ws.service';
import { AUTH_STORE_TOKEN } from '../../../services/auth/auth-store.token';

@Component({
  selector: 'app-article-page',
  imports: [ArticleCard, Comments, CommentForm],
  providers: [
    { provide: ARTICLE_CARD_SERVICE_TOKEN, useClass: environment.useLSStorageService ? ArticleCardService : ArticleCardGqlService  },
    { provide: ARTICLE_CARD_STORE_TOKEN, useClass: ArticleCardStore },
    ...(environment.useLSStorageService ? [] : [ArticleCardWsService])
  ],
  templateUrl: './article-page.html',
  styleUrl: './article-page.scss',
})
export class ArticlePage implements OnInit, OnDestroy {
  private articleCardService = inject(ARTICLE_CARD_SERVICE_TOKEN);
  private articleCardStore = inject(ARTICLE_CARD_STORE_TOKEN);
  private articleCardWsService = inject(ArticleCardWsService, { optional: true});
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  protected authStore = inject(AUTH_STORE_TOKEN);

  protected article = this.articleCardStore.article;
  protected comments = this.articleCardStore.comments;

  private articleId: string = "";

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get("id");
        if (id) {
          this.articleId = id;
          return this.articleCardService.getArticle(this.articleId);
        }
        return EMPTY;
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(({article, comments}) => {
      this.articleCardStore.saveArticle(article);
      this.articleCardStore.saveComments(comments);

      if (this.articleCardWsService) {
        this.articleCardWsService.subscribeToArticle(this.articleId);
        this.initWsListeners();
      }
    });
  }

  ngOnDestroy() {
    if (this.articleCardWsService && this.articleId) {
      this.articleCardWsService.unsubscribeFromArticle(this.articleId);
      this.articleCardWsService.disconnect();
    }
  }

  protected changeArticleRating(action: 'down' | 'up') {
    const articleId = this.articleCardStore.article()!.id;
    this.articleCardService.changeArticleRating(articleId, action).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((article) => {
      // Игнорируем ответ от GQL, если работает вебсокет
      if (!this.articleCardWsService) {
        this.articleCardStore.saveArticle(article);
      }
    });
  }

  protected changeCommentRating(ratingPayload: RatingPayload) {
    this.articleCardService.changeCommentRating(ratingPayload.commentId, ratingPayload.action).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((comments) => {
      // Игнорируем ответ от GQL, если работает вебсокет
      if (!this.articleCardWsService) {
        this.articleCardStore.saveComments(comments);
      }
    });
  }

  protected saveComment(comment: Partial<Comment>) {
    const articleId = this.articleCardStore.article()!.id;
    this.articleCardService.addComment(articleId, comment).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((comments) => {
      // Игнорируем ответ от GQL, если работает вебсокет
      if (!this.articleCardWsService) {
        this.articleCardStore.saveComments(comments);
      }
    })
  }

  private initWsListeners() {
    if (!this.articleCardWsService) return;

    this.articleCardWsService.getCommentCreated().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((payload) => {
      if (payload.articleId !== this.articleId) return;

      const comments = this.articleCardStore.comments();

      // Проверяем, нет ли уже такого комментария
      if (comments.some(c => c.id === payload.commentId)) return;

      const newComment: Comment = {
        id: payload.commentId,
        author: payload.username,
        text: payload.content,
        date: new Date(payload.createdAt),
        rating: 0,
        articleId: payload.articleId
      }

      this.articleCardStore.saveComments([ ...comments, newComment ]);
    });
    
    this.articleCardWsService.getCommentRatingChanged().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((payload) => {
      if (payload.articleId !== this.articleId) return;

      const comments = this.articleCardStore.comments();
      const updatedComments = comments.map((comment) => comment.id === payload.commentId ? { ...comment, rating: payload.rating } : comment);
      this.articleCardStore.saveComments(updatedComments);
    });

    this.articleCardWsService.getArticleRatingChanged().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((payload) => {
      if (payload.articleId !== this.articleId) return;

      const article = this.articleCardStore.article();
      if (article) {
        this.articleCardStore.saveArticle({ ...article, rating: payload.rating });
      }
    });
  }
}
