import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import styles from './styles.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '@/lib/axios';

interface CarouselProps {
    empresa: string;
    images: string[];
}

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 3 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1 // optional, default to 1.
  }
};

export default function CarouselComponent({ empresa, images }: CarouselProps) {

    return (
        <div className={styles.carouselStyle}>
        {Array.isArray(images) && images.length > 0 && (
          <Carousel
          swipeable={true}
          draggable={true}
          showDots={false}
          responsive={responsive}
          ssr={true} // means to render carousel on server-side.
          infinite={true}
          autoPlay={false}
          autoPlaySpeed={1000}
          keyBoardControl={false}
          customTransition="all .5"
          transitionDuration={500}
          containerClass="carousel-container"
          removeArrowOnDeviceType={["tablet", "mobile", 'desktop']}
          dotListClass="custom-dot-list-style"
          itemClass="carousel-item-padding-40-px"
          
        >
          {images.map((img, index)=>{
            return(
              <img key={index} src={img} alt='' className={styles.imageBox}></img>
            )
          })}
        </Carousel>
        )}
      </div>
      );
}
