const ListCover = ({ album = {}, width, rounded = false }) => {
  return (
    <div className="list-cover w-full" style={{ maxWidth: width }}>
      <img
        className={`block shadow-lg bg-base-300 w-full aspect-[1/1] select-none ${
          rounded && "rounded-full"
        }`}
        alt={album?.title || ""}
        src={
          album?.cover
            ? // TODO
              `D:\\Websites\\GitHub\\Derian Andre\\Musica\\cache\\${album?.cover}`
            : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
        }
        width={width}
        loading="lazy"
      />
    </div>
  );
};

export default ListCover;
