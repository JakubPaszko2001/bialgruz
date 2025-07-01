const NavUl = ({ menuOpen, handleClose }) => {
  const liMenu = [
    { name: "Strona główna", span: true, ref: "game-elements" },
    { name: "Oferta", span: true, ref: "trailer" },
    { name: "Zamówienia", span: true, ref: "how-to-play" },
    { name: "Kontakt", span: false, ref: "gallery" },
  ];

  return (
    <>
      <ul className="w-full h-full flex flex-col xl:flex-row justify-center items-center gap-8 text-3xl md:text-4xl xl:text-lg text-yellow-500">
        {liMenu.map((item) => (
          <li key={item.name}>
            <a
              tabIndex={menuOpen === true ? 0 : -1}
              href={`#${item.ref}`}
              rel="noreferrer"
              onClick={handleClose}
            >
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
};

export default NavUl;