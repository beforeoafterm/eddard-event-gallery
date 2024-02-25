import type { NextPage } from "next"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useMemo, useRef, useState } from "react"
import Modal from "../components/Modal"
import cloudinary from "../utils/cloudinary"
import getBase64ImageUrl from "../utils/generateBlurPlaceholder"
import type { ImageProps } from "../utils/types"
import { useLastViewedPhoto } from "../utils/useLastViewedPhoto"

const Home: NextPage = ({ categories, images }: {
  categories: Array<string>,
  images: ImageProps[]
}) => {
  const router = useRouter()
  const { photoId } = router.query
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto()
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0])

  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null)

  const categoryImages = useMemo(() => {
    return images.filter((image) => image.public_id.includes(selectedCategory))
  }, [selectedCategory])

  useEffect(() => {
    // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current.scrollIntoView({ block: "center" })
      setLastViewedPhoto(null)
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto])

  return (
    <>
      <Head>
        <title>Kirk's 7th Birthday Superhero Bash Photos</title>
        <meta
          property="og:image"
          content="https://its-kirks-birthday-gallery.tioi.network/og-image.png"
        />
        <meta
          name="twitter:image"
          content="https://its-kirks-birthday-gallery.tioi.network/og-image.png"
        />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        {photoId && (
          <Modal
            images={images}
            onClose={() => {
              setLastViewedPhoto(photoId)
            }}
          />
        )}
        <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
          <div className="after:content relative mb-5 flex flex-col items-center justify-end gap-4 overflow-hidden border-8 border-black bg-sky-600/90 px-6 pb-16 pt-64 text-center text-white shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight lg:pt-0">
            <div className="absolute inset-0 flex items-center justify-center opacity-80 -z-10">
              <span className="flex max-h-full max-w-full items-center justify-center">
                <Image src='/ned-logo.svg' width={400} height={400} alt='Kirk Superhero Logo' />
              </span>
              <span className="absolute left-0 right-0 bottom-0 h-[400px] bg-gradient-to-b from-black/0 via-black to-black"></span>
            </div>
            <Image src='/ned-herobanner.svg' width={360} height={360} alt='Kirk Hero Banner' />
            <h1 className="mt-8 mb-4 text-2xl font-bold font-display tracking-widest">
              Kirk's 7th Birthday Superhero Bash Photos
            </h1>
            <div>
              {categories.map((category) => (
                <button
                  key={category}
                  className={[
                    "categoryButton",
                    selectedCategory === category ? 'categoryButton___selected' : '',
                  ].join(' ')}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
            <p className="max-w-[40ch] text-lg text-white/80 sm:max-w-[32ch] font-default">
              Our superheroes and civilians got together in Heroes Headquarters for
              a fun-filled action-packed celebration!
            </p>
          </div>
          {categoryImages.map(({ id, public_id, format, blurDataUrl }) => (
            <Link
              key={id}
              href={`/?photoId=${id}`}
              as={`/p/${id}`}
              ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
              shallow
              className="after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
            >
              <Image
                alt="Kirk Eddard's 7th Birthday photo"
                className="transform border-8 border-black brightness-90 transition will-change-auto group-hover:brightness-110"
                style={{ transform: "translate3d(0, 0, 0)" }}
                placeholder="blur"
                blurDataURL={blurDataUrl}
                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${public_id}.${format}`}
                width={720}
                height={480}
                sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
              />
            </Link>
          ))}
        </div>
      </main>
      <footer className="p-6 text-center text-white/80 sm:p-12">
        Thank you to{" "}
        <a
          href="https://edelsonphotography.com/"
          target="_blank"
          className="font-semibold hover:text-white"
          rel="noreferrer"
        >
          Pam Nicolas
        </a>
        {" "}
        for the pictures.
      </footer>
    </>
  )
}

export default Home

export async function getStaticProps() {
  const results = await cloudinary.v2.search
    .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
    .sort_by("public_id", "desc")
    .max_results(400)
    .execute()
  let images: ImageProps[] = []

  let i = 0
  const categories: Array<string> = []
  for (let result of results.resources) {

    // Get the category name from the public ID
    const categoryName = result.public_id.split('/')[1].split('-')[1]

    // Store all categories
    if (!categories.includes(categoryName)) {
      categories.push(categoryName)
    }

    images.push({
      id: i,
      height: result.height,
      width: result.width,
      public_id: result.public_id,
      format: result.format,
    })
    i++
  }

  const blurImagePromises = results.resources.map((image: ImageProps) => {
    return getBase64ImageUrl(image)
  })
  const imagesWithBlurDataUrls = await Promise.all(blurImagePromises)

  for (let i = 0; i < images.length; i++) {
    images[i].blurDataUrl = imagesWithBlurDataUrls[i]
  }

  return {
    props: {
      categories,
      images
    }
  }
}
