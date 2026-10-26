// A subject picked within a level (cart label "A2 Level — Physics") is priced
// at this share of the full course price.
export const SUBJECT_PRICE_RATIO = 0.4;

const SUBJECT_SEPARATOR = ' — ';

export function selectionPricePKR(coursePrice: number, selectedLevel: string): number {
  return selectedLevel.includes(SUBJECT_SEPARATOR)
    ? Math.round(coursePrice * SUBJECT_PRICE_RATIO)
    : coursePrice;
}
