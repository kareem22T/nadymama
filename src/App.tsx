import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Loader from './common/Loader';
import Home from './pages/home/home';
import "./css/main.css"
import Doctors from './pages/doctors';
import Category from './pages/category';
import BookingComponent from './pages/doctors/doctor';
import ArticleComponent from './pages/blog/article';
import Blog from './pages/blog';
import { ToastContainer } from 'react-toastify';
import About from './pages/about';
import Contact from './pages/contact';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);
  return loading ? (
    <Loader />
  ) : (
    <>
    <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home />
            </>
          }
        />
      </Routes>
      <Routes>
        <Route
          path="/doctors"
          element={
            <>
              <Doctors />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <About />
            </>
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <Contact />
            </>
          }
        />
        <Route
          path="/category/:id/:name"
          element={
            <>
              <Category />
            </>
          }
        />
        <Route
          path="/doctor/:id"
          element={
            <>
              <BookingComponent />
            </>
          }
        />
        <Route
          path="/article/:id"
          element={
            <>
              <ArticleComponent />
            </>
          }
        />
        <Route
          path="/blog"
          element={
            <>
              <Blog />
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
