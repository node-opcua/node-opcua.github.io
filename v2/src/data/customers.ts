export type CustomerDisplay = "logo" | "name" | "generic";

export interface Customer {
  /** Internal identifier — never displayed */
  id: string;
  /** Real company name */
  name: string;
  /** Path to logo, relative to /v2/ */
  logo: string;
  /** Current display mode */
  display: CustomerDisplay;
  /** Text fallback when display === "name". Use trademark notation if appropriate. */
  fallbackText: string;
  /** Generic phrase used ONLY when display === "generic". Anonymizes the company. */
  genericText: string;
}

export const customers: Customer[] = [
  {
    id: "mercedes-benz",
    name: "Mercedes-Benz",
    logo: "/v2/logos/mercedes-benz.jpg",
    display: "logo",
    fallbackText: "Mercedes-Benz™",
    genericText: "a Fortune 500 automotive OEM",
  },
  {
    id: "renault",
    name: "Renault",
    logo: "/v2/logos/renault.png",
    display: "logo",
    fallbackText: "Renault™",
    genericText: "a European automotive manufacturer",
  },
  {
    id: "siemens",
    name: "Siemens",
    logo: "/v2/logos/siemens.png",
    display: "logo",
    fallbackText: "Siemens™",
    genericText: "a global industrial automation leader",
  },
  {
    id: "litmus",
    name: "Litmus",
    logo: "/v2/logos/litmus.png",
    display: "logo",
    fallbackText: "Litmus™",
    genericText: "an industrial IoT platform",
  },
  {
    id: "tulip",
    name: "Tulip",
    logo: "/v2/logos/tulip.png",
    display: "logo",
    fallbackText: "Tulip™",
    genericText: "a frontline operations platform",
  },
  {
    id: "apprentice-fs",
    name: "Apprentice FS",
    logo: "/v2/logos/apprentice-fs.png",
    display: "logo",
    fallbackText: "Apprentice FS™",
    genericText: "a pharmaceutical manufacturing software vendor",
  },
];
