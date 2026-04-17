'use client'

import {useGSAP} from '@gsap/react'
import gsap from 'gsap'
import {CustomEase} from 'gsap/CustomEase'
import {Draggable} from 'gsap/Draggable'
import {Flip} from 'gsap/Flip'
import {Observer} from 'gsap/Observer'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import {SplitText} from 'gsap/SplitText'

gsap.registerPlugin(useGSAP, Flip, SplitText, Draggable, ScrollTrigger, Observer, CustomEase)

gsap.config({
  autoSleep: 60,
  nullTargetWarn: false,
})

export {CustomEase, Draggable, Flip, gsap, Observer, ScrollTrigger, SplitText, useGSAP}
