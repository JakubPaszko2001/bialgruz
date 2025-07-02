const NavUl = ({ menuOpen, handleClose }) => {
  const liMenu = [
    { name: "Strona główna", span: true, ref: "main" },
    { name: "Oferta", span: true, ref: "offer" },
    { name: "Zamówienia", span: true, ref: "order" },
    { name: "Kontakt", span: false, ref: "contact" },
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