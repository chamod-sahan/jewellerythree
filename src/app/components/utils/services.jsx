import { useState, useEffect, useRef } from 'react';

const services = [
  {
    id: '01',
    title: 'CUSTOM DESIGNS',
    desc: 'Bring your dream jewelry to life with our bespoke design service. Crafted with precision, passion, and timeless beauty.',
    img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
  },
  {
    id: '02',
    title: 'JEWELRY REPAIR',
    desc: 'Restore your precious pieces to perfection. From ring resizing to gemstone resetting, we handle every detail with care.',
    img: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80',
  },
  {
    id: '03',
    title: 'GOLD COLLECTIONS',
    desc: 'Explore our exquisite collection of gold jewelry — from classic elegance to contemporary luxury crafted to shine forever.',
    img: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=800&q=80',
  },
];

function useInView(ref) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);

  return isInView;
}

function ServiceCard({ service, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref);

  return (
    <div
      ref={ref}
      className={`group transition-all duration-700 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 200}ms` }}
    >
      {/* Image */}
      <div className="overflow-hidden mb-6 rounded-lg shadow-lg">
        <img
          src={service.img}
          alt={service.title}
          className="w-full h-64 md:h-80 object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out"
        />
      </div>

      {/* Text Content */}
      <div>
        <h4 className="text-2xl md:text-3xl font-extrabold flex items-center mb-3 tracking-wide">
          <span className="text-yellow-400 mr-3">{service.id}</span>
          <span className="border-b-2 border-yellow-400 pb-1">
            {service.title}
          </span>
        </h4>
        <p className="text-gray-300 mb-5 leading-relaxed text-base md:text-lg">
          {service.desc}
        </p>
        <a
          href="#"
          className="font-semibold text-yellow-400 hover:text-white transition-all duration-300"
        >
          LEARN MORE →
        </a>
      </div>
    </div>
  );
}

export default function Services() {
  const titleRef = useRef(null);
  const headingRef = useRef(null);
  const isTitleInView = useInView(titleRef);
  const isHeadingInView = useInView(headingRef);

  return (
    <section className="relative bg-black text-white py-20 md:py-28 overflow-hidden min-h-screen">
      {/* Vertical Title */}
      <div
        ref={titleRef}
        className={`absolute left-0 top-1/2 -translate-y-1/2 hidden lg:block transition-all duration-700 ${
          isTitleInView ? 'opacity-100 -translate-x-0' : 'opacity-0 -translate-x-12'
        }`}
      >
        <h2
          className="text-6xl xl:text-7xl font-extrabold tracking-tight text-transparent"
          style={{
            WebkitTextStroke: '1.5px #FFD700',
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            transform: 'rotate(180deg)',
          }}
        >
          OUR SERVICES
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:pl-44">
        {/* Section Heading */}
        <h3
          ref={headingRef}
          className={`text-3xl md:text-5xl font-extrabold mb-14 text-center md:text-right leading-snug transition-all duration-700 ${
            isHeadingInView ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
          }`}
        >
          HOW CAN WE <span className="text-yellow-400">SHINE FOR YOU?</span>
        </h3>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}