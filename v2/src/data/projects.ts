export interface Repo {
  name: string;
  url: string;
  description: string;
  highlighted?: boolean;
}

export interface RepoGroup {
  title: string;
  repos: Repo[];
}

export const projectGroups: RepoGroup[] = [
  {
    title: "Core libraries",
    repos: [
      { name: "node-i3x", url: "https://github.com/node-opcua/node-i3x",
        description: "An implementation of the CESMII Industrial Information Interoperability eXchange (i3X) API for Node.js, bridging OPC UA address spaces to i3X context models.",
        highlighted: true },
      { name: "node-opcua", url: "https://github.com/node-opcua/node-opcua",
        description: "The main client and server SDK." },
      { name: "node-opcua-pki", url: "https://github.com/node-opcua/node-opcua-pki",
        description: "PKI and certificate management for OPC UA." },
      { name: "node-opcua-crypto", url: "https://github.com/node-opcua/node-opcua-crypto",
        description: "Certificate tools, encryption, and signature support." },
    ],
  },
  {
    title: "Companion specifications",
    repos: [
      { name: "node-opcua-isa95", url: "https://github.com/node-opcua/node-opcua-isa95",
        description: "ISA-95 extension for node-opcua server." },
    ],
  },
  {
    title: "Tooling",
    repos: [
      { name: "opcua-commander", url: "https://github.com/node-opcua/opcua-commander",
        description: "OPC UA client with a blessed (ncurses) terminal UI." },
      { name: "bench-opcua", url: "https://github.com/node-opcua/bench-opcua",
        description: "Performance benchmarks for OPC UA servers." },
      { name: "node-opcua-sampleserver", url: "https://github.com/node-opcua/node-opcua-sampleserver",
        description: "A simple reference OPC UA server based on node-opcua." },
      { name: "node-opcua-htmlpanel", url: "https://github.com/node-opcua/node-opcua-htmlpanel",
        description: "Small HTML panel for displaying monitored variables." },
    ],
  },
  {
    title: "AI and integrations",
    repos: [
      { name: "node-opcua-modeler-mcp-server",
        url: "https://github.com/node-opcua/node-opcua-modeler-mcp-server",
        description: "MCP server for OPC UA information modeling, designed for AI agents building industrial automation models." },
    ],
  },
  {
    title: "Related projects",
    repos: [
      { name: "node-wot-opcua-tools", url: "https://github.com/node-opcua/node-wot-opcua-tools",
        description: "Tools for bridging (node-)WoT and (node-)OPCUA." },
      { name: "node-opcua-sample", url: "https://github.com/node-opcua/node-opcua-sample",
        description: "A simple OPC UA sample client demonstrating SDK usage." },
    ],
  },
];
