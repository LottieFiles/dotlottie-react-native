/** How the animation fills its container. Mirrors the dotlottie core `Fit`. */
export type Fit =
  | 'contain' // default — whole animation visible, may letterbox
  | 'cover' // fill container, crop overflow
  | 'fill' // stretch to fill, ignores aspect ratio
  | 'fit-width' // match container width, may clip top/bottom
  | 'fit-height' // match container height, may clip sides
  | 'none'; // natural size, no scaling

/** Crop anchor. Each value 0..1; [0,0] = top-left, [1,1] = bottom-right. */
export type Align = [number, number];

export type Layout = {
  fit?: Fit;
  align?: Align;
};

export const DEFAULT_FIT: Fit = 'contain';
export const DEFAULT_ALIGN: Align = [0.5, 0.5];

const isValidAlign = (a: unknown): a is Align =>
  Array.isArray(a) && a.length === 2 && a.every((n) => typeof n === 'number');

/**
 * Normalize a `Layout` for the web player. Returns `undefined` when no layout
 * is supplied so the web default (contain) is preserved.
 *
 * NOTE: if `@lottiefiles/dotlottie-react` requires a `Fit` enum value rather
 * than the kebab string, map `fit` to that enum here (open item #3).
 */
export function toWebLayout(
  layout?: Layout
): { fit: Fit; align: Align } | undefined {
  if (!layout) return undefined;
  return {
    fit: layout.fit ?? DEFAULT_FIT,
    align: isValidAlign(layout.align) ? layout.align : DEFAULT_ALIGN,
  };
}
