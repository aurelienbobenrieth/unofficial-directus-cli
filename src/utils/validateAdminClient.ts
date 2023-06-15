import type { Client } from 'directus-sdk';
import { readUser } from 'directus-sdk';
import { chalkLogger } from './chalkLogger';

type AdminClientValidationOptions = {
  adminClient: Client<any>;
};

const logger = chalkLogger();

/**
 * Validate the static token as well as the connection the admin client by
 * trying to read the user.
 *
 * @param adminClient - The admin client.
 *
 */
export async function validateAdminClient({
  adminClient,
}: AdminClientValidationOptions): Promise<boolean> {
  try {
    logger.info('Connectiong to the Directus server...');

    return !!(await readUser(adminClient, 'me'));
  } catch (err) {
    logger.error(
      'The connection to the Directus server failed.\nPlease both the static token and ensure that your Directus instance is up and running.'
    );
    process.exit(1);
  }
}
