import React from 'react'
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Contact = () => {
  return (
    <div id='contact' className="bg-black text-white py-12 px-[20px] w-full overflow-x-hidden">
      <h1 className="text-3xl font-bold text-center mb-12">Kontakt</h1>
      <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center gap-12 max-w-[1280px] mx-auto">
        
        {/* Dane kontaktowe */}
        <div className="flex-1 space-y-6 max-w-md">
          {/* Telefon */}
          <div className="flex items-start space-x-4">
            <FaPhoneAlt className="text-white text-lg mt-1" />
            <div>
              <h3 className="font-bold text-lg">Telefon</h3>
              <p>+ 48 799 091 000</p>
              <p>+ 48 799 092 000</p>
              <p>+ 48 799 093 000</p>
              <p className="mt-1">
                <span className="font-bold">Otwarte Pon-Pt:</span> 07:00 - 17:00
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start space-x-4">
            <FaEnvelope className="text-white text-lg mt-1" />
            <div>
              <h3 className="font-bold text-lg">Email</h3>
              <p>biuro@bialgruz.pl</p>
              <p className="text-sm text-gray-300">Odpowiadamy w ciągu 12h</p>
            </div>
          </div>

          {/* Adres */}
          <div className="flex items-start space-x-4">
            <FaMapMarkerAlt className="text-white text-lg mt-1" />
            <div>
              <h3 className="font-bold text-lg">Adres</h3>
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
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  )
}

export default Contact;
