import React, { useState, useEffect, ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import DefaultLayout from "../../layout/DefaultLayout";
import { api } from "../../Api";
type Position = {
    name: string
}

interface Doctor {
    id: number;
    name: string;
    description: string;
    username: string;
    password: string;
    photo: string;
    degree: string;
    examination_price: string;
    special_examination_price: string;
    way_of_waiting: string;
    created_at: string;
    updated_at: string;
    specialization_id: number;
    position: Position;
    phones: [
        {
            phone: string
        }
    ]
}

const BookingComponent: React.FC = () => {
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const getDayNameInArabic = (dayIndex: number): string => {
        const dayNames = [
          'الأحد',  // Sunday
          'الإثنين', // Monday
          'الثلاثاء', // Tuesday
          'الأربعاء', // Wednesday
          'الخميس', // Thursday
          'الجمعة', // Friday
          'السبت',   // Saturday
        ];
        return dayNames[dayIndex];
      };
      const formatDate = (date: Date): string => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
      };
      const today = new Date();
      const daysArray = [];
      let currentDate = new Date(today);
      
    // Start from the next day
    currentDate.setDate(currentDate.getDate() + 1);

    while (daysArray.length < 20) {
    // Skip Thursday (4) and Friday (5)
    if (currentDate.getDay() !== 4 && currentDate.getDay() !== 5) {
        daysArray.push({
        date: formatDate(currentDate),
        dayName: getDayNameInArabic(currentDate.getDay()),
        });
    }

    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
    }
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [showBookingPopUp, setShowBookingPopUp] = useState(false);

    const { id } = useParams()
    useEffect(() => {
        fetch("https://api.nadymama.com/api/users/doctor/" + id)
            .then((response) => response.json())
            .then((data) => setDoctor(data))
            .catch((error) => console.error("Error fetching doctor data:", error));
    }, []);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBooking = () => {
        // Handle booking logic here
        setBookingSuccess(true);
    };

    const closeSuccessPopup = () => {
        setBookingSuccess(false);
    };

    const [day, setDay] = useState<any>()
    const [daySelected, setDaySelected] = useState<any>()
    function getNextDayOfWeek(dayOfWeek: string) {
        const daysOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
        const today = new Date();
        const currentDayIndex = today.getDay(); // getDay() returns 0 for Sunday, 1 for Monday, etc.
        const targetDayIndex = daysOfWeek.indexOf(dayOfWeek.toLowerCase());

        if (targetDayIndex === -1) {
            throw new Error("Invalid day of the week");
        }

        // Calculate the difference between today and the target day
        let dayDifference = targetDayIndex - currentDayIndex;

        // If the target day is before or the same as today, add 7 to get the next occurrence
        if (dayDifference <= 0) {
            dayDifference += 7;
        }

        // Calculate the next date
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + dayDifference);

        return nextDate;
    }

    const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
        setDay(event.target.value);
        setDaySelected(event.target.value)
    };
    const handleContinueBooking = () => {
        setShowBookingPopUp(true)
    }
    
    const handleBook = async () => {
        try {
            const response = await api.post('https://api.nadymama.com/api/users/appointments/book', {
                doctor_id: id,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                day: day
            });
            setShowBookingPopUp(false)
            setBookingSuccess(true)
            console.log('Booking successful:', response.data);
        } catch (error) {
            console.error('Error booking:', error);
        }
    }
    return (
        <DefaultLayout>
            {
                showBookingPopUp && (
                    <>
                        <div className="hide-content" onClick={() => { setShowBookingPopUp(false) }}></div>
                        <div className="booking-popup">
                            <h2>بيانات الحجز</h2>
                            <div className="input-group">
                                <input type="text" name="name" id="name" value={formData.name} required onChange={handleChange} placeholder="الاسم" />
                            </div>
                            <div className="input-group">
                                <input type="text" name="email" id="email" value={formData.email} required onChange={handleChange} placeholder="البريد الالكتروني" />
                            </div>
                            <div className="input-group">
                                <input type="text" name="phone" id="phone" value={formData.phone} required onChange={handleChange} placeholder="رقم الهاتف" />
                            </div>
                            <button className="book submit" onClick={handleBook}>حجز</button>
                        </div>
                    </>
                )
            }
            {
                bookingSuccess && (
                    <>
                        <div className="hide-content" onClick={() => { setBookingSuccess(false) }}></div>
                        <div className="success-booking-popup">
                            <h1 style={{ fontSize: "21px", textAlign: "center" }}>تم الحجز بنجاح </h1>
                            <svg style={{ width: "80px", height: "80px", padding: "8px", border: "2px solid #8dc645", borderRadius: "50%", margin: "16px auto", display: "block" }} xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-check" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#8dc645" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M5 12l5 5l10 -10" />
                            </svg>
                            <button className="close-success submit" onClick={() => { setBookingSuccess(false) }}>اغلاق</button>
                        </div>
                    </>
                )
            }
            <section className="doctor">
                <div className="container">
                    <div className="card_wrapper">
                        <div className="image_wrapper">
                            <div className="img">
                                <img src={'https://api.nadymama.com/public/storage/' + doctor?.photo} alt="" />
                                <div className="details">
                                    <h2 className="name">
                                        {doctor?.name}
                                    </h2>
                                    <p>
                                        {doctor?.position?.name}
                                    </p>
                                    <p>
                                        {doctor?.degree}
                                    </p>
                                    {/* <div className="social">
                                        <a href="">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-brand-facebook-filled" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#3b5998" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M18 2a1 1 0 0 1 .993 .883l.007 .117v4a1 1 0 0 1 -.883 .993l-.117 .007h-3v1h3a1 1 0 0 1 .991 1.131l-.02 .112l-1 4a1 1 0 0 1 -.858 .75l-.113 .007h-2v6a1 1 0 0 1 -.883 .993l-.117 .007h-4a1 1 0 0 1 -.993 -.883l-.007 -.117v-6h-2a1 1 0 0 1 -.993 -.883l-.007 -.117v-4a1 1 0 0 1 .883 -.993l.117 -.007h2v-1a6 6 0 0 1 5.775 -5.996l.225 -.004h3z" stroke-width="0" fill="currentColor" />
                                            </svg>
                                        </a>
                                        <a href="">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-link" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#666668" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M9 15l6 -6" />
                                                <path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464" />
                                                <path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463" />
                                            </svg>
                                        </a>
                                        <a href="">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-brand-instagram" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#c65090" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M4 4m0 4a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z" />
                                                <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                                                <path d="M16.5 7.5l0 .01" />
                                            </svg>
                                        </a>
                                    </div> */}
                                </div>
                            </div>
                            <h2>ما هو تقيمك للطبيب؟</h2>
                            {/* <div className="rate">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-star-filled" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" stroke-width="0" fill="currentColor" />
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-star-filled" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" stroke-width="0" fill="currentColor" />
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-star-filled" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" stroke-width="0" fill="currentColor" />
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-star-filled" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" stroke-width="0" fill="currentColor" />
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-star-filled" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" stroke-width="0" fill="currentColor" />
                                </svg>
                            </div> */}
                            <p>متوسط التقيم: 5/5. مرات التقيم: 4</p>
                            <button className="comfirm-booking" style={{ opacity: !day ? .5 : 1 }} disabled={!day} onClick={() => setShowBookingPopUp(true)}>اتمام الحجز</button>
                        </div>
                        <div className="text_wrapper">
                            <p className="desc">
                                {doctor?.description}
                            </p>
                            <p className="price">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-coins" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#5f6264" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M9 14c0 1.657 2.686 3 6 3s6 -1.343 6 -3s-2.686 -3 -6 -3s-6 1.343 -6 3z" />
                                    <path d="M9 14v4c0 1.656 2.686 3 6 3s6 -1.344 6 -3v-4" />
                                    <path d="M3 6c0 1.072 1.144 2.062 3 2.598s4.144 .536 6 0c1.856 -.536 3 -1.526 3 -2.598c0 -1.072 -1.144 -2.062 -3 -2.598s-4.144 -.536 -6 0c-1.856 .536 -3 1.526 -3 2.598z" />
                                    <path d="M3 6v10c0 .888 .772 1.45 2 2" />
                                    <path d="M3 11c0 .888 .772 1.45 2 2" />
                                </svg>
                                سعر الكشف: {doctor?.examination_price} جنيه | <span>سعر ماما: {doctor?.special_examination_price} جنيه</span>
                            </p>
                            <p className="price">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-clock-hour-3" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#5f6264" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                                    <path d="M12 12h3.5" />
                                    <path d="M12 7v5" />
                                </svg>
                                مدة الانتظار:
                                {" " + doctor?.way_of_waiting}
                            </p>
                            <p className="phone">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-phone-call" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#5f6264" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
                                    <path d="M15 7a2 2 0 0 1 2 2" />
                                    <path d="M15 3a6 6 0 0 1 6 6" />
                                </svg>
                                {
                                    doctor?.phones.map((phone, index) => (
                                        <span key={index}>{phone['phone'] + ((index != doctor.phones.length - 1) ? " - " : '')}</span>
                                    ))
                                }
                            </p>
                            <div className="host">
                                <span>حجز موعد مع الطبيب</span>
                                بمجرد قيامك بالحجر على موقع نادي ماما برجاء التوجه لعيادة الطبيب في نفس يوم الحجز من الأسبوع التالي و الدخول بأولوية الحضور للعيادة
                                {/* <div className="slots">
                                    <div className="slot">
                                        <input
                                            type="radio"
                                            name="day"
                                            value="sat"
                                            checked={daySelected === "sat"}
                                            onChange={handleRadioChange}
                                            id="slot_time_1"
                                        />
                                        <label htmlFor="slot_time_1">
                                            {"السبت " + getNextDayOfWeek('sat').toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </label>
                                    </div>
                                    <div className="slot">
                                        <input
                                            type="radio"
                                            name="day"
                                            value="sun"
                                            checked={daySelected === "sun"}
                                            onChange={handleRadioChange}
                                            id="slot_time_2"
                                        />
                                        <label htmlFor="slot_time_2">
                                            {"الأحد " + getNextDayOfWeek('sun').toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </label>
                                    </div>
                                    <div className="slot">
                                        <input
                                            type="radio"
                                            name="day"
                                            value="mon"
                                            checked={daySelected === "mon"}
                                            onChange={handleRadioChange}
                                            id="slot_time_3"
                                        />
                                        <label htmlFor="slot_time_3">
                                            {"الاثنين " + getNextDayOfWeek('mon').toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </label>
                                    </div>
                                    <div className="slot">
                                        <input
                                            type="radio"
                                            name="day"
                                            value="tue"
                                            checked={daySelected === "tue"}
                                            onChange={handleRadioChange}
                                            id="slot_time_4"
                                        />
                                        <label htmlFor="slot_time_4">
                                            {"الثلاثاء " + getNextDayOfWeek('tue').toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </label>
                                    </div>
                                    <div className="slot">
                                        <input
                                            type="radio"
                                            name="day"
                                            value="wed"
                                            checked={daySelected === "wed"}
                                            onChange={handleRadioChange}
                                            id="slot_time_5"
                                        />
                                        <label htmlFor="slot_time_5">
                                            {"الاربعاء " + getNextDayOfWeek('wed').toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </label>
                                    </div>
                                </div> */}
                                <div className="slots">
                                    {daysArray.map((day, index) => (
                                    <div className="slot"  key={index}>
                                    <input
                                        type="radio"
                                        name="day"
                                        value={day.date}
                                        checked={daySelected === day.date}
                                        onChange={handleRadioChange}
                                        id={`slot_time_${index}`}
                                    />
                                    <label htmlFor={`slot_time_${index}`} style={{minWidth: 175, position: 'relative', display: "block"}}>
                                        {`${day.dayName} ${day.date}`}
                                    </label>
                                    </div>
                                ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </DefaultLayout>
    );
};

export default BookingComponent;
