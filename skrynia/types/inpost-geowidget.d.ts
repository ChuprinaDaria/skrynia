/**
 * Type definitions for InPost Geowidget custom HTML element
 */

declare namespace JSX {
  interface IntrinsicElements {
    'inpost-geowidget': {
      /** PUBLIC token from Parcel Manager */
      token: string;
      /** Comma-separated country codes (PL,BE,IT,FR,LU,PT,ES,NL). Only for International version */
      country?: string;
      /** Widget language: pl, en, uk (v5) or pl, en, uk, es, fr, pt, it (International) */
      language?: string;
      /** Configuration for point types: parcelCollect, parcelCollectPayment, parcelCollect247, parcelSend, cooledDeposit */
      config?: string;
      /** Event handler name for point selection */
      onpoint?: string;
      /** Widget element ID for API access */
      id?: string;
      /** Additional props */
      [key: string]: any;
    };
  }
}

