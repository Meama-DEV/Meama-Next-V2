import containerImage from '~/assets/Container.png';
import './NextHero.css';
import {useI18n} from '~/lib/i18n';

export function NextHero() {
  const {t} = useI18n();

  return (
    <section className="next-hero">
      <div className="next-hero__background">
        <img
          src={containerImage}
          alt={t('hero.imageAlt', 'Modern building')}
          className="next-hero__image"
        />
      </div>
      <div className="next-hero__content">
        <h1 className="next-hero__heading">
          <span className="next-hero__heading-line">
            {t('hero.headlineLine1', 'დაინახე')}
          </span>
          <span className="next-hero__heading-line">
            {t('hero.headlineLine2', 'შესაძლებლობები')}
          </span>
        </h1>
        <p className="next-hero__text">
          {t('hero.bodyLine1', 'შეისწავლე მეამას ბიზნეს პროცესები და')}
          <br />
          {t('hero.bodyLine2', 'აღმოაჩინე ახალი შესაძლებლობები.')}
        </p>
        <button className="next-hero__button">{t('hero.cta', 'დაიწყე მოგზაურობა')}</button>
      </div>
    </section>
  );
}

