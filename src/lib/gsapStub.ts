// Lightweight GSAP-style helper used when the real package is unavailable in this environment.
// It mirrors the API surface used in the app (to, fromTo, context, utils) with simple DOM updates.
type Target = Element | string | Array<Element | null> | null | undefined;

type AnimationVars = {
  duration?: number;
  ease?: string;
  yoyo?: boolean;
  repeat?: number;
  stagger?: number;
  opacity?: number | string;
  x?: number | string;
  y?: number | string;
  scale?: number | string;
  rotate?: number | string;
};

const resolveTargets = (targets: Target): Element[] => {
  if (!targets) return [];
  if (typeof targets === 'string') return Array.from(document.querySelectorAll(targets));
  if (Array.isArray(targets)) return targets.filter(Boolean) as Element[];
  return [targets];
};

const applyVars = (element: Element, vars: AnimationVars) => {
  const style = (element as HTMLElement).style;
  const transformParts: string[] = [];

  if (vars.x !== undefined) transformParts.push(`translateX(${vars.x}${typeof vars.x === 'number' ? 'px' : ''})`);
  if (vars.y !== undefined) transformParts.push(`translateY(${vars.y}${typeof vars.y === 'number' ? 'px' : ''})`);
  if (vars.scale !== undefined) transformParts.push(`scale(${vars.scale})`);
  if (vars.rotate !== undefined) transformParts.push(`rotate(${vars.rotate}deg)`);

  if (transformParts.length) style.transform = transformParts.join(' ');
  if (vars.opacity !== undefined) style.opacity = String(vars.opacity);
};

const to = (targets: Target, vars: AnimationVars) => {
  const resolved = resolveTargets(targets);
  resolved.forEach((element, index) => {
    const duration = vars.duration ?? 0;
    const delay = (vars.stagger ?? 0) * index;
    const style = (element as HTMLElement).style;

    if (duration > 0) {
      style.transition = `all ${duration}s ${vars.ease || 'ease-in-out'} ${delay}s`;
    }
    applyVars(element, vars);
  });

  return { kill: () => resolved.forEach((el) => ((el as HTMLElement).style.transition = '')) };
};

const fromTo = (targets: Target, fromVars: AnimationVars, toVars: AnimationVars) => {
  const resolved = resolveTargets(targets);
  resolved.forEach((element) => applyVars(element, fromVars));
  return to(targets, toVars);
};

const context = (callback: () => void) => {
  callback();
  return { revert: () => undefined };
};

const utils = {
  toArray: <T extends Element>(items: T[] | NodeListOf<T> | T | string): T[] => {
    if (typeof items === 'string') return Array.from(document.querySelectorAll(items) as NodeListOf<T>);
    if (items instanceof Element) return [items as T];
    return Array.from(items as Iterable<T>);
  },
  random: (min: number, max: number) => Math.random() * (max - min) + min,
};

const gsap = Object.assign(to, { to, fromTo, context, utils });

export default gsap;
export { to, fromTo, context, utils };
