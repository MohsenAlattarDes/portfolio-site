export const INTRO_COMPLETE_EVENT = "site-intro-complete";

export function dispatchIntroComplete() {
  window.dispatchEvent(new Event(INTRO_COMPLETE_EVENT));
}
