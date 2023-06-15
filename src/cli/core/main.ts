import { Command } from 'commander';
import { typeGen } from '../commands';

export function initClit() {
  const program = new Command();

  program
    .name('directus-sdk-cli')
    .description('Unofficial Directus sdk CLI')
    .version('0.1.0-alpha.3', '-v, --vers', 'output the current version');

  program
    .command('typegen')
    .description('Generate types from a Directus schema')
    .argument('<directusUrl>', 'directus base URL')
    .argument('<staticToken>', 'admin user static token')
    .option(
      '-o, --outputPath <outputPath>',
      'path where the generated types will be saved',
      './directus-types.ts'
    )
    .option(
      '-c, --collectionName <collectionName>',
      'custom collection name for your generated types',
      'DirectusTypes'
    )
    .option(
      '-c, --sdkPath <collectionName>',
      'the path from where @fabian-hiller unofficial sdk should be loaded',
      'directus-sdk'
    )
    .action(async (directusUrl, staticToken, options) => {
      await typeGen({
        directusUrl,
        staticToken,
        options,
      });
    });

  program.parse();
}
