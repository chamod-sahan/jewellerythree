"use client";

export default function Welcome() {
    return (
        <section 
            className="h-screen flex flex-col items-center justify-center"
            style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
                boxShadow: 'inset 0 0 200px rgba(255, 215, 0, 0.00001)'
            }}
        >
            <h1 
                className="text-6xl font-bold mb-6 text-center"
                style={{
                    color: '#e2e8f0',
                    textShadow: '0 0 30px rgba(255, 215, 0, 0.00001), 0 4px 8px rgba(0,0,0,0.5)'
                }}
            >
                Welcome Jewelry Shop
            </h1>
            <div 
                className="text-2xl font-medium mb-8 text-center"
                style={{
                    color: '#cbd5e1',
                    textShadow: '0 0 20px rgba(255, 215, 0, 0.00001), 0 2px 4px rgba(0,0,0,0.3)'
                }}
            >
                Where Dreams Meet Diamonds
            </div>
            <p 
                className="mt-4 text-lg max-w-2xl text-center leading-relaxed"
                style={{
                    color: '#94a3b8',
                    textShadow: '0 0 15px rgba(255, 215, 0, 0.00001), 0 1px 2px rgba(0,0,0,0.3)'
                }}
            >
                Discover exquisite designs and timeless elegance with our curated collection of fine jewelry. 
                From sparkling diamonds to precious gemstones, each piece tells a unique story of craftsmanship and beauty.
            </p>
            <div className="mt-8 flex gap-4">
                <button 
                    className="px-8 py-3 font-semibold rounded-lg transition-all duration-300"
                    style={{
                        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                        color: '#e2e8f0',
                        border: '1px solid rgba(255, 215, 0, 0.00001)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.3), inset 0 0 20px rgba(255, 215, 0, 0.00001)'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.4), inset 0 0 30px rgba(255, 215, 0, 0.00001)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0px)';
                        e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3), inset 0 0 20px rgba(255, 215, 0, 0.00001)';
                    }}
                >
                    Explore Collection
                </button>
                <button 
                    className="px-8 py-3 font-semibold rounded-lg transition-all duration-300"
                    style={{
                        background: 'transparent',
                        color: '#e2e8f0',
                        border: '2px solid #475569',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.3), inset 0 0 20px rgba(255, 215, 0, 0.00001)'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.background = 'linear-gradient(135deg, #475569 0%, #64748b 100%)';
                        e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.4), inset 0 0 30px rgba(255, 215, 0, 0.00001)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0px)';
                        e.target.style.background = 'transparent';
                        e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3), inset 0 0 20px rgba(255, 215, 0, 0.00001)';
                    }}
                >
                    Learn More
                </button>
            </div>
        </section>
    );
}