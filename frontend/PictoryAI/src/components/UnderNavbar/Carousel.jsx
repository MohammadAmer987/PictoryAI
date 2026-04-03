import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/Carousel.css';

import Imge1 from '../../images/Imge1.jpg';
import Imge2 from '../../images/Imge2.jpg';
import Imge3 from '../../images/Imge3.jpg';
import Imge4 from '../../images/Imge4.jpg';
import Imge5 from '../../images/Imge5.jpg';

const carouselItems = [
  {
    id: 1,
    image: Imge1
  },
  {
    id: 2,
    image: Imge2
  },
  {
    id: 3,
    image: Imge3
  },
  {
    id: 4,
    image: Imge4
  },
  {
    id: 5,
    image: Imge5
  }
];

export default function Carousel({
  autoplay = true,
  autoplayDelay = 3500,
  pauseOnHover = true
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fade, setFade] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!autoplay || (pauseOnHover && isHovering)) return;

    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
        setFade(false);
      }, 300);
    }, autoplayDelay);

    return () => clearInterval(interval);
  }, [autoplay, autoplayDelay, pauseOnHover, isHovering]);

  const goToSlide = (index) => {
    setFade(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setFade(false);
    }, 300);
  };

  return (
    <div
      className="carousel-wrapper"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="carousel-container">
        <div className={`carousel-slide ${fade ? 'fade-out' : 'fade-in'}`}>
          <img
            src={carouselItems[currentSlide].image}
            alt={`Slide ${currentSlide + 1}`}
            className="carousel-image"
          />
        </div>

        <div className="carousel-indicators">
          {carouselItems.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
}
