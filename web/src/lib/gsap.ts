import { browser } from '$app/environment'
import gsap from 'gsap'
import {CustomEase} from 'gsap/CustomEase'
import {Draggable} from 'gsap/Draggable'
import {Flip} from 'gsap/Flip'
import {Observer} from 'gsap/Observer'
import {ScrollTrigger} from 'gsap/ScrollTrigger'

if (browser) {
  gsap.registerPlugin(Flip, Draggable, ScrollTrigger, Observer, CustomEase)

  gsap.config({
    autoSleep: 60,
    nullTargetWarn: false,
  })
}

export {CustomEase, Draggable, Flip, gsap, Observer, ScrollTrigger}
