# Contributing to NeramPokku

We welcome contributions to NeramPokku! Since this is an ephemeral, real-time public message pool designed to be simple and lightweight, we prioritize keeping dependencies minimal and performance fast.

## Code of Conduct

Please treat other contributors with respect and maintain a welcoming environment.

## How to Contribute

1. **Fork the Repository**: Create your own copy of the codebase.
2. **Local Setup**: Follow the instructions in the [README.md](README.md) to set up client and server environments.
3. **Make Changes**: Create a branch for your modifications.
4. **Testing**: Test the real-time message stream, expiry timers, and rate-limiting limits locally.
5. **Submit a Pull Request**: Provide a detailed description of your changes, what problems they solve, and how they were tested.

## Development Style Guidelines

- **Minimalist Aesthetic**: The UI must remain dark-only, typography-focused, near-black, and mobile-first. Avoid introducing generic dashboard layouts, sidebars, or heavy CSS frameworks.
- **Strictly Ephemeral**: Never add permanent databases, logs, accounts, DMs, or persistent state. All message activity must live solely in server RAM.
