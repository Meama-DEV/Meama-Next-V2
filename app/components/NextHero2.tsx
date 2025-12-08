import './NextHero2.css';
import {useI18n} from '~/lib/i18n';

export function NextHero2() {
  const {t} = useI18n();

  return (
    <section className="next-hero2">
      <h2 className="next-hero2__title">{t('hero2.title', 'ჩვენი პროგრამები')}</h2>
    </section>
  );
}

