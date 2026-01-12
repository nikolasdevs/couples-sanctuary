// "use client";
// import { createContext, useContext, useState } from "react";

// const MidnightContext = createContext({
//   midnight: false,
//   isDark: false,
//   toggle: () => {},
// });

// export function MidnightProvider({ children }: { children: React.ReactNode }) {
//   const [midnight, setMidnight] = useState(false);
//   return (
//     <MidnightContext.Provider
//       value={{
//         midnight,
//         isDark: midnight,
//         toggle: () => setMidnight(!midnight),
//       }}
//     >
//       <div className={midnight ? "midnight" : ""}>{children}</div>
//     </MidnightContext.Provider>
//   );
// }

// export const useMidnight = () => useContext(MidnightContext);
