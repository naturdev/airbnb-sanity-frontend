import { urlFor } from "../sanity"

const Image = ({ identifier, image }) => {
  return (
    <div className={identifier === "main-image" ? "main-image" : "image"}>
      <img 
        src={urlFor(image).auto("format")} 
        alt={identifier === "main-image" ? "Main property image" : "Property image"}
      />
    </div>
  )
}

export default Image
