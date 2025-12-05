import {Link} from 'react-router';
import logo from '~/assets/Frame 1.svg';
import './NextHeader.css';

export function NextHeader() {
  return (
    <header className="next-header">
      <div className="next-header__top-line"></div>
      <div className="next-header__container">
        {/* Left section: Logo + MEAMA + Separator + NEXT */}
        <div className="next-header__left">
          <Link to="/" className="next-header__logo-link">
            <img src={logo} alt="MEAMA" className="next-header__logo" />
            {/* <span className="next-header__brand">MEAMA</span>
            <span className="next-header__separator"></span>
            <span className="next-header__next">NEXT</span> */}
          </Link>
        </div>

        {/* Middle section: Georgian text */}
        <div className="next-header__middle">
          <Link to="/trends" className="next-header__georgian-link">
            მიმართულებები
          </Link>
          <Link to="/contact" className="next-header__georgian-link">
            კონტაქტი
          </Link>
        </div>

        {/* Right section: Language selector */}
        <div className="next-header__right">
          <button className="next-header__language">
            <svg
              className="next-header__globe"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M8 1C9.5 3 10.5 5.5 10.5 8C10.5 10.5 9.5 13 8 15" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M8 1C6.5 3 5.5 5.5 5.5 8C5.5 10.5 6.5 13 8 15" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <line x1="1" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <span className="next-header__language-text next-header__language-text--full">ENGLISH</span>
            <span className="next-header__language-text next-header__language-text--short">ENG</span>
            <svg
              className="next-header__chevron"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

