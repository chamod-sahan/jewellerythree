import { useState, useRef, useEffect } from 'react';

const collections = [
  {
    id: 1,
    title: 'Diamond Elegance',
    category: 'RINGS',
    pieces: '24 Pieces',
    price: 'From $2,500',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
    description: 'Timeless diamond rings crafted for eternal moments',
  },
  {
    id: 2,
    title: 'Golden Heritage',
    category: 'NECKLACES',
    pieces: '18 Pieces',
    price: 'From $3,200',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
    description: 'Exquisite gold necklaces inspired by traditional artistry',
  },
  {
    id: 3,
    title: 'Royal Sapphire',
    category: 'EARRINGS',
    pieces: '32 Pieces',
    price: 'From $1,800',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
    description: 'Stunning sapphire earrings fit for royalty',
  },
  {
    id: 4,
    title: 'Emerald Dreams',
    category: 'BRACELETS',
    pieces: '16 Pieces',
    price: 'From $2,100',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
    description: 'Luxurious emerald bracelets that captivate',
  },
  {
    id: 5,
    title: 'Pearl Essence',
    category: 'SETS',
    pieces: '12 Pieces',
    price: 'From $4,500',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
    description: 'Complete pearl jewelry sets for special occasions',
  },
  {
    id: 6,
    title: 'Platinum Prestige',
    category: 'RINGS',
    pieces: '20 Pieces',
    price: 'From $3,800',
    image: 'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800&q=80',
    description: 'Premium platinum rings for the discerning collector',
  },
];

const categories = ['ALL', 'RINGS', 'NECKLACES', 'EARRINGS', 'BRACELETS', 'SETS'];

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

function CollectionCard({ collection, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref);

  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden rounded-lg transition-all duration-700 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Image Container */}
      <div className="relative h-96 overflow-hidden bg-gray-900">
        <img
          src={collection.image}
          alt={collection.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
        
        {/* Category Badge */}
        <div className="absolute top-4 right-4 px-4 py-1.5 bg-yellow-400/90 backdrop-blur-sm text-black text-xs font-bold tracking-wider">
          {collection.category}
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {collection.title}
          </h3>
          <p className="text-gray-300 text-sm mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
            {collection.description}
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-400 text-sm font-semibold">{collection.pieces}</p>
              <p className="text-white text-lg font-bold">{collection.price}</p>
            </div>
            <button className="px-6 py-2 bg-yellow-400 text-black font-semibold rounded-full hover:bg-yellow-300 transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 delay-150">
              VIEW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CollectionsPage() {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [filteredCollections, setFilteredCollections] = useState(collections);
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef);

  useEffect(() => {
    if (activeCategory === 'ALL') {
      setFilteredCollections(collections);
    } else {
      setFilteredCollections(
        collections.filter((item) => item.category === activeCategory)
      );
    }
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
       
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 border border-yellow-400 rotate-45"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 border border-yellow-400 rotate-12"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-yellow-400/30"></div>
        </div>

       
        <div
          ref={headerRef}
          className={`text-center z-10 px-6 transition-all duration-1000 ${
            isHeaderInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-block px-4 py-1.5 mb-6 border border-yellow-400 text-yellow-400 text-sm tracking-widest">
            LUXURY COLLECTIONS
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Exquisite Jewelry
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover our curated collections of timeless pieces, each crafted with precision and adorned with the finest gems
          </p>
        </div>
      </div>

     
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 rounded-full font-semibold tracking-wider transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-yellow-400 text-black scale-105'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredCollections.map((collection, index) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              index={index}
            />
          ))}
        </div>

      
        <div className="text-center py-16 px-6 bg-gradient-to-r from-yellow-900/20 to-yellow-800/10 rounded-2xl border border-yellow-700/30">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Let our master craftsmen create a bespoke piece exclusively for you
          </p>
          <button className="px-8 py-4 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-300 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-yellow-400/20">
            START CUSTOM DESIGN
          </button>
        </div>
      </div>

      
      <div className="h-32 bg-gradient-to-t from-yellow-900/10 to-transparent"></div>
    </div>
  );
}