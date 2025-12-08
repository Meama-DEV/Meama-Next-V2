import {Link} from 'react-router';
import logo from '~/assets/Frame 1.svg';
import phoneIcon from '~/assets/phone-call-phone-svgrepo-com.svg';
import './NextFooter.css';
import {useI18n} from '~/lib/i18n';

export function NextFooter() {
  const {t} = useI18n();

  return (
    <footer className="next-footer">
      <div className="next-footer__container">
        {/* Left section: Logo + MEAMA + Separator + NEXT */}
        <div className="next-footer__left">
          <Link to="/" className="next-footer__logo-link">
            <img src={logo} alt="MEAMA" className="next-footer__logo" />
            {/* <span className="next-footer__brand">MEAMA</span>
            <span className="next-footer__separator"></span>
            <span className="next-footer__next">NEXT</span> */}
          </Link>
        </div>

        {/* Right section: Contact information */}
        <div className="next-footer__right">
          <div className="next-footer__contact-heading">
            {t('footer.contact', 'კონტაქტი:')}
          </div>
          
          <div className="next-footer__contact-item">
            <img 
              src={phoneIcon} 
              alt="Phone" 
              className="next-footer__icon next-footer__icon--phone"
            />
            <span className="next-footer__contact-text">
              {t('footer.phone', '0322800808')}
            </span>
          </div>

          <div className="next-footer__contact-item">
            <svg
              className="next-footer__icon"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="2"
                y="4"
                width="12"
                height="8"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M2 5l6 4 6-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            <span className="next-footer__contact-text">
              {t('footer.email', 'INFO@MEAMACOLLECT.GE')}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

