---
title: "v2.174.0: full OPC UA Role-Based Security ships in open source"
date: 2026-06-30
category: release-notes
description: "NodeOPCUA v2.174.0 ships the complete OPC 10000-18 Role-Based Security and User Management model in the MIT-licensed core. One-call setup, encrypted persistence, admin over OPC UA itself."
permalink: release-notes/2026/06/30/v2-174-0-role-based-security
ogImage: "og/v2-174-0-release-og.png"
---

v2.174.0 is the largest security release in the project's history.

The complete OPC UA Part 18 (OPC 10000-18) Role-Based Security and User Management information model now ships in the MIT-licensed core of NodeOPCUA. Months of implementation work condensed into four things every OPC UA server operator has been asking for.

**The eight well-known Roles.** `Anonymous`, `AuthenticatedUser`, `Observer`, `Operator`, `Engineer`, `Supervisor`, `ConfigureAdmin`, `SecurityAdmin`. Plus `AddRole` and `RemoveRole` for custom roles created at runtime, with no server restart.

**All nine identity criteria types.** `UserName`, X.509 Distinguished Name, JWT `roles` and `groups` claims, application certificates, `Thumbprint`, and the rest. Live-editable via `AddIdentity` and `RemoveIdentity`.

**A hardened local user store.** Salted scrypt password hashing. Optional AES-256-GCM encrypted persistence. `AddUser`, `ModifyUser`, `RemoveUser`, `ChangePassword`. Password complexity policy enforced at the wire, advertised to clients via `PasswordOptionsMask`.

**One-call setup.** `createRoleBasedSecurity(server, {...})` wires everything in, including user seeding, identity rules, application and endpoint restrictions, and persistence. About 30 lines of TypeScript for a fully secured server.

## What is in the release

Five packages:

- `node-opcua-role-set-common`: framework-agnostic building blocks (identity and user stores, encrypted archive, X.509 and UserName matching, well-known Role NodeIds).
- `node-opcua-role-set-server`: server-side install of the `RoleSet` and `UserManagement` Methods, session Role resolution, persistence, and hardening of sensitive nodes.
- `node-opcua-role-set-client`: client-side API to browse Roles, edit identities, and administer users over a real OPC UA session.
- `node-opcua-role-set-admin`: a ready-to-ship command-line tool built on the client.
- `node-opcua-role-set-test`: integration tests and a runnable sample server.

The `role-set-admin` CLI is worth a specific mention. It is a normal OPC UA client that speaks the standard `RoleSet` and `UserManagement` Methods. Any conformant OPC UA server (not only NodeOPCUA) can be administered with it.

## Beyond RBAC

Alongside the Part 18 work, v2.174.0 includes the usual round of fixes, small performance improvements, and community-contributed PRs. Full changelog on GitHub.

## Where to read more

- [Role-Based Security reference documentation](/role_based_security.html) on this site: architecture, API, identity mapping, security model, persistence, CLI, and a migration guide from a hand-rolled `userManager`.
- [v2.174.0 release notes on GitHub](https://github.com/node-opcua/node-opcua/releases/tag/v2.174.0): every change in the release.
- [OPC UA Role-Based Security in Practice](https://www.sterfive.com/en/blog/opcua-role-based-security-nodeopcua-2-174-0/) on the Sterfive blog: why this matters at the deployment-security level, with a working code example and a walkthrough against the OPC UA specification.

## Contributions welcome

Bugs, PRs, discussion: [github.com/node-opcua/node-opcua](https://github.com/node-opcua/node-opcua). Every release ships with community contributions. This one included several.
