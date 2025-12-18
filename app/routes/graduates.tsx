import type {Route} from './+types/graduates';
import {useEffect} from 'react';
import {useState} from 'react';
import {useLoaderData} from 'react-router';
import {fetchGraduates} from '~/lib/graduates.server';
import {toGoogleDriveDirectImageUrl} from '~/lib/googleDrive';
import {useI18n} from '~/lib/i18n';

function parseMDY(input: string): Date | null {
  if (!input) return null;
  const [m, d, y] = input.split('/').map(Number);
  if (!m || !d || !y) return null;
  return new Date(y, m - 1, d);
}

function localeToIntl(locale: 'ka' | 'en' | 'ru') {
  if (locale === 'ka') return 'ka-GE';
  if (locale === 'ru') return 'ru-RU';
  return 'en-US';
}

export async function loader({context}: Route.LoaderArgs) {
  const grads = await fetchGraduates(context);

  const enriched = grads
    .map((g) => ({
      ...g,
      img: toGoogleDriveDirectImageUrl(g.img),
      certificationDate: parseMDY(g.certificationDateRaw),
    }))
    .filter((g) => g.certificationDate);

  enriched.sort(
    (a, b) =>
      b.certificationDate!.getTime() -
      a.certificationDate!.getTime(),
  );

  return {graduates: enriched};
}

export default function GraduatesRoute() {
  const {graduates} = useLoaderData<typeof loader>();
  const {locale, t} = useI18n();

  const intlLocale = localeToIntl(locale);

  const monthYearFormatter = new Intl.DateTimeFormat(intlLocale, {
    month: 'long',
    year: 'numeric',
  });

  const cardDateFormatter = new Intl.DateTimeFormat(intlLocale, {
    year: 'numeric',
    month: 'long',
  });


  const groupsMap = new Map<
  string,
  {key: string; title: string; items: typeof graduates}
>();

for (const g of graduates) {
  const d = g.certificationDate!;
  const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  const title = monthYearFormatter.format(d);

  if (!groupsMap.has(key)) {
    groupsMap.set(key, {key, title, items: []});
  }
  groupsMap.get(key)!.items.push(g);
}

// newest first
const groups = Array.from(groupsMap.values()).sort((a, b) =>
  a.key < b.key ? 1 : -1,
);

const hasMultipleGroups = groups.length > 1;

const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const check = () => {
    setIsMobile(window.innerWidth <= 640);
  };

  check();
  window.addEventListener('resize', check);
  return () => window.removeEventListener('resize', check);
}, []);

const [openKeys, setOpenKeys] = useState<Set<string>>(() => new Set());

return (
  <section className="graduates-page">
    <div className="graduates-page__container">
      <h1 className="graduates-page__title">
        {t('graduates.title', 'კურსდამთავრებულები')}
      </h1>

      {groups.map((group) => {
        const isOpen = !hasMultipleGroups || openKeys.has(group.key);

        return (
            <div key={group.key} className="graduates-page__group">
              {hasMultipleGroups ? (
                <button
                  type="button"
                  className="graduates-page__group-toggle"
                  onClick={() => {
                    setOpenKeys((prev) => {
                      if (isMobile) {
                        return prev.has(group.key)
                          ? new Set()
                          : new Set([group.key]);
                      }

                      const next = new Set(prev);
                      if (next.has(group.key)) next.delete(group.key);
                      else next.add(group.key);
                      return next;
                    });
                  }}
                  aria-expanded={isOpen}
                >
                  <span suppressHydrationWarning>{group.title}</span>
                  <span
                    className={
                      'graduates-page__chevron' + (isOpen ? ' is-open' : '')
                    }
                    aria-hidden="true"
                  >
                    ▾
                  </span>
                </button>
              ) : (
                <h2 className="graduates-page__group-title" suppressHydrationWarning>
                  {group.title}
                </h2>
              )}

              <div className={'graduates-acc' + (isOpen ? ' is-open' : '')}>
                <div className="graduates-acc__inner">
                  <div className="graduates-page__grid">
                    {group.items.map((g) => {
                      const displayName = locale === 'ka' ? g.fullNameKa : g.fullNameLatin;

                      return (
                        <article
                          key={g.fullNameKa + g.certificationDateRaw}
                          className="graduate-card"
                        >
                          <div className="graduate-card__imageWrap">
                            <img
                              src={g.img}
                              alt={displayName}
                              className="graduate-card__image"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              crossOrigin="anonymous"
                            />
                          </div>

                          <div className="graduate-card__body">
                            <div className="graduate-card__name" suppressHydrationWarning>
                              {displayName}
                            </div>
                            <div className="graduate-card__date" suppressHydrationWarning>
                              {cardDateFormatter.format(g.certificationDate!)}
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}