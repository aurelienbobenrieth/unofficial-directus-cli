import { getAdminClient } from 'directus-sdk';
import {
  validateAdminClient,
  chalkLogger,
  generateTypesFile,
} from '../../utils';

type TypeGenerationOptions = {
  directusUrl: string;
  staticToken: string;
  options: {
    outputPath: string;
    collectionName: string;
    sdkPath: string;
  };
};

const logger = chalkLogger();

export async function typeGen({
  directusUrl,
  staticToken,
  options,
}: TypeGenerationOptions) {
  logger.info(`Starting types generation for '${directusUrl}'...`);

  const { outputPath, collectionName, sdkPath } = options;
  const adminClient = getAdminClient({
    url: directusUrl,
    staticToken,
  });
  await validateAdminClient({ adminClient });

  await generateTypesFile({ adminClient, outputPath, collectionName, sdkPath });

  logger.success(
    `<${collectionName}> have been successfully generated at '${outputPath}'!`
  );
}
