import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router';
import logo from '~/assets/Frame 1.svg';
import './NextHeader.css';
import {useI18n} from '~/lib/i18n';

export function NextHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const {locale, setLocale, t} = useI18n();

  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(min-width: 769px)').matches
      : true,
  );

  const languageRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(min-width: 769px)');
    const updateMatch = () => setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener('change', updateMatch);
    updateMatch();
    return () => mediaQuery.removeEventListener('change', updateMatch);
  }, []);

  // Close dropdowns when route changes
  useEffect(() => {
    setIsLanguageOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      if (languageRef.current && !languageRef.current.contains(target)) {
        setIsLanguageOpen(false);
      }

      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const scrollToServiceGrid = useCallback(() => {
    const element = document.getElementById('service-grid');
    if (element) {
      element.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  }, []);

  const handleServicesClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      if (location.pathname !== '/') {
        navigate('/#service-grid');
        // Allow navigation to complete before trying to scroll
        setTimeout(scrollToServiceGrid, 50);
      } else {
        scrollToServiceGrid();
      }
    },
    [location.pathname, navigate, scrollToServiceGrid],
  );

  const handleContactClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      window.open(
        'https://u3o0jbl2.forms.app/meama-next',
        '_blank',
        'noopener,noreferrer',
      );
    },
    [],
  );

  const handleGraduatesClick = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const languageOptions = useMemo(
    () => [
      {
        code: 'ka' as const,
        label: isDesktop
          ? t('header.languageFullGeorgian', 'ქართული')
          : t('header.languageShortGeorgian', 'ქარ'),
      },
      {
        code: 'en' as const,
        label: isDesktop
          ? t('header.languageFullEnglish', 'English')
          : t('header.languageShortEnglish', 'Eng'),
      },
      {
        code: 'ru' as const,
        label: isDesktop
          ? t('header.languageFullRussian', 'Русский')
          : t('header.languageShortRussian', 'Рус'),
      },
    ],
    [isDesktop, t],
  );

  const currentLanguageLabel =
    languageOptions.find((option) => option.code === locale)?.label ||
    languageOptions[0].label;

  return (
    <header className="next-header">
      <div className="next-header__top-line"></div>

      <div className="next-header__container">
        {/* Left section: Logo */}
        <div className="next-header__left">
          <Link to="/" className="next-header__logo-link">
            <img src={logo} alt="MEAMA" className="next-header__logo" />
          </Link>
        </div>

        {/* Middle section: Desktop nav */}
        <div className="next-header__middle">
          <Link
            to="/#service-grid"
            className="next-header__georgian-link"
            onClick={handleServicesClick}
          >
            {t('header.navDirections', 'მიმართულებები')}
          </Link>

          <Link
            to="/contact"
            className="next-header__georgian-link"
            onClick={handleContactClick}
          >
            {t('header.navContact', 'კონტაქტი')}
          </Link>

          <Link
            to="/graduates"
            className="next-header__georgian-link"
            onClick={handleGraduatesClick as any}
          >
            {t('header.navGraduates', 'კურსდამთავრებულები')}
          </Link>
        </div>


        {/* Right section: Language selector */}
        <div className="next-header__right">
          <div
            className="next-header__language-wrapper"
            ref={languageRef}
            onMouseEnter={() => {
              if (isDesktop) setIsLanguageOpen(true);
            }}
            onMouseLeave={() => {
              if (isDesktop) setIsLanguageOpen(false);
            }}
          >
            <button
              className="next-header__language"
              aria-haspopup="true"
              aria-expanded={isLanguageOpen}
              onClick={() => {
                setIsLanguageOpen((open) => !open);
                setIsMobileMenuOpen(false);
              }}
            >
              <svg
                className="next-header__globe"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path
                  d="M8 1C9.5 3 10.5 5.5 10.5 8C10.5 10.5 9.5 13 8 15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path
                  d="M8 1C6.5 3 5.5 5.5 5.5 8C5.5 10.5 6.5 13 8 15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
                <line
                  x1="1"
                  y1="8"
                  x2="15"
                  y2="8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>

              <span className="next-header__language-text next-header__language-text--full">
                {currentLanguageLabel}
              </span>
              <span className="next-header__language-text next-header__language-text--short">
                {currentLanguageLabel}
              </span>

              <svg
                className="next-header__chevron"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 4.5L6 7.5L9 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </button>

            <div
              className={`next-header__language-menu ${
                isLanguageOpen ? 'is-open' : ''
              }`}
              role="menu"
            >
              {languageOptions.map(({code, label}) => (
                <button
                  key={code}
                  className="next-header__language-option"
                  role="menuitem"
                  onClick={() => {
                    setLocale(code);
                    setIsLanguageOpen(false);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile hamburger (only visible on mobile) */}
          <div className="next-header__mobileMenuWrap" ref={mobileMenuRef}>
            <button
              type="button"
              className="next-header__hamburger"
              aria-label="Open menu"
              aria-haspopup="true"
              aria-expanded={isMobileMenuOpen}
              onClick={() => {
                setIsMobileMenuOpen((open) => !open);
                // Don’t keep both dropdowns open
                setIsLanguageOpen(false);
              }}
            >
              <span className="next-header__hamburger-line" />
              <span className="next-header__hamburger-line" />
              <span className="next-header__hamburger-line" />
            </button>

            <div
              className={`next-header__mobile-menu ${
                isMobileMenuOpen ? 'is-open' : ''
              }`}
              role="menu"
            >
              <Link
                to="/graduates"
                className="next-header__mobile-menu-link"
                role="menuitem"
                onClick={handleGraduatesClick}
              >
                {t('header.navGraduates', 'კურსდამთავრებულები')}
              </Link>

              <Link
                to="/#service-grid"
                className="next-header__mobile-menu-link"
                role="menuitem"
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  handleServicesClick(e);
                }}
              >
                {t('header.navDirections', 'მიმართულებები')}
              </Link>

              <Link
                to="/contact"
                className="next-header__mobile-menu-link"
                role="menuitem"
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  handleContactClick(e);
                }}
              >
                {t('header.navContact', 'კონტაქტი')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
