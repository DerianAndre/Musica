const ListCover = ({ album = {}, width, rounded = false }) => {
  return (
    <div className="list-cover" style={{ maxWidth: width }}>
      <img
        className={`block shadow-lg bg-back/50 w-full aspect-[1/1] select-none ${
          rounded && "rounded-full"
        }`}
        alt={album?.title || ""}
        src={
          album?.cover
            ? // TODO
              `D:\\Websites\\GitHub\\Derian Andre\\Musica\\cache\\${album?.cover}`
            : ""
        }
        width={width}
        loading="lazy"
      />
    </div>
  );
};

export default ListCover;
