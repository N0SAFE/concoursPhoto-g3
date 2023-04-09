// get the demo "Css Mode" -> https://swiperjs.com/demos -> https://codesandbox.io/p/sandbox/96k427?file=%2Fsrc%2FApp.jsx and recreate Slider component with that

import React, { useRef, useState } from "react";
// Import Slider React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Slider styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import style from "./style.module.scss";

// import required modules
import { Navigation, Pagination, Keyboard } from "swiper";

export default function Slider(
    {
        navigation = true,
        slides = [],
    }) {
    return (
        <>
            <Swiper
                navigation={navigation}
                pagination={{
                    clickable: true,
                }}
                modules={[Navigation, Pagination, Keyboard]}
                className={style.swiper}
            >
                {slides.map((slide) => {
                    return (
                        <SwiperSlide>
                            <img src={slide.imagePath} alt={slide.imageAlt} />
                        </SwiperSlide>
                    )
                })}
            </Swiper>
        </>
    );
}
