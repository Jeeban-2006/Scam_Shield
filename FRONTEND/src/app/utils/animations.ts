import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Custom hook for GSAP animations with cleanup
 */
export function useGsapAnimation(
  animationFn: (ctx: gsap.Context) => void,
  dependencies: any[] = []
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      animationFn(ctx);
    }, ref);

    return () => ctx.revert();
  }, dependencies);

  return ref;
}

/**
 * Matrix-style falling characters effect
 */
export function createMatrixEffect(container: HTMLElement) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
  const columns = Math.floor(container.offsetWidth / 20);
  const drops: number[] = [];

  for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * -100;
  }

  const canvas = document.createElement('canvas');
  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.zIndex = '1';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = 'rgba(10, 14, 39, 1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const drawMatrix = () => {
    ctx.fillStyle = 'rgba(10, 14, 39, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00d9ff';
    ctx.font = '14px monospace';

    for (let i = 0; i < drops.length; i++) {
      const text = chars.charAt(Math.floor(Math.random() * chars.length));
      ctx.fillText(text, i * 20, drops[i] * 20);

      if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  };

  const interval = setInterval(drawMatrix, 50);

  return () => {
    clearInterval(interval);
    container.removeChild(canvas);
  };
}

/**
 * Scanning grid animation
 */
export function createScanningGrid(element: HTMLElement) {
  const tl = gsap.timeline({ repeat: 2 });
  
  tl.from(element, {
    scaleX: 0,
    duration: 0.3,
    ease: 'power2.out'
  })
  .to(element, {
    scaleX: 1,
    duration: 0.3,
    ease: 'power2.inOut'
  })
  .to(element, {
    opacity: 0.3,
    duration: 0.2,
    yoyo: true,
    repeat: 3
  });

  return tl;
}

/**
 * Shield forming animation
 */
export function createShieldAnimation(element: HTMLElement) {
  const tl = gsap.timeline();
  
  tl.from(element, {
    scale: 0,
    rotation: -180,
    opacity: 0,
    duration: 0.6,
    ease: 'back.out(1.7)'
  })
  .to(element, {
    scale: 1.1,
    duration: 0.2,
    ease: 'power2.out'
  })
  .to(element, {
    scale: 1,
    duration: 0.2,
    ease: 'power2.in'
  });

  return tl;
}

/**
 * 3D card break apart animation
 */
export function create3DBreakApart(
  container: HTMLElement,
  cards: HTMLElement[],
  onComplete?: () => void
) {
  const tl = gsap.timeline({
    onComplete
  });

  // Initial shake effect
  tl.to(container, {
    rotation: 2,
    duration: 0.1,
    yoyo: true,
    repeat: 3,
    ease: 'power1.inOut'
  });

  // Break apart
  cards.forEach((card, index) => {
    const angle = (360 / cards.length) * index;
    const distance = 150;
    const x = Math.cos(angle * Math.PI / 180) * distance;
    const y = Math.sin(angle * Math.PI / 180) * distance;

    tl.to(card, {
      x,
      y,
      rotation: angle,
      scale: 1,
      opacity: 1,
      duration: 0.8,
      ease: 'back.out(1.5)',
      delay: index * 0.1
    }, '-=0.7');
  });

  return tl;
}

/**
 * Expandable card animation
 */
export function createExpandAnimation(element: HTMLElement, expanded: boolean) {
  return gsap.to(element, {
    height: expanded ? 'auto' : 0,
    opacity: expanded ? 1 : 0,
    duration: 0.4,
    ease: 'power2.inOut'
  });
}

/**
 * Stagger fade in animation
 */
export function createStaggerFadeIn(elements: HTMLElement[], delay: number = 0.1) {
  return gsap.from(elements, {
    opacity: 0,
    y: 20,
    duration: 0.5,
    stagger: delay,
    ease: 'power2.out'
  });
}

/**
 * Hover float effect
 */
export function createHoverFloat(element: HTMLElement) {
  const onEnter = () => {
    gsap.to(element, {
      y: -10,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const onLeave = () => {
    gsap.to(element, {
      y: 0,
      duration: 0.3,
      ease: 'power2.in'
    });
  };

  element.addEventListener('mouseenter', onEnter);
  element.addEventListener('mouseleave', onLeave);

  return () => {
    element.removeEventListener('mouseenter', onEnter);
    element.removeEventListener('mouseleave', onLeave);
  };
}
