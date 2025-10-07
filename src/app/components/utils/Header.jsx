import { useState } from 'react';
import { X } from 'lucide-react';

export default function Header({ onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigation = (page) => {
    setIsOpen(false);
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-black/95 border-b border-yellow-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
          {/* Logo */}
          <button 
            onClick={() => handleNavigation('home')}
            className="flex items-center space-x-3"
          >
            <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              ✦ LUXURY JEWELS
            </div>
          </button>

          {/* Menu Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center space-x-2 text-yellow-400 font-semibold tracking-wider hover:text-yellow-300 transition-colors"
          >
            <span>MENU</span>
            <div className="w-6 h-6 border-2 border-yellow-400 rotate-45"></div>
          </button>
        </div>
      </header>

      {/* Fullscreen Menu */}
      <div
        className={`fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col md:flex-row justify-between p-8 md:p-16 transition-all duration-500 z-50 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {/* Decorative Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 border border-yellow-400/20 rotate-45"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 border border-yellow-400/10 rotate-12"></div>

        {/* Left Side - Navigation */}
        <div className="flex flex-col justify-center space-y-6 text-5xl md:text-7xl font-extrabold z-10">
          {[
            { label: 'Home', page: 'home' },
            { label: 'Collections', page: 'collections' },
            { label: 'Custom Design', page: 'custom-design' },
            { label: 'Services', page: 'services' },
            { label: 'Contact', page: 'contact' }
          ].map((item, index) => (
            <button
              key={item.label}
              onClick={() => handleNavigation(item.page)}
              className={`text-left hover:text-yellow-400 transition-all duration-300 transform hover:translate-x-4 ${
                isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{
                transitionDelay: isOpen ? `${index * 100}ms` : '0ms',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right Side - Contact Info */}
        <div
          className={`md:w-1/2 mt-10 md:mt-0 border-l-2 border-yellow-900/50 pl-10 flex flex-col justify-center transition-all duration-700 ${
            isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
          }`}
          style={{ transitionDelay: '300ms' }}
        >
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            GET IN TOUCH
          </h2>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-start space-x-3">
              <span className="text-yellow-400 mt-1">📍</span>
              <p className="text-gray-300">
                532, Old Galle Rd, Horethuduwa, Moratuwa, LK
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-yellow-400">📞</span>
              <p className="text-gray-400">
                TEL: <span className="text-yellow-400 font-semibold">077 677 2707</span>
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-yellow-400">✉️</span>
              <p className="text-gray-400">
                EMAIL: <span className="text-yellow-400 font-semibold">hello@luxuryjewels.lk</span>
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-yellow-900/30">
            <p className="text-sm text-gray-400 mb-4">FOLLOW US</p>
            <div className="flex space-x-6 text-sm">
              {['LinkedIn', 'Instagram', 'Facebook', 'Pinterest'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 font-medium"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div className="mt-12 p-6 bg-gradient-to-r from-yellow-900/20 to-yellow-800/10 rounded-lg border border-yellow-700/30">
            <p className="text-sm text-yellow-300 mb-2">✨ VISIT OUR SHOWROOM</p>
            <p className="text-xs text-gray-400">Open Mon-Sat: 9:00 AM - 7:00 PM</p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-10 right-10 flex items-center space-x-2 text-yellow-400 font-semibold tracking-wider hover:text-yellow-300 transition-colors group"
        >
          <span>CLOSE</span>
          <div className="w-6 h-6 border-2 border-yellow-400 rotate-45 group-hover:rotate-90 transition-transform duration-300"></div>
        </button>
      </div>
    </>
  );
}