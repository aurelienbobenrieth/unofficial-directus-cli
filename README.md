# Unofficial Directus CLI

This repository can be seen as an alternative proposal to the current [Directus CLI](https://github.com/directus/cli).

> Note: The code is a very brief work in progress. At the moment only types generation from a Directus instance is supported.

## How it works

### Install the CLI

At this time, the CLI is not yet available via npm, yarn or pnpm. However, I have added an installable version to the GitHub repository.

```bash
yarn add https://github.com/aurelienbobenrieth/unofficial-directus-cli/raw/main/unofficial-directus-cli-v0.1.0.tgz
```

## Usage

```shell
unofficial-directus-cli [command]
```

## Commands

### `typegen`

Generate types from a Directus schema.

```shell
unofficial-directus-cli typegen <directusUrl> <staticToken> [options]
```

- `<directusUrl>`: Directus base URL.
- `<staticToken>`: Admin user static token.

Options:

- `-o, --outputPath <outputPath>`: Path where the generated types will be saved. Default: `./directus-types.ts`.
- `-c, --collectionName <collectionName>`: Custom collection name for your generated types. Default: `DirectusTypes`.
- `-s, --sdkPath <sdkPath>`: The path from where the unofficial SDK should be loaded. Default: `directus-sdk`.

Example:

```shell
unofficial-directus-cli typegen https://localhost:8055 myStaticToken -o ./types/directus-types.ts -c CustomDirectusTypes
```

Please note that the `typegen` command requires an active Directus instance.

## Version

To check the version of the CLI, you can use the `-v` or `--vers` option:

```shell
unofficial-directus-cli -v
```

or

```shell
unofficial-directus-cli --vers
```
