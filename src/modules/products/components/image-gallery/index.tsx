"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useState, useRef } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [current, setCurrent] = useState(0)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  if (!images || images.length === 0) return null

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1))

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX
    const diff = touchStartX.current - touchEndX.current
    if (diff > 50) next()
    if (diff < -50) prev()
  }

  return (
    <div className="dj-swiper-wrap">

      {/* MAIN IMAGE */}
      <div
        className="dj-swiper-main"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((image, index) => (
          <div
            key={image.id}
            className="dj-swiper-slide"
            style={{
              opacity: index === current ? 1 : 0,
              zIndex: index === current ? 1 : 0,
            }}
          >
            {!!image.url && (
              <Image
                src={image.url}
                alt={`Product image ${index + 1}`}
                fill
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, 600px"
                style={{ objectFit: "cover" }}
              />
            )}
          </div>
        ))}

        {/* ARROWS — desktop only */}
        {images.length > 1 && (
          <>
            <button className="dj-arrow dj-arrow-left" onClick={prev}>
              ‹
            </button>
            <button className="dj-arrow dj-arrow-right" onClick={next}>
              ›
            </button>
          </>
        )}

        {/* IMAGE COUNTER */}
        <div className="dj-counter">
          {current + 1} / {images.length}
        </div>
      </div>

      {/* DOTS */}
      {images.length > 1 && (
        <div className="dj-dots">
          {images.map((_, index) => (
            <button
              key={index}
              className={`dj-dot ${index === current ? "dj-dot-active" : ""}`}
              onClick={() => setCurrent(index)}
            />
          ))}
        </div>
      )}

      {/* THUMBNAILS */}
      {images.length > 1 && (
        <div className="dj-thumbs">
          {images.map((image, index) => (
            <button
              key={image.id}
              className={`dj-thumb ${index === current ? "dj-thumb-active" : ""}`}
              onClick={() => setCurrent(index)}
            >
              {!!image.url && (
                <Image
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  sizes="80px"
                  style={{ objectFit: "cover" }}
                />
              )}
            </button>
          ))}
        </div>
      )}

      <style>{`
        .dj-swiper-wrap {
          width: 100%;
          background: #F8F4FC;
          user-select: none;
        }

        .dj-swiper-main {
          position: relative;
          width: 100%;
          aspect-ratio: 3/4;
          overflow: hidden;
          background: #F0EAF8;
        }

        .dj-swiper-slide {
          position: absolute;
          inset: 0;
          transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .dj-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(4px);
          border: none;
          width: 40px;
          height: 40px;
          font-size: 24px;
          cursor: pointer;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2A1F4A;
          transition: background 0.3s;
          border-radius: 50%;
        }

        .dj-arrow:hover { background: rgba(255,255,255,1); }
        .dj-arrow-left { left: 12px; }
        .dj-arrow-right { right: 12px; }

        @media (max-width: 768px) {
          .dj-arrow { display: none; }
        }

        .dj-counter {
          position: absolute;
          bottom: 12px;
          right: 14px;
          background: rgba(0,0,0,0.4);
          color: white;
          font-size: 11px;
          letter-spacing: 1px;
          padding: 4px 10px;
          border-radius: 20px;
          z-index: 10;
          font-family: 'Jost', sans-serif;
        }

        .dj-dots {
          display: flex;
          justify-content: center;
          gap: 6px;
          padding: 12px 0 8px;
        }

        .dj-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #D4C8F0;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
          padding: 0;
        }

        .dj-dot-active {
          background: #9B7FE8;
          width: 20px;
          border-radius: 3px;
        }

        .dj-thumbs {
          display: flex;
          gap: 8px;
          padding: 8px 16px 16px;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .dj-thumbs::-webkit-scrollbar { display: none; }

        .dj-thumb {
          position: relative;
          width: 72px;
          height: 88px;
          flex-shrink: 0;
          border: 2px solid transparent;
          cursor: pointer;
          overflow: hidden;
          background: #EDE8FA;
          transition: border-color 0.3s;
          padding: 0;
          border-radius: 2px;
        }

        .dj-thumb-active {
          border-color: #9B7FE8;
        }
        
        /* DESKTOP / IPAD GALLERY */
@media (min-width: 900px) {
  .dj-swiper-wrap {
    display: grid;
    grid-template-columns: 78px minmax(0, 1fr);
    gap: 14px;
    background: transparent;
  }

  .dj-swiper-main {
    grid-column: 2;
    grid-row: 1;
    aspect-ratio: 4 / 5;
    background: #F0EAF8;
  }

  .dj-thumbs {
    grid-column: 1;
    grid-row: 1;
    flex-direction: column;
    padding: 0;
    gap: 10px;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 720px;
  }

  .dj-thumb {
    width: 72px;
    height: 90px;
    border-radius: 0;
  }

  .dj-dots {
    display: none;
  }

  .dj-counter {
    display: none;
  }
}
      `}</style>
    </div>
  )
}

export default ImageGallery
