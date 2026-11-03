import Image from "next/image"
import { urlFor } from "../sanity"

const ImageComponent = ({ identifier, image }) => {
  return (
    <div className={identifier === "main-image" ? "main-image" : "image"}>
      <Image
        src={urlFor(image).auto("format").url()}
        alt={identifier === "main-image" ? "Main property image" : "Property image"}
        layout="fill"
        objectFit="cover"
      />
    </div>
  )
}

export default ImageComponent
