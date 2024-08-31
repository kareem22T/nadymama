import React from 'react';
import { Link } from 'react-router-dom';

export interface DoctorCardProps {
    id: number;
    imgSrc: string;
    title: string;
    name: string;
    specialization: string;
    detailsLink: string;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ imgSrc, title, name, specialization, detailsLink, id }) => {
    return (
        <div className="doctor-card" style={{height: "max-content"}}>
            <div className="thumbnail">
                <img src={imgSrc} alt={name} />
            </div>
            <div className="text">
                <p>
                    <strong>{name}</strong>
                    <br />
                    {specialization}
                </p>
                <Link to={`/doctor/${id}`}>عرض التفاصيل</Link>
            </div>
        </div>
    );
};

export default DoctorCard;
