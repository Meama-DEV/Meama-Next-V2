import containerImage from '~/assets/Container.png';
import './NextHero.css';

export function NextHero() {
  return (
    <section className="next-hero">
      <div className="next-hero__background">
        <img 
          src={containerImage} 
          alt="Modern building" 
          className="next-hero__image"
        />
      </div>
      <div className="next-hero__content">
        <h1 className="next-hero__heading">
          <span className="next-hero__heading-line">დაინახე</span>
          <span className="next-hero__heading-line">შესაძლებლობები</span>
        </h1>
        <p className="next-hero__text">
          შეისწავლე მეამას ბიზნეს პროცესები და
          <br />
          აღმოაჩინე ახალი შესაძლებლობები.
        </p>
        <button className="next-hero__button">
          დაიწყე მოგზაურობა
        </button>
      </div>
    </section>
  );
}

