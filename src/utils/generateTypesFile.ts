import { readItems } from 'directus-sdk';
import type { Client } from 'directus-sdk';
import fs from 'fs';
import { chalkLogger } from './chalkLogger';
import { toPascalCase } from './toPascalCase';

type TypesFileGenerationOptions = {
  adminClient: Client<any>;
  outputPath: string;
  collectionName: string;
  sdkPath: string;
};

const logger = chalkLogger();

async function prepareCollections({ adminClient }: any) {
  const [directusCollections] = await readItems(
    adminClient,
    'directus_collections',
    {
      limit: -1,
    }
  );
  const [fields] = await readItems(adminClient, 'directus_fields', {
    limit: -1,
  });
  const [relations] = await readItems(adminClient, 'directus_relations', {
    limit: -1,
  });

  const collections: any = directusCollections.reduce(
    (acc, collection: any) => {
      acc[collection.collection] = {
        ...collection,
        fields: fields.filter(
          (field: any) => field.collection === collection.collection
        ),
      };
      return acc;
    },
    {}
  );

  relations.forEach((relation: any) => {
    const oneField = collections[relation.meta?.one_collection]?.fields.find(
      (field: any) => field.field === relation.meta?.one_field
    );
    const manyField = collections[relation.meta?.many_collection]?.fields.find(
      (field: any) => field.field === relation.meta?.many_field
    );
    if (oneField) {
      oneField.relation = {
        type: 'many',
        collection: relation.meta?.many_collection,
      };
    }
    if (manyField) {
      manyField.relation = {
        type: 'one',
        collection: relation.meta?.one_collection,
      };
    }
  });

  return collections;
}

function getFieldType(field: any) {
  if (field?.schema?.is_primary_key) return 'ItemKey';

  if (field.relation) {
    return `${
      field.relation.collection
        ? `Relation<${toPascalCase(field.relation.collection)}>`
        : 'any'
    }${field.relation.type === 'many' ? '[]' : ''}`;
  }

  if (['integer', 'bigInteger', 'float', 'decimal'].includes(field.type))
    return 'number';

  if (['boolean'].includes(field.type)) return 'boolean';

  if (['json'].includes(field.type)) return 'Json<Record<string, any>>';

  if (['csv'].includes(field.type)) return 'string[]';

  return 'string';
}

async function generateTypes({ sdkPath, collectionName, collections }: any) {
  let typesTemplate = `import type {\n Item,\n Relation,\n ItemKey,\n DirectusUserItem,\n DirectusFileItem,\n Json,\n } from '${sdkPath}';\n\n`;

  const collectionTypes: string[] = [];

  Object.values(collections).forEach((directusCollection: any) => {
    const directusCollectionName = directusCollection.collection;
    const directusCollectionTypeName = toPascalCase(directusCollectionName);
    collectionTypes.push(
      `  ${directusCollectionName}: ${directusCollectionTypeName};`
    );
    typesTemplate += `export type ${directusCollectionTypeName} = Item<{\n`;
    directusCollection.fields.forEach((field: any) => {
      if (!field.meta?.interface?.startsWith('presentation-')) {
        typesTemplate += `  ${
          field.field.includes('-') ? `"${field.field}"` : field.field
        }: ${getFieldType(field)}${
          field.schema?.is_nullable ? ' | null' : ''
        };\n`;
      }
    });
    typesTemplate += '}>;\n\n';
  });

  typesTemplate += `export type ${collectionName} = {\n${collectionTypes.join(
    '\n'
  )}\n};`;

  return typesTemplate;
}

/**
 * Generates the types file based on Directus collections and output it to
 * the specified path.
 *
 */
export async function generateTypesFile({
  adminClient,
  outputPath,
  collectionName,
  sdkPath,
}: TypesFileGenerationOptions): Promise<void> {
  try {
    const collections = await prepareCollections({ adminClient });
    const types = await generateTypes({ sdkPath, collectionName, collections });
    fs.writeFileSync(outputPath, types);
  } catch (err) {
    logger.error('Something wrong happened during types generation.');

    if (err instanceof Error) logger.error(err.message);
    else if (typeof err === 'string') logger.error(err);

    process.exit(1);
  }
}
