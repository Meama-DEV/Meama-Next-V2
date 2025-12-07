import { useState, useEffect, useCallback } from 'react';
import './ServiceGrid.css';

interface ServiceData {
  id: string;
  title: string;
  color: string;
  bullets: string[];
  description: string;
}

const services: ServiceData[] = [
  {
    id: 'innovations',
    title: 'ინოვაციები და მომავლის ხედვა',
    color: '#F14C01', // Orange
    bullets: [
      'ხედავ ინოვაციურ გადაწყვეტებს',
      'ქმნი მომავლის ტექნოლოგიებს',
      'განვითარებ ინოვაციურ პროცესებს',
    ],
    description: 'გეხმარებით ინოვაციური უნარების სრულყოფაში',
  },
  {
    id: 'analytical',
    title: 'ანალიტიკური და სტრატეგიული აზროვნება',
    color: '#5C0BC5', // Purple
    bullets: [
      'ხედავ კანონზომიერებებს',
      'აგვარებ კომპლექსურ პრობლემებს',
      'ქმნი ბიზნეს სტატეგიებს',
    ],
    description: 'გეხმარებით ანალიტიკური უნარების სრულყოფაში',
  },
  {
    id: 'financial',
    title: 'ფინანსური რესურსების მართვა',
    color: '#024853', // Dark Teal
    bullets: [
      'ანალიზს ატარებ ფინანსურ მონაცემებზე',
      'ქმნი ეფექტურ ბიუჯეტებს',
      'ოპტიმიზირებ ფინანსურ პროცესებს',
    ],
    description: 'გეხმარებით ფინანსური მართვის უნარების სრულყოფაში',
  },
  {
    id: 'communication',
    title: 'კომუნიკაცია და მენჯმენტი',
    color: '#A0D39F', // Light Green
    bullets: [
      'აგვარებ კომუნიკაციის გამოწვევებს',
      'ქმნი ეფექტურ გუნდებს',
      'განვითარებ ლიდერულ უნარებს',
    ],
    description: 'გეხმარებით კომუნიკაციისა და მენეჯმენტის უნარების სრულყოფაში',
  },
  {
    id: 'rd',
    title: 'R&D (კვლევა და განვითარება)',
    color: '#FF7BFF', // Pink
    bullets: [
      'ატარებ სისტემატურ კვლევებს',
      'ქმნი განვითარების სტრატეგიებს',
      'განვითარებ ინოვაციურ პროდუქტებს',
    ],
    description: 'გეხმარებით კვლევისა და განვითარების უნარების სრულყოფაში',
  },
  {
    id: 'logistics',
    title: 'გლობალური ლოჯისტიკა',
    color: '#90712E', // Brown/Olive
    bullets: [
      'ოპტიმიზირებ ლოჯისტიკურ პროცესებს',
      'მართავ გლობალურ ჯაჭვებს',
      'ქმნი ეფექტურ სისტემებს',
    ],
    description: 'გეხმარებით ლოჯისტიკური უნარების სრულყოფაში',
  },
];

export function ServiceGrid() {
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

  return (
    <>
      <div className="service-grid">
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
                იხილეთ მეტი →
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
                შეავსე ფორმა
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

