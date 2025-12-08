import React, {useEffect, useState} from 'react';
import './LoopingText.css';
import {useI18n} from '~/lib/i18n';

const LoopingText: React.FC = () => {
  const {t} = useI18n();
  const [isVisible, setIsVisible] = useState(false);
  const text = t('loopingText.text', 'OPEN YOUR EYES').toUpperCase();

  useEffect(() => {
    // Flip to visible as soon as we're hydrated so it shows immediately
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const items = Array.from({length: 12}, (_, i) => (
    <span className="looping-text__item" key={i}>
      {text}
    </span>
  ));

  return (
    <div
      className={`looping-text__wrapper ${
        isVisible ? 'looping-text__wrapper--visible' : 'looping-text__wrapper--hidden'
      }`}
    >
      <div className="looping-text__track">
        <div className="looping-text__group">{items}</div>
        <div className="looping-text__group" aria-hidden="true">
          {items}
        </div>
      </div>
    </div>
  );
};

export default LoopingText;
