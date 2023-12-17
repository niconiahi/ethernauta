## Philosophy

This module aims to be an un-opinionated representation of the [abi-spec](https://docs.soliditylang.org/en/latest/abi-spec.html) in a completely modular fashion. It it's _absolutely_ typed-safe because it uses validation schemas to validate every piece of information. If any information that do not completely comply with the validation schema, it will throw an error, effectively stopping execution. Perfect for the safe enviroment we need to run while using Ethereum

## Future

- [] Via CLI, accept a JSON ABI file and output a folder which contains each ABI functions, events and errors as a single file with an `index.ts` file which exports all of them, effectively utilizing the same arquitecture as this project, in order to preserve tree-shaking and small and minimalistic bundles

## Features

- Validation schemas to verify that a JSON ABI json object is valid or not. Only pieces of information defined on the ABI specification will be present. If it contains other pieces of data the validation will fail, effectively making it incredibly secure

### Files to pay attention

#### error

1. [error/error.ts](src/error/error.ts)

#### client

2. [client/client.ts](src/event/event.ts)

#### shared

2. [shared/shared.ts](src/shared/shared.ts)

#### function

3. [function/shared/shared.ts](src/function/shared/shared.ts)
4. [function/function/function.ts](src/function/function/function.ts)
5. [function/constructor/constructor.ts](src/function/constructor/constructor.ts)
6. [function/fallback/fallback.ts](src/function/fallback/fallback.ts)
7. [function/receive/receive.ts](src/function/receive/receive.ts)
