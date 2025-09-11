// /**
//  * @see https://github.com/ethanniser/NextMaster/blob/main/src/lib/unstable-cache.ts
//  */

// import { unstable_cache as next_unstable_cache } from "next/cache";
// import { cache } from "react";

// // next_unstable_cache doesn't handle deduplication, so we wrap it in React's cache
// export const unstable_cache = (
//   cb: (...args) => Promise,
//   keyParts: string[],
//   options?: {
//     /**
//      * The revalidation interval in seconds.
//      */
//     revalidate?: number | false;
//     tags?: string[];
//   },
// ) => cache(next_unstable_cache(cb, keyParts, options));
