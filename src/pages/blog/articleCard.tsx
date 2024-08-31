import React from 'react';
import { Link } from 'react-router-dom';

export interface ArticleCardProps {
    id: number;
    imgSrc: string;
    title: string;
    breif: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ imgSrc, title, breif, id }) => {
    return (
        <Link to={'/article/' + id} className="post-card">
            <div className="thumbnail">
                <img src={imgSrc} alt="" />
            </div>
            <div className="text">
                <h3>
                    {title}
                </h3>
                <p>
                    {breif}
                </p>
            </div>
        </Link>
    );
};

export default ArticleCard;
