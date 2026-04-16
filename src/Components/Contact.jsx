import React from 'react'
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const Contact = () => {
  return (
    <div id='contact' className="bg-black text-white py-12 px-[20px] w-full overflow-x-hidden">
      <h2 className="text-3xl font-bold text-center mb-12">Kontakt</h2>
      <div className="flex flex-col sm:flex-row items-start sm:items-center lg:items-start justify-center gap-12 max-w-[1280px] mx-auto">        
        
        {/* Dane kontaktowe */}
        <div className="flex-1 space-y-6 max-w-md">
          
          {/* Telefon */}
          <div className="flex items-start space-x-4">
            <FaPhoneAlt className="text-white text-lg mt-1" />
            <div>
              <p className="font-bold text-lg">Telefon</p>
              <div className="flex flex-col space-y-1">
                <a href="tel:+48799091000" className="hover:text-yellow-400 transition-colors">+48 799 091 000</a>
                <a href="tel:+48799092000" className="hover:text-yellow-400 transition-colors">+48 799 092 000</a>
                <a href="tel:+48799093000" className="hover:text-yellow-400 transition-colors">+48 799 093 000</a>
              </div>
            </div>
          </div>

          {/* Godziny otwarcia - NOWY DZIAŁ */}
          <div className="flex items-start space-x-4">
            <FaClock className="text-white text-lg mt-1" />
            <div>
              <p className="font-bold text-lg">Godziny otwarcia</p>
              <p className="text-gray-300">
                <span className="font-bold text-white">Pon-Pt:</span> 07:00 - 20:00
              </p>
              <p className="text-gray-300">
                <span className="font-bold text-white">Sobota:</span> 08:00 - 15:00
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start space-x-4">
            <FaEnvelope className="text-white text-lg mt-1" />
            <div>
              <p className="font-bold text-lg">Email</p>
              <a href="mailto:biuro@bialgruz.pl" className="hover:text-yellow-400 transition-colors block">
                biuro@bialgruz.pl
              </a>
              <p className="text-sm text-gray-400">Odpowiadamy w ciągu 12h</p>
            </div>
          </div>

          {/* Adres */}
          <div className="flex items-start space-x-4">
            <FaMapMarkerAlt className="text-white text-lg mt-1" />
            <div>
              <p className="font-bold text-lg">Adres</p>
              <p>Porosły-Kolonia 12M</p>
              <p>16-070 Choroszcz</p>
            </div>
          </div>
        </div>

        {/* Mapa */}
        <div className="flex-1 w-full max-w-xl rounded-xl overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.05)]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2969.8971640945156!2d23.16911897705842!3d53.139464990182304!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471ffd51c770b797%3A0xe59d18894bcdea76!2sBIALGRUZ%20-%20wyw%C3%B3z%20gruzu%20i%20odpad%C3%B3w%20zmieszanych%20%7C%20Wynajem%20kontener%C3%B3w%20i%20big%20bag%C3%B3w.%20BIA%C5%81YSTOK%20I%20OKOLICE!5e1!3m2!1spl!2spl!4v1751318501910!5m2!1spl!2spl"
            width="100%"
            height="350"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="Mapa lokalizacji firmy Bialgruz"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  )
}

export default Contact;