import debounce from './debounce.js';

export default class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    // vai ter referencia da distancia/possição da onde esta o meu slide e de quanto eu movi o o maouse
    // dist = distáncia
    this.dist = {
      finalPosition: 0,
      startX: 0,
      movement: 0
    }

    this.activeClass = 'active';
  }

  transition(active) {
    this.slide.style.transition = active ? 'transform .3s' : '';
  }

  moveSlide(disX) {
    this.dist.movePosition = disX;
    this.slide.style.transform =  `translate3d(${disX}px, 0, 0)`; 
  }

  updatePosition(clientX) {
   this.dist.movement = (this.dist.startX - clientX) * 1.6;
   return this.dist.finalPosition - this.dist.movement;
  }

  onStart(event) {
    let movetype;
    if (event.type === 'mousedown') {
      event.preventDefault();
      this.dist.startX = event.clientX;
      movetype = 'mousemove';
    } else { // touchstart
      this.dist.startX = event.changedTouches[0].clientX;
      movetype = 'touchmove';
    }
    this.wrapper.addEventListener(movetype, this.onMove);
    this.transition(false);
  }

  onMove(event) {
    const poiterPosition = (event.type === 'mousemove') ? event.clientX : event.changedTouches[0].clientX;
    const finalPosition = this.updatePosition(poiterPosition);
    this.moveSlide(finalPosition);
  }

  onEnd(event) {
    const movetype = (event.type === 'mouseup') ? 'mousemove' : 'touchmove';
    this.wrapper.removeEventListener(movetype, this.onMove);
    this.dist.finalPosition = this.dist.movePosition;
    this.changeSlideOnEnd();
    this.transition(true);
  }

  // mude o slide ao terminar do movimento
  changeSlideOnEnd() {
    // se o movimento do scroll da imagem for maior que 120 muda de imagem
    if (this.dist.movement > 120 && this.index.next !== undefined) {
      this.activeNextSlide();
    } else if (this.dist.movement < -120 && this.index.aterior !== undefined) {
      this.activePrevSlide();
    } else {
      this.changeSlide(this.index.active);
    }
  }

  addSlideEvent() {
    this.wrapper.addEventListener('mousedown', this.onStart);
    this.wrapper.addEventListener('touchstart', this.onStart);
    this.wrapper.addEventListener('mouseup', this.onEnd);
    this.wrapper.addEventListener('touchend', this.onEnd);
  }

  // Slides config
  slidePosition(slide) {// colocar o lemento no centro
    //this.wrapper.offsetWidth pega o total 
    const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
    return -(slide.offsetLeft - margin);// este valor vai ser megativo para ele fica no centro
  }

  slidesConfig() {
    // tranformar em array
    this.slidesArray = [...this.slide.children].map((element) => {
      const position = this.slidePosition(element);// mostra a possição do elemento
      return {
        position,
        element
      }
    });
  }

  // muda o slide

  slidesIndexNav(index) {
    const last = this.slidesArray.length - 1;// tamanho da minha array de imagen
    this.index = {
      aterior: index ?  index - 1 : undefined,
      active: index,
      next: index === last ? undefined : index + 1,
    }
  }

  changeSlide(index) {
    const activeSlide = this.slidesArray[index];
    this.moveSlide(activeSlide.position);
    this.slidesIndexNav(index);
    this.dist.finalPosition = activeSlide.position;
    this.changeActiveClass();
  }

  changeActiveClass() {
    this.slidesArray.forEach((item) => item.element.classList.remove(this.activeClass));
    this.slidesArray[this.index.active].element.classList.add(this.activeClass);
  }

  // ativa o slide anterior
  activePrevSlide() {
    if (this.index.aterior !== undefined) {
      this.changeSlide(this.index.aterior);
    }
  }

  activeNextSlide() {
    if (this.index.next !== undefined) {
      this.changeSlide(this.index.next);
    }
  }

  // vai atualizar os valores quando a tela muda de tamanho, para centralizar a imagem no centro
  onResize() {
   setTimeout(() => {
    this.slidesConfig();
    this.changeSlide(this.index.active);
   }, 1000);
  }

  addResizeEvent() {
    window.addEventListener('resize', this.onResize);
  }

  // aqui o this sempre vai ser reverir a class Slide e não o elemento HTML
  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);

    this.onResize = debounce(this.onResize.bind(this), 50);
  }

  init() {
    this.bindEvents();
    this.transition(true);
    this.addSlideEvent();
    this.slidesConfig();
    this.addResizeEvent();
    return this;
  }
}