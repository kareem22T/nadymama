import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";
import appleImg from '../../imgs/apple.jpg';
import googleImg from '../../imgs/google.jpg';
import img from '../../imgs/img5.jpg';
import ad from '../../imgs/ado-1.jpg';
import imgBlog1 from '../../imgs/img.png';
import imgBlog2 from '../../imgs/img3.jpg';
import imgBlog3 from '../../imgs/img5.jpg';
import imgBlog4 from '../../imgs/img8.jpg';
import imgBlog5 from '../../imgs/img11.jpg';
import DefaultLayout from '../../layout/DefaultLayout';
import { Link } from 'react-router-dom';

// Interfaces
type Position = {
    name: string
}
interface Doctor {
    id: number;
    name: string;
    description: string;
    username: string;
    password: string;
    photo: string | null;
    degree: string;
    examination_price: string;
    special_examination_price: string;
    way_of_waiting: string;
    created_at: string;
    updated_at: string;
    specialization_id: number;
    position: Position;
}

interface Category {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    doctors: Doctor[];
}
interface Article {
    id: number;
    title: string;
    brief: string;
    thumbnail: string;
}
type SettingsRes = {
    about: string,
    ad_user_one: string,
    ad_user_two: string
}
interface Settings {
    id: number;
    data: SettingsRes;
}
// Fetch function
const fetchCategories = async (): Promise<Category[]> => {
    const response = await axios.get<Category[]>('https://api.nadymama.com/api/users/categories');
    return response.data;
};

// Fetch function
const fetchCategoriesAlone = async (): Promise<Category[]> => {
    const response = await axios.get<Category[]>('https://api.nadymama.com/api/users/doctors/categories');
    return response.data;
};

const fetchPositions = async (): Promise<Category[]> => {
    const response = await axios.get<Category[]>('https://api.nadymama.com/api/users/doctors/positions');
    return response.data;
};

const fetchGouvernorats = async (): Promise<Category[]> => {
    const response = await axios.get<Category[]>('https://api.nadymama.com/api/users/doctors/gouvernorats');
    return response.data;
};

type ArticleRes = {
    data: Article[]
}
const fetchArticles = async (): Promise<Article[]> => {
    const response = await axios.get<ArticleRes>('https://api.nadymama.com/api/users/articles');
    return response.data.data;
};

const fetchSettings = async (): Promise<SettingsRes> => {
    const response = await axios.get<Settings>('https://api.nadymama.com/api/users/settings');
    return response.data.data;
};

