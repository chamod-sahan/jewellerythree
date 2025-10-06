'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const services = [
  {
    id: '01',
    title: 'STRATEGY',
    desc: 'Unleash the power of strategic thinking and watch your brand soar to new heights.',
    img: '/images/strategy.jpg', // replace with your image
  },
  {
    id: '02',
    title: 'BRANDING',
    desc: "Your brand is more than just a logo — it's an identity that speaks volumes.",
    img: '/images/branding.jpg', // replace with your image
  },
  {
    id: '03',
    title: 'WEB DESIGN',
    desc: 'Crafting digital experiences that blend creativity and functionality seamlessly.',
    img: '/images/webdesign.jpg',
  },
]

export default function Services() {
  return (
    <section className="relative bg-black text-white py-24 overflow-hidden">
      {/* Vertical Title */}
      <motion.h2
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute left-0 top-1/2 -translate-y-1/2 text-[5rem] font-extrabold tracking-tight text-transparent stroke-[1.5px] stroke-lime-400 rotate-[-90deg] whitespace-nowrap hidden lg:block"
        style={{
          WebkitTextStroke: '1.5px #d4ff00',
        }}
      >
        OUR SERVICES
      </motion.h2>

      <div className="max-w-7xl mx-auto px-8 lg:pl-48">
        {/* Section Heading */}
        <motion.h3
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold mb-16 text-right"
        >
          HOW CAN WE HELP YOU?
        </motion.h3>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-12">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group"
            >
              <div className="overflow-hidden mb-6 rounded-lg">
                <Image
                  src={service.img}
                  alt={service.title}
                  width={400}
                  height={300}
                  className="w-full h-[320px] object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div>
                <h4 className="text-2xl font-extrabold flex items-center mb-3">
                  <span className="text-white mr-3">{service.id}</span>
                  <span className="border-b-2 border-white pb-1">
                    {service.title}
                  </span>
                </h4>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  {service.desc}
                </p>
                <a
                  href="#"
                  className="font-semibold text-lime-400 hover:text-lime-300 transition-all duration-300"
                >
                  LEARN MORE
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
