"use client"

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import Madridimage from "@/public/MAD.jpg"
import NYimage from "@/public/nueva york.jpg"
import Alemaniaimage from "@/public/alemania.jpg"
import Paris3image from "@/public/parisss.jpg"
import Romaimage from "@/public/roma.jpg"
import Image from "next/image"

export function CustomCarousel() {
  return (
    <Carousel plugins={[Autoplay({ delay: 3000, stopOnInteraction: false })]} opts={{ loop: true }} className="w-full">
      <CarouselContent>
        <CarouselItem className="relative h-64 sm:h-80 md:h-96 lg:h-[500px]">
          <Image src={Madridimage || "/placeholder.svg"} alt="Madrid" className="w-full h-full object-cover" />
        </CarouselItem>
        <CarouselItem className="relative h-64 sm:h-80 md:h-96 lg:h-[500px]">
          <Image src={NYimage || "/placeholder.svg"} alt="Madrid" className="w-full h-full object-cover" />
        </CarouselItem>
        <CarouselItem className="relative h-64 sm:h-80 md:h-96 lg:h-[500px]">
          <Image src={Alemaniaimage || "/placeholder.svg"} alt="Madrid" className="w-full h-full object-cover" />
        </CarouselItem>
        <CarouselItem className="relative h-64 sm:h-80 md:h-96 lg:h-[500px]">
          <Image src={Paris3image || "/placeholder.svg"} alt="Londres" className="w-full h-full object-cover" />
        </CarouselItem>
        <CarouselItem className="relative h-64 sm:h-80 md:h-96 lg:h-[500px]">
          <Image src={Romaimage || "/placeholder.svg"} alt="Madrid" className="w-full h-full object-cover" />
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  )
}

