import { Component, DestroyRef, inject, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-article-page',
  imports: [ArticleCard, Comments, CommentForm],
  providers: [
    { provide: ARTICLE_CARD_SERVICE_TOKEN, useClass: ArticleCardService },
    { provide: ARTICLE_CARD_STORE_TOKEN, useClass: ArticleCardStore },
  ],
  templateUrl: './article-page.html',
  styleUrl: './article-page.scss',
})
export class ArticlePage implements OnInit {
  private articleCardService = inject(ARTICLE_CARD_SERVICE_TOKEN);
  private articleCardStore = inject(ARTICLE_CARD_STORE_TOKEN)
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  protected article = this.articleCardStore.article;
  protected comments = this.articleCardStore.comments;

  private article_id: string = "";

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get("id");
        if (id) {
          this.article_id = id;
          return this.articleCardService.getArticle(this.article_id);
        }
        return EMPTY;
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(({article, comments}) => {
      this.articleCardStore.saveArticle(article);
      this.articleCardStore.saveComments(comments);
    });
  }

  protected changeArticleRating(action: 'down' | 'up') {
    const article_id = this.articleCardStore.article().id;
    this.articleCardService.changeArticleRating(article_id, action).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((article) => {
      this.articleCardStore.saveArticle(article);
    });
  }

  protected changeCommentRating(ratingPayload: RatingPayload) {
    this.articleCardService.changeCommentRating(ratingPayload.commentId, ratingPayload.action).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((comments) => {
      this.articleCardStore.saveComments(comments);
    });
  }

  protected saveComment(comment: Partial<Comment>) {
    const article_id = this.articleCardStore.article().id;
    this.articleCardService.addComment(article_id, comment).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((comments) => {
      this.articleCardStore.saveComments(comments);
    })
  }
}
