import WelcomeAnimation from "@/components/WelcomeAnimation";
import useFetchData from "@/hooks/useFetchData";
import Head from "next/head";
import { FaTelegramPlane, FaDownload, FaFilm, FaHome, FaSearch, FaTv, FaArrowRight } from "react-icons/fa";
import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import "swiper/css/autoplay";
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import "swiper/swiper-bundle.css";
import { Pagination, Navigation, Autoplay, FreeMode } from 'swiper/modules';
import Link from "next/link";
import { useRouter } from "next/router";
import { IoClose } from "react-icons/io5";

// ──────────────────────────────────────────────────────────────
// Play-Button Loader (used for hero + individual cards)
// ──────────────────────────────────────────────────────────────
const PlayButtonLoader = ({ size = 60, containerClass = "" }) => (
  <div className={`flex items-center justify-center ${containerClass}`}>
    <svg viewBox="0 0 100 100" style={{ width: size, height: size, animation: 'pulse 1.6s ease-in-out infinite' }}>
      <circle cx="50" cy="50" r="42" fill="none" stroke="#ff4d4d" strokeWidth="4"
        strokeDasharray="280" strokeDashoffset="280"
        style={{ animation: 'dash 2s linear infinite' }} />
      <path d="M 38 30 L 38 70 L 68 50 Z" fill="#ff4d4d"
        style={{ animation: 'bounce 1.6s ease-in-out infinite' }} />
    </svg>
    <style jsx>{`
      @keyframes dash { to { stroke-dashoffset: 0; } }
      @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }
      @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
    `}</style>
  </div>
);

