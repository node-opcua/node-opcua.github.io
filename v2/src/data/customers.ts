export type CustomerDisplay = "logo" | "name" | "generic";
export type CustomerTier = "primary" | "secondary";

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
  /** Primary or secondary tier */
  tier: CustomerTier;
}

export const customers: Customer[] = [
  // Primary Tier
  {
    id: "mercedes-benz",
    name: "Mercedes-Benz",
    logo: "/v2/logos/mercedes-benz.jpg",
    display: "logo",
    fallbackText: "Mercedes-Benz™",
    genericText: "a Fortune 500 automotive OEM",
    tier: "primary",
  },
  {
    id: "renault",
    name: "Renault",
    logo: "/v2/logos/renault.png",
    display: "logo",
    fallbackText: "Renault™",
    genericText: "a European automotive manufacturer",
    tier: "primary",
  },
  {
    id: "siemens",
    name: "Siemens",
    logo: "/v2/logos/siemens.png",
    display: "logo",
    fallbackText: "Siemens™",
    genericText: "a global industrial automation leader",
    tier: "primary",
  },
  {
    id: "litmus",
    name: "Litmus",
    logo: "/v2/logos/litmus.png",
    display: "logo",
    fallbackText: "Litmus™",
    genericText: "an industrial IoT platform",
    tier: "primary",
  },
  {
    id: "tulip",
    name: "Tulip",
    logo: "/v2/logos/tulip.png",
    display: "logo",
    fallbackText: "Tulip™",
    genericText: "a frontline operations platform",
    tier: "primary",
  },
  {
    id: "apprentice-fs",
    name: "Apprentice FS",
    logo: "/v2/logos/apprentice-fs.png",
    display: "logo",
    fallbackText: "Apprentice FS™",
    genericText: "a pharmaceutical manufacturing software vendor",
    tier: "primary",
  },
  // Secondary Tier
  {
    id: "aws",
    name: "AWS",
    logo: "",
    display: "name",
    fallbackText: "AWS™",
    genericText: "a major cloud platform",
    tier: "secondary",
  },
  {
    id: "ibm",
    name: "IBM",
    logo: "/v2/logos/ibm.png",
    display: "logo",
    fallbackText: "IBM™",
    genericText: "a global technology corporation",
    tier: "secondary",
  },
  {
    id: "sap",
    name: "SAP",
    logo: "/v2/logos/sap.png",
    display: "logo",
    fallbackText: "SAP™",
    genericText: "an enterprise application software leader",
    tier: "secondary",
  },
  {
    id: "capgemini",
    name: "Capgemini",
    logo: "/v2/logos/capgemini.png",
    display: "logo",
    fallbackText: "Capgemini™",
    genericText: "a global consulting and IT services provider",
    tier: "secondary",
  },
  {
    id: "node-red",
    name: "Node-RED",
    logo: "/v2/logos/node-red.png",
    display: "logo",
    fallbackText: "Node-RED™",
    genericText: "a low-code programming tool for event-driven applications",
    tier: "secondary",
  },
  {
    id: "valmet",
    name: "Valmet",
    logo: "/v2/logos/valmet.png",
    display: "logo",
    fallbackText: "Valmet™",
    genericText: "a developer and supplier of industrial automation technologies",
    tier: "secondary",
  },
  {
    id: "cedalo",
    name: "Cedalo",
    logo: "/v2/logos/cedalo.png",
    display: "logo",
    fallbackText: "Cedalo™",
    genericText: "an MQTT broker and stream processing solutions provider",
    tier: "secondary",
  },
  {
    id: "braincube",
    name: "BrainCube",
    logo: "/v2/logos/braincube.png",
    display: "logo",
    fallbackText: "BrainCube™",
    genericText: "an industrial IoT platform provider",
    tier: "secondary",
  },
  {
    id: "single",
    name: "Single",
    logo: "/v2/logos/single.png",
    display: "logo",
    fallbackText: "Single™",
    genericText: "a temperature control system manufacturer",
    tier: "secondary",
  },
  {
    id: "tum",
    name: "TUM",
    logo: "/v2/logos/tum.jpg",
    display: "logo",
    fallbackText: "TUM™",
    genericText: "Technical University of Munich",
    tier: "secondary",
  },
  {
    id: "mit",
    name: "MIT",
    logo: "/v2/logos/mit.jpg",
    display: "logo",
    fallbackText: "MIT™",
    genericText: "Massachusetts Institute of Technology",
    tier: "secondary",
  },
  {
    id: "actiw",
    name: "ACTIW",
    logo: "/v2/logos/actiw.png",
    display: "logo",
    fallbackText: "ACTIW™",
    genericText: "an automated warehouse solutions provider",
    tier: "secondary",
  },
  {
    id: "cybus",
    name: "Cybus",
    logo: "",
    display: "name",
    fallbackText: "Cybus",
    genericText: "an IIoT connectivity platform",
    tier: "secondary",
  },
  {
    id: "teeptrak",
    name: "TeepTrak",
    logo: "",
    display: "name",
    fallbackText: "TeepTrak",
    genericText: "a manufacturing performance platform",
    tier: "secondary",
  },
  {
    id: "scantech",
    name: "Scantech",
    logo: "",
    display: "name",
    fallbackText: "Scantech",
    genericText: "a French industrial software vendor",
    tier: "secondary",
  },
  {
    id: "ellistat",
    name: "Ellistat",
    logo: "",
    display: "name",
    fallbackText: "Ellistat",
    genericText: "a statistical process control software vendor",
    tier: "secondary",
  },
];
