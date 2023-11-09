import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import styles from './styles.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '@/lib/axios';

interface CarouselProps {
    empresa: string;
    img01: string;
    img02: string;
    img03: string;
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

export default function CarouselComponent({ empresa, img01, img02, img03 }: CarouselProps) {
   

    return (
        <div className={styles.carouselStyle}>
        {img01 && (
          <Carousel
          swipeable={true}
          draggable={true}
          showDots={false}
          responsive={responsive}
          ssr={true} // means to render carousel on server-side.
          infinite={true}
          autoPlay={false}
          autoPlaySpeed={1000}
          keyBoardControl={true}
          customTransition="all .5"
          transitionDuration={500}
          containerClass="carousel-container"
          removeArrowOnDeviceType={["tablet", "mobile"]}
          dotListClass="custom-dot-list-style"
          itemClass="carousel-item-padding-40-px"
          
        >
          <img src={img01} alt='' className={styles.imageBox}></img>
          <img src={img02} alt='' className={styles.imageBox}></img>
          <img src={img03} alt='' className={styles.imageBox}></img>
          {/* <img src='https://static.todamateria.com.br/upload/ca/va/cavalo-og.jpg?class=ogImageWide' alt='' className={styles.imageBox}></img>
          <img src='https://static.todamateria.com.br/upload/ca/va/cavalo-og.jpg?class=ogImageWide' alt='' className={styles.imageBox}></img> */}
        </Carousel>
        )}
      </div>
      );
}
