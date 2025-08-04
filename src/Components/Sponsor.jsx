import React from 'react'
import czarni from '../Assets/Czarni.webp'

const Sponsor = () => {
  return (
    <div className="bg-black text-white text-sm md:text-lg border-y border-gray-600 px-[20px] py-2 flex items-center justify-center gap-3">
      <span>
        Wspieramy lokalny sport – jesteśmy sponsorem Czarni Czarna Białostocka
      </span>
      <img
        src={czarni}
        alt="Logo Czarni"
        className="h-16 object-contain"
      />
    </div>
  )
}

export default Sponsor
