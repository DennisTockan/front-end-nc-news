import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getSingleArticle,
  getSingleArticleComments,
  patchArticleVote,
} from "../Api";
import CommentCard from "../Components/Comment-Card";

const SingleArticle = () => {
  const { article_id } = useParams();

  const [article, setArticle] = useState("");
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState("");

  useEffect(() => {
    getSingleArticle(article_id)
      .then((articleFromApi) => {
        setArticle(articleFromApi);
        setIsLoading(false);
      })
      .catch(() => {
        setIsError(true);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    getSingleArticleComments(article_id)
      .then((articleFromApi) => {
        setComments(articleFromApi);
        setIsLoading(false);
      })
      .catch(() => {
        setIsError(true);
        setIsLoading(false);
      });
  }, []);

  const [displayedVotes, setDisplayedVotes] = useState(0);

  const handleClick = () => {
    setDisplayedVotes((currentDisplayedVotes) => {
      return currentDisplayedVotes + 1;
    });
    patchArticleVote(article_id)
    .catch(() => {
      setDisplayedVotes((currentDisplayedVotes) => {
        return currentDisplayedVotes - 1;
      });
      setIsError(true);
    });
  };

  if (isLoading) return <p>Loading...</p>;
  // if (isError) return <p> Oops! Something's gone wrong!</p>;

  return (
    <>
      <section className="single-article">
        <div className="header">
          <h2>{article.title}</h2>
          <p>Created by: {article.author}</p>
          <p>Date:{article.created_at.slice(0, 10)}</p>
        </div>
        <img
          src={article.article_img_url}
          alt={article.article_img_url}
          className="article-image"
        />
        <p>{article.body}</p>
        <p>Likes: {article.votes + displayedVotes}</p>
        <button
          aria-label="like button"
          onClick={handleClick}
          disabled={displayedVotes > 0}
        >
          {" "}
          👍{" "}
        </button>
        {isError ? <p>Oops! Something's gone wrong! Please try again!</p> : null}
      </section>

      <section className="comments">
        <h2 className="comments-header">Comments ({comments.length})</h2>
        <ol className="comments_list">
          {comments.map(({ comment_id, votes, body, author, created_at }) => {
            return (
              <CommentCard
                key={comment_id}
                author={author}
                body={body}
                created_at={created_at}
                votes={votes}
              />
            );
          })}
        </ol>
      </section>
    </>
  );
};

export default SingleArticle;