// HeroSection Component
const HeroSection: React.FC<{ allCategories: Category[], psoitions: Category[], gouvernorats: Category[]}> = ({ allCategories, psoitions, gouvernorats })  => {
    return (
        <section className="hero">
            <div className="container">
                <div>
                    <div className="text">
                        <p>هل تبحثي عن افضل طبيب اطفال؟</p>
                        <h1>
                            احصلي الان على <span className="highlighted">الطبيب</span>
                            <br />
                            <span className="small">الافضل لطفلك .. بافضل سعر</span>
                        </h1>
                        <div className="btns">
                            <a href="">
                                <span>
                                    حمل التطبيق الان
                                    <br />
                                    من متجر ابل
                                </span>
                                <img src={appleImg} alt="Apple Store" />
                            </a>
                            <a href="">
                                <span>
                                    حمل التطبيق الان
                                    <br />
                                    من متجر جوجل
                                </span>
                                <img src={googleImg} alt="Google Play Store" />
                            </a>
                        </div>
                        <p>حملي تطبيق نادي ماما لمميزات وخدمات اكتر</p>
                    </div>
                </div>
                <div>
                <form action="/doctors" >
                    <div className="form-body"  style={{paddingTop: 32, paddingBottom: 32}}>
                        <div className="input-group">
                            <input type="text" name="name" id="name" placeholder="اكتبي اسم الطبيب " />
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-stethoscope"
                                width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50"
                                fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M6 4h-1a2 2 0 0 0 -2 2v3.5h0a5.5 5.5 0 0 0 11 0v-3.5a2 2 0 0 0 -2 -2h-1" />
                                <path d="M8 15a6 6 0 1 0 12 0v-3" />
                                <path d="M11 3v2" />
                                <path d="M6 3v2" />
                                <path d="M20 10m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                            </svg>
                        </div>
                        <div className="input_row">
                            <select name="category" id="category" className="input">
                                <option value="">القسم</option>
                                {
                                    allCategories.map(cat => (
                                        <option value={cat.id}>{cat.name}</option>
                                    ))
                                }
                            </select>
                            <select name="position" id="position" className="input">
                                <option value="">التخصص</option>
                                {
                                    psoitions.map(cat => (
                                        <option value={cat.id}>{cat.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <select name="gouvernorat" id="gouvernorat" className="input">
                            <option value="">المدينة</option>
                            {
                                gouvernorats.map(cat => (
                                    <option value={cat.id}>{cat.name}</option>
                                ))
                            }
                        </select>
                        <button type="submit">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-search"
                                width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50"
                                fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                                <path d="M21 21l-6 -6" />
                            </svg>
                            بحث
                        </button>
                    </div> 
                </form>
                </div>
            </div>
        </section>
    );
};

// BlogSlider Component
const BlogSlider: React.FC <{ aritcles: Article[]}> = ({ aritcles }) => {
    return (
        <section className="slider posts_slider">
            <div className="container">
                <div className="head">
                    <h2>
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-blockquote" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M6 15h15" />
                            <path d="M21 19h-15" />
                            <path d="M15 11h6" />
                            <path d="M21 7h-6" />
                            <path d="M9 9h1a1 1 0 1 1 -1 1v-2.5a2 2 0 0 1 2 -2" />
                            <path d="M3 9h1a1 1 0 1 1 -1 1v-2.5a2 2 0 0 1 2 -2" />
                        </svg>
                        جديد المدونة
                    </h2>
                    <Link to="/blog">عرض المقالات</Link>
                </div>
                <div className="slider-parent">
                    <Swiper
                        spaceBetween={50}
                        slidesPerView={1}
                        navigation={true}
                        modules={[Pagination, Navigation]}
                        pagination={{ clickable: true }}
                        breakpoints={{
                            550: {
                                slidesPerView: 2,
                                spaceBetween: 30,
                            },
                            767: {
                                slidesPerView: 3,
                                spaceBetween: 30,
                            },
                            992: {
                                slidesPerView: 4,
                                spaceBetween: 20,
                            },
                        }}
                        className="secSwiper"
                    >
                        {
                            aritcles && (
                                aritcles.map(article => (
                                    <SwiperSlide>
                                        <Link to={`article/${article.id}`}>
                                            <div className="thumbnail">
                                                <img src={"https://api.nadymama.com/public/storage/" + article.thumbnail} alt="Post 1" />
                                            </div>
                                            <div className="text">
                                                <h3>{article.title}</h3>
                                                <p>{article.brief}</p>
                                            </div>
                                        </Link>
                                    </SwiperSlide>
                                ))
                            )
                        }
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

// DoctorsSlider Component
const DoctorsSlider: React.FC<{ doctors: Doctor[], catName: string, catId: number }> = ({ doctors, catName, catId }) => {
    return (
        <section className="slider">
            <div className="container">
                <div className="head">
                    <h2>
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-heartbeat" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M19.5 13.572l-7.5 7.428l-2.896 -2.868m-6.117 -8.104a5 5 0 0 1 9.013 -3.022a5 5 0 1 1 7.5 6.572" />
                            <path d="M3 13h2l2 3l2 -6l1 3h3" />
                        </svg>
                        افضل اطباء {catName}
                    </h2>
                    <Link to={'/category/' + catId + '/' + catName}>عرض المزيد</Link>
                </div>
                <div className="slider-parent">
                    <Swiper
                        spaceBetween={50}
                        slidesPerView={1}
                        navigation={true}
                        modules={[Pagination, Navigation]}
                        pagination={{ clickable: true }}
                        breakpoints={{
                            550: {
                                slidesPerView: 2,
                                spaceBetween: 30,
                            },
                            767: {
                                slidesPerView: 3,
                                spaceBetween: 30,
                            },
                            992: {
                                slidesPerView: 4,
                                spaceBetween: 20,
                            },
                        }}
                        className="secSwiper"
                    >
                        {doctors.map((doctor) => (
                            <SwiperSlide key={doctor.id}>
                                <div className="thumbnail">
                                    <img src={doctor.photo ? 'https://api.nadymama.com/public/storage/' + doctor.photo : ''} alt={doctor.name} />
                                    <span className="title">{doctor.degree}</span>
                                </div>
                                <div className="text">
                                    <p>
                                        <strong>{doctor.name}</strong>
                                        <br />
                                        {doctor.position.name}
                                    </p>
                                    <Link to={`/doctor/${doctor.id}`}>عرض التفاصيل</Link>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

// Home Component
const Home: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [psoitions, setPositions] = useState<Category[]>([]);
    const [gouvernorats, setGouvernorats] = useState<Category[]>([]);
    const [articles, setArticles] = useState<Article[]>([]);
    const [settings, setSettings] = useState<SettingsRes>();
    const [firstCategoryDoctors, setFirstCategoryDoctors] = useState<Doctor[]>([]);
    const [firstCategoryName, setFirstCategoryName] = useState<string>('');
    const [firstCategoryId, setFirstCategoryId] = useState<number>(0);
    const [otherCategories, setOtherCategories] = useState<Category[]>([]);

    useEffect(() => {
        const getCategories = async () => {
            try {
                const data = await fetchCategories();
                setCategories(data);
                if (data.length > 0) {
                    setFirstCategoryDoctors(data[0].doctors);
                    setFirstCategoryName(data[0].name);
                    setFirstCategoryId(data[0].id);
                    setOtherCategories(data.slice(1));
                }
            } catch (error) {
                console.error('Error fetching the categories:', error);
            }
        };
        const getArticles = async () => {
            try {
                const data = await fetchArticles();
                setArticles(data);
            } catch (error) {
                console.error('Error fetching the Articles:', error);
            }
        };
        const getCategoriesAlone = async () => {
            try {
                const data = await fetchCategoriesAlone();
                setAllCategories(data);
            } catch (error) {
                console.error('Error fetching the Articles:', error);
            }
        };
        const getPositions = async () => {
            try {
                const data = await fetchPositions();
                setPositions(data);
            } catch (error) {
                console.error('Error fetching the Articles:', error);
            }
        };
        const getGouvernorats = async () => {
            try {
                const data = await fetchGouvernorats();
                setGouvernorats(data);
            } catch (error) {
                console.error('Error fetching the Articles:', error);
            }
        };
        const getSettings = async () => {
            try {
                const data = await fetchSettings();
                setSettings(data);
            } catch (error) {
                console.error('Error fetching the Articles:', error);
            }
        };
        getSettings();
        getGouvernorats();
        getPositions();
        getCategoriesAlone();
        getArticles();
        getCategories();
    }, []);

    return (
        <DefaultLayout>
            <HeroSection allCategories={allCategories} psoitions={psoitions} gouvernorats={gouvernorats}/>
            {firstCategoryDoctors.length > 0 && <DoctorsSlider doctors={firstCategoryDoctors} catName={firstCategoryName} catId={firstCategoryId} />}
            <section className="ad">
                <div className="container">
                    <div className="img">
                        <img src={"https://api.nadymama.com/public/storage/" + settings?.ad_user_one} alt="Advertisement" />
                    </div>
                </div>
            </section>
            {otherCategories.map((category) => (
                <DoctorsSlider key={category.id} doctors={category.doctors} catName={category.name} catId={category.id} />
            ))}
            <BlogSlider aritcles={articles} />
            <section className="ad">
                <div className="container">
                    <div className="img">
                        <img src={"https://api.nadymama.com/public/storage/" + settings?.ad_user_two} alt="Advertisement" />
                    </div>
                </div>
            </section>
        </DefaultLayout>
    );
};

export default Home;
