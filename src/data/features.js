/* On/off switches for whole sections. A section switched off keeps all its
   code, text and data — flip it back to true to bring it back unchanged. */
export const features = {
  // the monthly-plans slider (Home + Services), its footer link and its search results
  pricing: false,
};

// links to a section that is switched off are left out
export const isLinkOn = (to = "") => features.pricing || !to.includes("#pricing");
