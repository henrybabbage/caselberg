import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { Draggable } from 'gsap/Draggable';
import { Flip } from 'gsap/Flip';
import { Observer } from 'gsap/Observer';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

try {
    gsap.registerPlugin(Flip, Draggable, ScrollTrigger, Observer, CustomEase);
    console.log('GSAP plugins registered successfully');
} catch (e) {
    console.error('GSAP error:', e);
}
