import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import logo from "./../../imgs/logo.jpg"
import axios from 'axios';
import { API_URL } from '../../_env';
import { clearCredentials, setCredentials } from '../../features/auth/authSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
interface Category {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}
const Header = () => {
    const name = useSelector((state: RootState) => state.auth.name);
    const isAuth = useSelector((state: RootState) => state.auth.isAuthentication);
    const [showMorePopUp, setShowMorePopUp] = useState(false);
    const [showCats, setShowCats] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [showGetGodePopUp, setShowGetCodePopUp] = useState(false);
    const [showEnterCodePopUp, setShowEnterCodePopUp] = useState(false);
    const [showEnterPasswordPopuo, setShowEnterpasswordPopup] = useState(false);
    const [showVerifyPopup, setVerifyPopup] = useState(false);
    const [showRegisterPopup, setShowRegisterPopup] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [token, setToken] = useState('')
    const [code, setCode] = useState('')
    const [ResetPasswordEmail, SetResetPasswordEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newPasswordConfrirmation, setNewPasswordConfirmation] = useState('')
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        login_email: '',
        login_password: ''
    });
    const tokenRef = useRef('')
    useEffect(() => {
        tokenRef.current = token
    }, [token])

    const togglePopup = (popup: string) => {
        if (popup === 'register') {
            setShowRegisterPopup(!showRegisterPopup);
        } else if (popup === 'login') {
            setShowLoginPopup(!showLoginPopup);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleChangeCode = (e: ChangeEvent<HTMLInputElement>) => {
        setCode(e.target.value)
    };

    const handleChangeResetPasswordEmail = (e: ChangeEvent<HTMLInputElement>) => {
        SetResetPasswordEmail(e.target.value)
    };

    const handleChangeNewPassword = (e: ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value)
    };

    const handleChangeNewPasswordConfirmation = (e: ChangeEvent<HTMLInputElement>) => {
        setNewPasswordConfirmation(e.target.value)
    };

    const dispatch = useDispatch();
    const validateForm = () => {
        const { name, email, phone, password, password_confirmation } = formData;
        if (!name || !email || !phone || !password || !password_confirmation) {
            toast.error('جميع الحقول مطلوبة');
            return false;
        }
        if (password !== password_confirmation) {
            toast.error('كلمة المرور وتأكيد كلمة المرور غير متطابقين');
            return false;
        }
        return true;
    };

    const askForValidationCode = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/users/user/ask-email-verification-code`, {
                headers: {
                    "Authorization": `Bearer ${tokenRef.current}`
                }
            });
            if (response.status === 204) {
                toast.error('لا يوجد محتوى من الخادم');
                return;
            }
            if (response.data.success) {
                toast.success('تم ارسال رسالة تاكيد عبر بريدك الاكتروني ');
                setTimeout(() => {
                    setVerifyPopup(true)
                }, 400);
            } else {
                toast.error(response.data.message || 'حدث خطأ أثناء التسجيل');
            }
        } catch (error: any) {
            
            const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء التسجيل';
    
            toast.error(errorMessage);
            console.error(error);
        }
    };

    const verify = async () => {
        try {
            const response = await axios.post(`${API_URL}/api/users/user/verify-email`, {
                code: code,
            }, {
                headers: {
                    "Authorization": `Bearer ${tokenRef.current}`
                }
            });
            if (response.status === 204) {
                toast.error('لا يوجد محتوى من الخادم');
                return;
            }
            if (response.data.success) {
                toast.success('تم تفعيل حسابك بنجاح ');
                dispatch(setCredentials(response.data.data))
                setTimeout(() => {
                    setVerifyPopup(false)
                    setShowRegisterPopup(false)
                    setShowMorePopUp(false)
                }, 400);
            } else {
                toast.error(response.data.errorMessage || 'حدث خطأ أثناء التفعيل');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء التفعيل';
    
            toast.error(errorMessage);
            console.error(error);
        }
    };

    const getCodeReset = async () => {
        try {
            const response = await axios.post(`${API_URL}/api/users/user/ask-for-forgot-password-email-code`, {
                email: ResetPasswordEmail,
            });
            if (response.status === 204) {
                toast.error('لا يوجد محتوى من الخادم');
                return;
            }
            if (response.data.success) {
                toast.success('تم تم ارسال رمز التاكيد عبر بريدك ');
                setTimeout(() => {
                    setShowGetCodePopUp(false)
                    setShowEnterCodePopUp(true)
                    setVerifyPopup(false)
                    setShowRegisterPopup(false)
                    setShowMorePopUp(false)
                }, 400);
            } else {
                toast.error(response.data.errorMessage || 'حدث خطأ ');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'حدث خطأ ';
    
            toast.error(errorMessage);
            console.error(error);
        }
    };


    const CheckCode = async () => {
        try {
            const response = await axios.post(`${API_URL}/api/users/user/forgot-password-check-code`, {
                email: ResetPasswordEmail,
                code: code,
            });
            if (response.status === 204) {
                toast.error('لا يوجد محتوى من الخادم');
                return;
            }
            if (response.data.success) {
                toast.success('تم التاكد من حسابك بنجاح ');
                setTimeout(() => {
                    setShowGetCodePopUp(false)
                    setShowEnterCodePopUp(false)
                    setShowEnterpasswordPopup(true)
                    setVerifyPopup(false)
                    setShowRegisterPopup(false)
                    setShowMorePopUp(false)
                }, 400);
            } else {
                toast.error(response.data.errorMessage || 'حدث خطأ ');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'حدث خطأ ';
    
            toast.error(errorMessage);
            console.error(error);
        }
    };

    const restPassword = async () => {
        try {
            const response = await axios.post(`${API_URL}/api/users/user/forgot-password`, {
                password: newPassword,
                password_confirmation: newPasswordConfrirmation,
                email: ResetPasswordEmail,
                code: code,
            });
            if (response.status === 204) {
                toast.error('لا يوجد محتوى من الخادم');
                return;
            }
            if (response.data.success) {
                toast.success('تم تعين كلمة المرور بنجاح ');
                setTimeout(() => {
                    setShowGetCodePopUp(false)
                    setShowEnterCodePopUp(false)
                    setShowEnterpasswordPopup(false)
                    setVerifyPopup(false)
                    setShowRegisterPopup(false)
                    setShowMorePopUp(false)
                }, 400);
            } else {
                toast.error(response.data.errorMessage || 'حدث خطأ ');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'حدث خطأ ';
    
            toast.error(errorMessage);
            console.error(error);
        }
    };


    const register = async () => {
        if (!validateForm()) {
            return;
        }
        const { name, email, phone, password, password_confirmation } = formData;
        try {
            const response = await axios.post(`${API_URL}/api/users/register`, formData);
            
            if (response.status === 204) {
                toast.error('لا يوجد محتوى من الخادم');
                return;
            }
    
            if (response.data.success) {
                setToken(response.data.data.token);
                toast.success('تم التسجيل بنجاح');
                setTimeout(() => {
                    setShowRegisterPopup(false);
                    setShowMorePopUp(false);
                    askForValidationCode();
                }, 400);
            } else {
                toast.error(response.data.errorMessage || 'حدث خطأ أثناء التسجيل');
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 422) {
                const validationErrors = error.response.data;
                const errors = validationErrors.errors;
                Object.keys(errors).forEach((key) => {
                    toast.error(errors[key][0]);
                });
            } else {
                toast.error('حدث خطأ أثناء التسجيل');
                console.error(error);
            }
        }
    };
    const login = async () => {
        const { login_email, login_password } = formData;

        if (!login_email || !login_password) {
            toast.error('من فضلك ادخل البريد ورمز المرور');
            return false;
        } else {
            try {
                const response = await axios.post(`${API_URL}/api/users/login`, {
                    email: login_email,
                    password: login_password
                });
                if (response.status === 204) {
                    toast.error('لا يوجد محتوى من الخادم');
                    return;
                }
                if (response.data.success) {
                    if (response.data.data.is_email_verified) {

                        dispatch(setCredentials(response.data.data));
                        toast.success('تم التسجيل بنجاح');
                        setTimeout(() => {
                            setShowLoginPopup(false)
                            setShowMorePopUp(false)
                        }, 400);
                    } else {
                        setToken(response.data.data.token)
                        setTimeout(() => {
                            setShowRegisterPopup(false)
                            setShowLoginPopup(false)
                            setShowMorePopUp(false)
                            askForValidationCode()
                        }, 400);        
                    }
                } else {
                    toast.error(response.data.errorMessage || 'حدث خطأ أثناء التسجيل');
                }
            } catch (error) {
                toast.error('فشل التسجيل');
                console.error(error);
            }
        }

    };

    const logout = () => {
        dispatch(clearCredentials())
    };

    const [categories, setCategories] = useState<Category[]>([]);
    useEffect(() => {
        // Fetch categories from API
        const fetchCategories = async () => {
            try {
                const response = await axios.get('https://api.nadymama.com/api/users/categories/all');
                setCategories(response.data.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);


    return (
        <>
            <ToastContainer />
            <header>
                <div className="container">
                    <div>
                        <Link to="/"><img src={logo} alt="" className="logo" /></Link>
                        <nav className={isOpen ? "open" : ''}>
                            <Link to="/">الرئيسية</Link>
                            <Link to="/doctors" className='doctors_link' style={{position: 'relative'}} onClick={(e) => {e.preventDefault();setShowCats(!showCats)}}>
                                الاطباء
                                {
                                    showCats && (
                                        <div className="pop-up">
                                            {categories.map(category => (
                                                <Link to={"/category/" + category.id + '/' + category.name}>{category.name}</Link>
                                            ))}
                                        </div>
                                    )
                                }
                            </Link>
                            <Link to="/blog">المدونة</Link>
                            <Link to="/about">من نحن</Link>
                            <Link to="/contact">اتصل بنا</Link>
                        </nav>
                    </div>
                    <div className="more">
                        {isAuth ? (
                            <div className="profile" style={{ position: "relative" }}>
                                <a href="#" onClick={(e) => { e.preventDefault(); setShowMorePopUp(!showMorePopUp); }}>
                                    <span className="thumbnail">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-user" width="44"
                                            height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none"
                                            strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                                            <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                                        </svg>
                                    </span>
                                    <span className="name">
                                        مرحبا, {name}
                                    </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chevron-down"
                                        width="22" height="22" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none"
                                        strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M6 9l6 6l6 -6" />
                                    </svg>
                                </a>
                                {showMorePopUp && (
                                    <div className="more-pop"
                                        style={{
                                            position: 'absolute',
                                            top: '110%',
                                            zIndex: '9999',
                                            background: 'white',
                                            width: '100%',
                                            padding: '8px 16px',
                                            borderRadius: '4px',
                                            border: '1px solid #121a20'
                                        }}>
                                        <Link to="/account">الحساب</Link>
                                        <a href="#" onClick={(e) => { e.preventDefault(); logout(); }}>تسجيل الخروج</a>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="auth-btns">
                                <button className="login" onClick={() => togglePopup('login')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-login" width="18"
                                        height="18" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#000000" fill="none"
                                        strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M15 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                                        <path d="M21 12h-13l3 -3" />
                                        <path d="M11 15l-3 -3" />
                                    </svg>
                                    دخول
                                </button>
                                <button className="register" onClick={() => togglePopup('register')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-user" width="18"
                                        height="18" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#000000" fill="none"
                                        strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                                        <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                                    </svg>
                                    تسجيل
                                </button>
                            </div>
                        )}
                        <div className="show-menu" onClick={() => {
                            setIsOpen(!isOpen)
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-menu-2" width="44"
                                height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none"
                                strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M4 6l16 0" />
                                <path d="M4 12l16 0" />
                                <path d="M4 18l16 0" />
                            </svg>
                        </div>
                    </div>
                </div>
            </header>
            {
                (showLoginPopup || showRegisterPopup || showVerifyPopup || showEnterCodePopUp || showEnterPasswordPopuo || showGetGodePopUp) && (
                    <div className="hide-content" onClick={() => { setShowLoginPopup(false); setShowRegisterPopup(false); setVerifyPopup(false); setShowEnterCodePopUp(false); setShowEnterCodePopUp(false);setShowEnterpasswordPopup(false) }}></div>
                )
            }
            {showRegisterPopup && (
                <div className="register-popup">
                    <h2>انشاء حساب</h2>
                    <div className="input-group">
                        <input type="text" name="name" id="name" placeholder="الاسم" value={formData.name} onChange={handleInputChange} />
                    </div>
                    <div className="input-group">
                        <input type="email" name="email" id="email" placeholder="البريد الالكتروني" value={formData.email} onChange={handleInputChange} />
                    </div>
                    <div className="input-group">
                        <input type="text" name="phone" id="phone" placeholder="رقم الهاتف" value={formData.phone} onChange={handleInputChange} />
                    </div>
                    <div className="input-group">
                        <input type="password" name="password" id="password" placeholder="كلمة المرور" value={formData.password} onChange={handleInputChange} />
                    </div>
                    <div className="input-group">
                        <input type="password" name="password_confirmation" id="password_confirmation" placeholder="تاكيد كلمة المرور المرور" value={formData.password_confirmation} onChange={handleInputChange} />
                    </div>
                    <button className="submit" onClick={register}>تسجيل</button>
                </div>
            )}
            {showVerifyPopup && (
                <div className="register-popup" style={{maxWidth: 350}}>
                    <h2>ادخل رمز التاكيد</h2>
                    <p style={{textAlign: 'center', marginBottom: 16}}>تم ارسال رمز التاكيد عبر البريد الاكتروني الخاص بك!</p>
                    <div className="input-group">
                        <input type="text" name="code" id="code" placeholder="الرمز" value={code} onChange={handleChangeCode} />
                    </div>
                    <button className="submit" onClick={verify}>انهاء</button>
                </div>
            )}
            {showGetGodePopUp && (
                <div className="register-popup" style={{maxWidth: 350}}>
                    <h2>ادخل بريدك الالكتروني</h2>
                    <p style={{textAlign: 'center', marginBottom: 16}}>ادخل بريدك الاكتروني لتلقي رمز التاكيد!</p>
                    <div className="input-group">
                        <input type="text" name="email" id="email" placeholder="البريد الالكتروني" value={ResetPasswordEmail} onChange={handleChangeResetPasswordEmail} />
                    </div>
                    <button className="submit" onClick={getCodeReset}>استلام الرمز</button>
                </div>
            )}
            {showEnterCodePopUp && (
                <div className="register-popup" style={{maxWidth: 350}}>
                    <h2>ادخل رمز التاكيد </h2>
                    <p style={{textAlign: 'center', marginBottom: 16}}>ادخل رمز التاكيد المرسل عبر بريدك الالكتروني!</p>
                    <div className="input-group">
                        <input type="text" name="code" id="code" placeholder="رمز التاكيد" value={code} onChange={handleChangeCode} />
                    </div>
                    <button className="submit" onClick={CheckCode}>تاكيد</button>
                </div>
            )}
            {showEnterPasswordPopuo && (
                <div className="register-popup" style={{maxWidth: 350}}>
                    <h2>تعين كلمة مرور جديدة </h2>
                    <div className="input-group">
                        <input type="password" name="password" id="password_confirmation" placeholder="كلمة المرور الجديدة" value={newPassword} onChange={handleChangeNewPassword} />
                        <input type="password" name="password_confrimation" id="password_confirmation" placeholder="تاكيد كلمة المرور الجديدة" value={newPasswordConfrirmation} onChange={handleChangeNewPasswordConfirmation} />
                    </div>
                    <button className="submit" onClick={restPassword}>تاكيد</button>
                </div>
            )}
            {showLoginPopup && (
                <div className="login-popup">
                    <h2>تسجيل الدخول</h2>
                    <div className="input-group">
                        <input type="text" name="login_email" id="login_email" placeholder="البريد الالكتروني" value={formData.login_email} onChange={handleInputChange} />
                    </div>
                    <div className="input-group">
                        <input type="password" name="login_password" id="login_password" placeholder="كلمة المرور" value={formData.login_password} onChange={handleInputChange} />
                    </div>
                    <button className="submit" onClick={login}>دخول</button>
                    <button style={{width: "100%", background: 'transparent', border: 'none', textDecoration: 'underline', marginTop: 12, cursor: 'pointer'}} onClick={() => {
                        setShowLoginPopup(false)
                        setShowGetCodePopUp(true)
                    }}>هل نسيت كلمة المرور؟</button>
                </div>
            )}
        </>
    );
};

export default Header;