// ──────────────────────────────────────────────────────────────
// Card with per-image loader
// ──────────────────────────────────────────────────────────────
const MovieCard = ({ movie }) => {
  const [imgLoading, setImgLoading] = useState(true);

  return (
    <div className="card">
      <Link href={`/movies/${movie.slug}`}>
        <div className="cardimg relative">
          {imgLoading && (
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
              <PlayButtonLoader size={48} />
            </div>
          )}
          <img
            src={movie.smposter}
            alt={movie.title}
            loading="lazy"
            onLoad={() => setImgLoading(false)}
            onError={() => setImgLoading(false)}
            style={{ display: imgLoading ? 'none' : 'block' }}
          />
        </div>
        <div className="contents">
          <div className="title-row">
            <h5>{movie.title}</h5>
            <span className="type">{movie.type}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────
// Genre List
// ──────────────────────────────────────────────────────────────
const genreList = [
  { name: "action", img: "/img/action.jpg" },
  { name: "adventure", img: "/img/adventure.jpg" },
  { name: "comedy", img: "/img/comedy.jpg" },
  { name: "family", img: "/img/family.jpg" },
  { name: "romance", img: "/img/romance.jpg" },
  { name: "horror", img: "/img/horror.jpg" },
  { name: "crime", img: "/img/crime.jpg" },
  { name: "drama", img: "/img/drama.jpg" },
  { name: "fantasy", img: "/img/fantasy.jpg" },
  { name: "science_fiction", img: "/img/scifi.jpg" },
];

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [navbar, setNavbar] = useState(false);
  const [searchbar, setSearchbar] = useState(false);
  const [movieshortname, setMovieshortname] = useState("");
  const searchRef = useRef(null);

  // Token validation
  useEffect(() => {
    const storedValidToken = localStorage.getItem("validToken");
    const storedExpirationTime = localStorage.getItem("validTokenExpiration");
    if (
      storedValidToken !== "true" ||
      !storedExpirationTime ||
      Date.now() > parseInt(storedExpirationTime)
    ) {
      router.push("/");
    }
  }, [router]);

  // Simulate initial app load
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  // Fetch movies
  const { alldata, loading } = useFetchData("/api/getmovies");
  const publishedData = (alldata || []).filter(ab => ab.status === "publish");

  // Search
  const searchResult = movieshortname.trim()
    ? publishedData.filter(m => m.title.toLowerCase().includes(movieshortname.toLowerCase()))
    : [];

  // Close search on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setMovieshortname("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navbar handlers
  const handleSearchbarClose = () => setSearchbar(false);

  // Sticky header
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector("nav");
      header?.classList.toggle("sticky", window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="spinner">
          <div className="circle c1"></div>
          <div className="circle c2"></div>
          <div className="circle c3"></div>
          <div className="circle c4"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Cinema Talkiez</title>
        <meta name="description" content="Next Js Movie App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/img/appicon.jpg" />
      </Head>

      <nav className="header">
        <h1 className="logo1">
          <div className="logo-container">
            <img src="/img/appicon.jpg" alt="Logo" className="logo-img" />
            <span>Cinema Talkiez</span>
          </div>
        </h1>

        {/* Bottom Navigation */}
        <div className="bottom-navigation">
          <ul>
            <li><Link href="/" onClick={handleSearchbarClose}><FaHome /><span>Home</span></Link></li>
            <li><Link href="/Anime" onClick={handleSearchbarClose}><FaTv /><span>Anime</span></Link></li>
            <li><Link href="/search"><FaSearch /><span>Search</span></Link></li>
            <li><Link href="/all" onClick={handleSearchbarClose}><FaFilm /><span>All</span></Link></li>
            <li>
              <a href="https://t.me/+gZwK3ZfUANxiYjk1" target="_blank" rel="noopener noreferrer">
                <FaTelegramPlane /><span>Updates</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <div>
        {/* ───── HERO SWIPER WITH LOADER ───── */}
        {loading ? (
          <div className="slideimagebx1 relative bg-gray-900" style={{ minHeight: '400px' }}>
            <PlayButtonLoader size={80} containerClass="absolute inset-0" />
          </div>
        ) : publishedData.length > 0 ? (
          <Swiper
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            speed={1200}
            pagination={{ clickable: true }}
            modules={[Pagination, Autoplay, Navigation]}
            onSwiper={(s) => !s.autoplay.running && s.autoplay.start()}
          >
            {publishedData.slice(0, 3).map((movie) => (
              <SwiperSlide key={movie._id}>
                <div className="slideimagebx1">
                  <img src={movie.bgposter} alt={movie.title} loading="lazy" className="bgposter" />
                  <div className="content1">
                    <div className="contentflex1">
                      <div className="smposter1">
                        <img src={movie.smposter} alt={movie.title} loading="lazy" />
                      </div>
                      <div className="details1">
                        <h1>{movie.title}</h1>
                        <Link href={`/movies/${movie.slug}`}>
                          <button className="btn_download1">
                            <FaDownload /> DOWNLOAD
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="text-center py-10">No movies available</p>
        )}

        {/* ───── GENRES (SMOOTH) ───── */}
        <h1 className="logo4">Genres</h1>
        <div className="category-icons-scroll">
          <Swiper
            modules={[FreeMode, Pagination, Navigation, Autoplay]}
            freeMode={{ enabled: true, momentum: true, momentumRatio: 0.6 }}
            slidesPerView={5}
            spaceBetween={30}
            loop
            grabCursor
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            breakpoints={{
              1587: { slidesPerView: 8 },
              1500: { slidesPerView: 7 },
              1200: { slidesPerView: 6 },
              1040: { slidesPerView: 5 },
              768:  { slidesPerView: 4 },
              650:  { slidesPerView: 3 },
              480:  { slidesPerView: 2 },
            }}
          >
            {genreList.map((g) => (
              <SwiperSlide key={g.name} className="category-item">
                <Link href={`/${g.name}`} onClick={handleSearchbarClose}>
                  <div className="icon">
                    <img src={g.img} alt={g.name} loading="lazy" />
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* ───── NEWLY RELEASED ───── */}
        <h1 className="logo5">Newly Released</h1>
        <div className="scrollcardssec">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 p-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card bg-gray-800 rounded-lg overflow-hidden">
                  <div className="cardimg aspect-[2/3] bg-gray-900 flex items-center justify-center">
                    <PlayButtonLoader size={48} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Swiper
              slidesPerView={4}
              spaceBetween={50}
              loop={false}
              modules={[Pagination, Navigation, Autoplay]}
              breakpoints={{
                1587: { slidesPerView: 8 },
                1500: { slidesPerView: 7 },
                1200: { slidesPerView: 6 },
                1040: { slidesPerView: 5 },
                768:  { slidesPerView: 4 },
                650:  { slidesPerView: 3 },
                480:  { slidesPerView: 2 },
              }}
            >
              {publishedData.map((movie) => (
                <SwiperSlide key={movie.slug}>
                  <MovieCard movie={movie} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        {/* ───── GENRE SECTIONS (PER-CARD LOADER) ───── */}
        {[
          { title: "Action", genre: "action" },
          { title: "Adventure", genre: "adventure" },
          { title: "Comedy", genre: "comedy" },
          { title: "Love & Romantic", genre: "romance" },
          { title: "Family", genre: "family" },
          { title: "Drama", genre: "drama" },
          { title: "Crime", genre: "crime" },
          { title: "Horror", genre: "horror" },
          { title: "Thriller", genre: "thriller" },
          { title: "Fantasy", genre: "fantasy" },
          { title: "Science-Fiction", genre: "science_fiction" },
        ].map(({ title, genre }) => {
          const filtered = publishedData.filter(m => m.genre.includes(genre));
          return (
            <div key={genre}>
              <h1 className="logo3">{title} Movies</h1>
              <div className="scrollcardssec">
                {loading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 p-4">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="card bg-gray-800 rounded-lg overflow-hidden">
                        <div className="cardimg aspect-[2/3] bg-gray-900 flex items-center justify-center">
                          <PlayButtonLoader size={48} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Swiper
                    slidesPerView={4}
                    spaceBetween={50}
                    loop={false}
                    autoplay={{ delay: 3000, disableOnInteraction: true }}
                    modules={[Pagination, Navigation, Autoplay]}
                    breakpoints={{
                      1587: { slidesPerView: 8 },
                      1500: { slidesPerView: 7 },
                      1200: { slidesPerView: 6 },
                      1040: { slidesPerView: 5 },
                      768:  { slidesPerView: 4 },
                      650:  { slidesPerView: 3 },
                      480:  { slidesPerView: 2 },
                    }}
                  >
                    {filtered.map((movie) => (
                      <SwiperSlide key={movie.slug}>
                        <MovieCard movie={movie} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
              </div>
            </div>
          );
        })}

        {/* All Movies Button */}
        <div className="nextpagelink">
          <Link href='/all'>
            <button className="cssbuttons_io_button">
              All
              <div className="icon"><FaArrowRight /></div>
            </button>
          </Link>
        </div>
      </div>
    </>
  );
          }
