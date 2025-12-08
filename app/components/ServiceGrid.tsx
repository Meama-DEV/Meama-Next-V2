import {useState, useEffect, useCallback, useMemo} from 'react';
import './ServiceGrid.css';
import {useI18n} from '~/lib/i18n';

interface ServiceData {
  id: string;
  title: string;
  color: string;
  bullets: string[];
  description: string;
}

export function ServiceGrid() {
  const {t, get, locale} = useI18n();
  const [selectedService, setSelectedService] = useState<ServiceData | null>(
    null,
  );
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchCurrentY, setTouchCurrentY] = useState<number | null>(null);

  const handleSquareClick = (service: ServiceData) => {
    setSelectedService(service);
  };

  const handleCloseModal = useCallback(() => {
    setSelectedService(null);
    setTouchStartY(null);
    setTouchCurrentY(null);
  }, []);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
    setTouchCurrentY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY !== null) {
      setTouchCurrentY(e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    if (touchStartY !== null && touchCurrentY !== null) {
      const deltaY = touchCurrentY - touchStartY;
      // If swiped down more than 100px, close the modal
      if (deltaY > 100) {
        handleCloseModal();
      }
    }
    setTouchStartY(null);
    setTouchCurrentY(null);
  };

  useEffect(() => {
    if (!selectedService) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCloseModal();
      }
    };

    // Prevent body scroll on mobile when modal is open
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      document.body.style.overflow = 'hidden';
    }

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      if (isMobile) {
        document.body.style.overflow = '';
      }
    };
  }, [selectedService, handleCloseModal]);

  const services = useMemo<ServiceData[]>(
    () => [
      {
        id: 'innovations',
        title: t('serviceGrid.services.innovations.title', ''),
        color: '#F14C01', // Orange
        bullets: get<string[]>(
          'serviceGrid.services.innovations.bullets',
          [],
        ),
        description: t('serviceGrid.services.innovations.description', ''),
      },
      {
        id: 'analytical',
        title: t('serviceGrid.services.analytical.title', ''),
        color: '#5C0BC5', // Purple
        bullets: get<string[]>(
          'serviceGrid.services.analytical.bullets',
          [],
        ),
        description: t('serviceGrid.services.analytical.description', ''),
      },
      {
        id: 'financial',
        title: t('serviceGrid.services.financial.title', ''),
        color: '#024853', // Dark Teal
        bullets: get<string[]>(
          'serviceGrid.services.financial.bullets',
          [],
        ),
        description: t('serviceGrid.services.financial.description', ''),
      },
      {
        id: 'communication',
        title: t('serviceGrid.services.communication.title', ''),
        color: '#A0D39F', // Light Green
        bullets: get<string[]>(
          'serviceGrid.services.communication.bullets',
          [],
        ),
        description: t('serviceGrid.services.communication.description', ''),
      },
      {
        id: 'rd',
        title: t('serviceGrid.services.rd.title', ''),
        color: '#FF7BFF', // Pink
        bullets: get<string[]>('serviceGrid.services.rd.bullets', []),
        description: t('serviceGrid.services.rd.description', ''),
      },
      {
        id: 'logistics',
        title: t('serviceGrid.services.logistics.title', ''),
        color: '#90712E', // Brown/Olive
        bullets: get<string[]>(
          'serviceGrid.services.logistics.bullets',
          [],
        ),
        description: t('serviceGrid.services.logistics.description', ''),
      },
    ],
    [get, t, locale],
  );

  return (
    <>
      <div className="service-grid" id="service-grid">
        {services.map((service) => (
          <div
            key={service.id}
            className="service-square"
            style={{ backgroundColor: service.color }}
            onClick={() => handleSquareClick(service)}
          >
            <div className="service-square-content">
              <h3 className="service-square-title">{service.title}</h3>
              <a
                className="service-square-link"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                {t('serviceGrid.seeMore', 'იხილეთ მეტი →')}
              </a>
            </div>
          </div>
        ))}
      </div>

      {selectedService && (
        <div
          className="service-modal-overlay"
          onClick={handleBackdropClick}
        >
          <div
            className="service-modal"
            style={{
              transform:
                touchCurrentY !== null && touchStartY !== null
                  ? `translateY(${Math.max(0, touchCurrentY - touchStartY)}px)`
                  : undefined,
            }}
          >
            <div
              className="service-modal-drag-handle"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
            <div className="service-modal-content">
              <button
                className="service-modal-close"
                onClick={handleCloseModal}
                aria-label="Close"
              >
                ×
              </button>
              <h2 className="service-modal-title">{selectedService.title}</h2>
              <ul className="service-modal-bullets">
                {selectedService.bullets.map((bullet, index) => (
                  <li key={index}>{bullet}</li>
                ))}
              </ul>
              <p className="service-modal-description">
                {selectedService.description}
              </p>
              <button className="service-modal-button">
                {t('serviceGrid.fillForm', 'შეავსე ფორმა')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

