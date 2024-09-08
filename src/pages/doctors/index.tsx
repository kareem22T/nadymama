import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import DoctorCard, { DoctorCardProps } from './doctorCard';
import DefaultLayout from '../../layout/DefaultLayout';
import { Pagination, CircularProgress } from '@mui/material';

const Doctors: React.FC = () => {
    const [doctors, setDoctors] = useState<DoctorCardProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    const location = useLocation();

    const getQueryParams = () => {
        const params = new URLSearchParams(location.search);
        return {
            name: params.get('name') || '',
            specialization_id: params.get('category') || '',
            position_id: params.get('position') || '',
            gouvernorat_id: params.get('gouvernorat') || '',
        };
    };

    useEffect(() => {
        const fetchDoctors = async () => {
            setLoading(true);
            const { name, specialization_id, position_id, gouvernorat_id } = getQueryParams();
            try {
                const response = await axios.get(`https://api.nadymama.com/api/users/doctors`, {
                    params: {
                        page,
                        name,
                        specialization_id,
                        gouvernorat_id,
                        position_id,
                    },
                });
                const { data, last_page } = response.data;
                const doctorsData = data.map((doctor: any) => ({
                    imgSrc: doctor.photo ? 'https://api.nadymama.com/public/storage/' + doctor.photo : './assets/imgs/default-doctor.jpg',
                    title: doctor.degree,
                    name: doctor.name,
                    id: doctor.id,
                    psoition: doctor.position.name,
                    detailsLink: `/doctor-${doctor.id}.html`,
                }));
                setDoctors(doctorsData);
                setTotalPages(last_page);
            } catch (error) {
                console.error('Error fetching doctors:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, [page, location.search]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return (
        <DefaultLayout>
            <section className="doctors">
                <div className="container">
                    <div className="head">
                        <h2>
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-heartbeat" width="44"
                                height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none"
                                strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path
                                    d="M19.5 13.572l-7.5 7.428l-2.896 -2.868m-6.117 -8.104a5 5 0 0 1 9.013 -3.022a5 5 0 1 1 7.5 6.572" />
                                <path d="M3 13h2l2 3l2 -6l1 3h3" />
                            </svg>
                            كل الاطباء
                        </h2>
                    </div>
                    <div className="doctors-parent">
                        {loading ? (
                            <CircularProgress />
                        ) : (
                            doctors.map((doctor, index) => (
                                <DoctorCard
                                    key={index}
                                    imgSrc={doctor.imgSrc}
                                    title={doctor.title}
                                    id={doctor.id}
                                    name={doctor.name}
                                    psoition={doctor.psoition}
                                    detailsLink={doctor.detailsLink}
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

export default Doctors;
