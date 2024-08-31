import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DefaultLayout from '../../layout/DefaultLayout';

interface Article {
  id: number;
  title: string;
  brief: string;
  thumbnail: string;
  content: string;
}

const ArticleComponent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get<Article>(`https://nadymama-api.ykdev.online/api/users/articles/${id}`);
        setArticle(response.data);
      } catch (error) {
        console.error('Error fetching the article:', error);
      }
    };

    fetchArticle();
  }, [id]);

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <DefaultLayout>
    <section className="post">
      <div className="container">
        <div className="card_wrapper">
          <h1 className="title">{article.title}</h1>
          <div className="date" style={{ textAlign: 'center', marginBottom: '16px', color: 'gray' }}>
            تاريخ النشر 9 مايو 2024
          </div>
          <div className="text_wrapper">
            <img src={"https://nadymama-api.ykdev.online/public/storage/" + article.thumbnail} alt={article.title} />
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>
        </div>
      </div>
    </section>
    </DefaultLayout>
  );
};

export default ArticleComponent;
