import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ArticleCard, { ArticleCardProps } from './articleCard';
import DefaultLayout from '../../layout/DefaultLayout';
import { Pagination, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';

const Blog: React.FC = () => {
    const [articles, setArticles] = useState<ArticleCardProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const {id} = useParams()
    const {name} = useParams()

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`https://nadymama-api.ykdev.online/api/users/articles?page=${page}`);
                const { data, last_page } = response.data;
                const articlesData = data.map((article: any) => ({
                    imgSrc: article.thumbnail ? 'https://nadymama-api.ykdev.online/public/storage/' + article.thumbnail : './assets/imgs/default-article.jpg',
                    title: article.title,
                    id: article.id,
                    breif: article.brief,
                }));
                setArticles(articlesData);
                setTotalPages(last_page);
            } catch (error) {
                console.error('Error fetching articles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [page]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return (
        <DefaultLayout>
            <section className="posts">
                <div className="container">
                    <div className="posts-parent">
                        {loading ? (
                            <CircularProgress />
                        ) : (
                            articles.map((article, index) => (
                                <ArticleCard
                                    key={index}
                                    id={article.id}
                                    imgSrc={article.imgSrc}
                                    title={article.title}
                                    breif={article.breif}
                                />
                            ))
                        )}
                    </div>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        variant="outlined"
                        color="primary"
                        className="pagination"
                    />
                </div>
            </section>
        </DefaultLayout>
    );
};

export default Blog;
