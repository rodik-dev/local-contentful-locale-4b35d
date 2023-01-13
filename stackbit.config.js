import path from 'path';
import dotenv from 'dotenv';
// @stackbit/cms-contentful is a dev dependency, and not used by the site code itself.
import { ContentfulContentSource } from '@stackbit/cms-contentful';
import { defineStackbitConfig } from '@stackbit/types';

// For local development, share the .env file that the Next.js server reads
dotenv.config({ path: path.resolve(__dirname, '.env') });

const LOCALIZED_MODELS = ['localizedPage', 'CtaSection', 'MarkdownSection'];
const LOCALES = ['en-US', 'he']
const getDocumentLocale = (document) => {
    if (document.fields.slug) {
        return LOCALES.find((locale) => document.fields.slug?.value?.startsWith(locale));
    }

    return LOCALES.includes(document.fields?.locale?.value) ? document.fields?.locale.value : null;
};

console.log("DEBUG:: stackbit.config.js init");

class MyContentSource extends ContentfulContentSource {

    async createDocument(options) {
        if (LOCALIZED_MODELS.includes(options.model.name)) {
            const localeField = options.model.fields.find(field => field.name === 'locale');
            if (localeField) {
                options.updateOperationFields.locale = {  type: 'enum', value: options.locale};
            }

            const slugField = options.model.fields.find(field => field.name === 'slug');
            if (slug)
            if (slugField) {
                if (options.updateOperationFields?.slug && !options.updateOperationFields?.slug?.value.startsWith(options.locale)) {
                    throw new Error(`slug '${options.updateOperationFields?.slug?.value}' must start with locale '${options.locale}'`);
                }
            }

        }
        return super.createDocument(options);
    }
}

export default {
    stackbitVersion: '~0.6.0',
    ssgName: 'nextjs',
    nodeVersion: '16',

    // Only needed for repositories duplicatable through https://app.stackbit.com/import
    // for the automatic provisioning of space contents.
    import: {
        type: 'contentful',
        contentFile: 'contentful/export.json',
        uploadAssets: true,
        assetsDirectory: 'contentful',
        spaceIdEnvVar: 'CONTENTFUL_SPACE_ID',
        deliveryTokenEnvVar: 'CONTENTFUL_DELIVERY_TOKEN',
        previewTokenEnvVar: 'CONTENTFUL_PREVIEW_TOKEN',
        accessTokenEnvVar: 'CONTENTFUL_MANAGEMENT_TOKEN'
    },

    // contentSources is a list of modules implementing the ContentSourceInterface
    contentSources: [
        new MyContentSource({
            spaceId: process.env.CONTENTFUL_SPACE_ID,
            environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
            previewToken: process.env.CONTENTFUL_PREVIEW_TOKEN,
            accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
        })
    ],

    mapModels({models}) {
        return models.map((model) => {
            if (LOCALIZED_MODELS.includes(model.name)) {
                return {
                    ...model,
                    localized: true
                };
            }
            return model;
        });
    },

    mapDocuments({documents, models, locales}) {
        return documents.map((document) => {
            if (LOCALIZED_MODELS.includes(document.modelName)) {
                const locale = getDocumentLocale(document);
                return {
                    ...document,
                    locale
                };
            }
            return document;
        });
    },

    // models property allows tweaking/extending any existing model (as well as adding new ones).
    // Typically used to mark page-type models for the visual editor and map content items of these
    // type to page URLs. This enables the editor to create a sitemap from content and open the
    // appropriate page fields for editing as you navigate between fields.
    models: {
        page: { type: 'page', urlPath: '/{slug}' },
        localizedPage: { type: 'page', urlPath: '/{slug}', locaized: true },
        CtaSection: {
            fields: [
                {
                    "type": "enum",
                    "name": "locale",
                    "label": "locale",
                    "required": false,
                    "hidden": true,
                    "localized": false,
                    "options": [
                        "he",
                        "en-US"
                    ]
                }
            ]
        }
    }
};
