import { SlideNav } from "./slide.js";

const slide = new SlideNav('.slide', '.slide-wrapper');
slide.init();

slide.addArraow('.prev', '.next');

console.log(slide);