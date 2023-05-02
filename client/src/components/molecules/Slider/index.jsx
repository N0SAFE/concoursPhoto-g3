// get the demo "Css Mode" -> https://swiperjs.com/demos -> https://codesandbox.io/p/sandbox/96k427?file=%2Fsrc%2FApp.jsx and recreate Slider component with that

import React, { useRef, useState } from 'react';
// Import Slider React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Slider styles
import 'swiper/scss';
import 'swiper/scss/pagination';
import style from './style.module.scss';
// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper';
import Icon from '@/components/atoms/Icon/index.jsx';

export default function Slider({ slides = [] }) {
    const navigationPrevRef = useRef(null);
    const navigationNextRef = useRef(null);

    return (
        <>
            <div style={{ height: '100%', position: 'relative' }}>
                <Swiper
                    // change the default styles of the pagination bullets
                    style={{
                        '--swiper-pagination-color': 'black',
                        '--swiper-pagination-bullet-inactive-color': 'white',
                        '--swiper-pagination-bullet-inactive-opacity': '1',
                        '--swiper-pagination-bullet-size': '10px',
                    }}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    navigation={{
                        prevEl: style.swiperButtonPrev,
                        nextEl: style.swiperButtonNext,
                        disabledClass: style.swiperButtonDisabled,
                    }}
                    onBeforeInit={swiper => {
                        swiper.params.navigation.prevEl =
                            navigationPrevRef.current;
                        swiper.params.navigation.nextEl =
                            navigationNextRef.current;
                    }}
                    pagination={{
                        clickable: true,
                    }}
                    modules={[Autoplay, Pagination, Navigation]}
                    className={style.swiper}
                >
                    <div
                        className={`${style.swiperButton} ${style.swiperButtonPrev}`}
                        ref={navigationPrevRef}
                    >
                        <Icon icon="cheveron-left" size={30} />
                    </div>
                    <div
                        className={`${style.swiperButton} ${style.swiperButtonNext}`}
                        ref={navigationNextRef}
                    >
                        <Icon icon="cheveron-right" size={30} />
                    </div>

                    {slides.map(slide => {
                        return (
                            <SwiperSlide>
                                <img
                                    src={slide.imagePath}
                                    alt={slide.imageAlt}
                                />
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>
        </>
    );
}
