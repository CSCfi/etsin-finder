/* eslint-disable no-unused-expressions */
import * as yup from 'yup'
import translate from 'counterpart'

// DATASET DESCRIPTION VALIDATION

const titleSchema = yup.object().shape({
  fi: yup.mixed().when('en', {
    is: val => val.length > 0,
    then: yup
      .string(translate('qvain.validationMessages.title.string'))
      .max(500, translate('qvain.validationMessages.title.max')),
    otherwise: yup
      .string(translate('qvain.validationMessages.title.string'))
      .max(500, translate('qvain.validationMessages.title.max'))
      .required(translate('qvain.validationMessages.title.required')),
  }),
  en: yup
    .string(translate('qvain.validationMessages.title.string'))
    .max(500, translate('qvain.validationMessages.title.max')),
})

const descriptionSchema = yup.object().shape({
  fi: yup.mixed().when('en', {
    is: val => val.length > 0,
    then: yup
      .string(translate('qvain.validationMessages.description.string'))
      .max(50000, translate('qvain.validationMessages.description.max')),
    otherwise: yup
      .string(translate('qvain.validationMessages.description.string'))
      .max(50000, translate('qvain.validationMessages.description.max'))
      .required(translate('qvain.validationMessages.description.required')),
  }),
  en: yup
    .string(translate('qvain.validationMessages.description.string'))
    .max(50000, translate('qvain.validationMessages.description.max')),
})

const keywordsSchema = yup
  .array()
  .of(
    yup
      .string(translate('qvain.validationMessages.keywords.string'))
      .max(1000, translate('qvain.validationMessages.keywords.max'))
  )
  .required(translate('qvain.validationMessages.keywords.required'))

const otherIdentifierSchema = yup
  .string(translate('qvain.validationMessages.otherIdentifiers.string'))
  .min(10, translate('qvain.validationMessages.otherIdentifiers.min'))
  .url(translate('qvain.validationMessages.otherIdentifiers.url'))
  .max(1000, translate('qvain.validationMessages.otherIdentifiers.max'))

const otherIdentifiersSchema = yup
  .array()
  .of(otherIdentifierSchema)
  .nullable()

// LICENSE AND ACCESS VALIDATION

// you have to provide the license object and the otherLicenseUrl
const licenseSchema = yup.object().shape({
  name: yup.object().nullable(),
  identifier: yup.string().required(),
  otherLicenseUrl: yup
    .mixed()
    .when('identifier', {
      is: 'other',
      then: yup
        .string(translate('qvain.validationMessages.license.otherUrl.string'))
        .url(translate('qvain.validationMessages.license.otherUrl.url'))
        .required(translate('qvain.validationMessages.license.otherUrl.required')),
      otherwise: yup
        .string()
        .url()
        .nullable(),
    })
    .nullable(),
})

const accessTypeSchema = yup.object().shape({
  name: yup.string(),
  url: yup
    .string(translate('qvain.validationMessages.accessType.string'))
    .url(translate('qvain.validationMessages.accessType.url'))
    .required(translate('qvain.validationMessages.accessType.required')),
})

const embargoExpDateSchema = yup.date().nullable()

const restrictionGroundsSchema = yup
  .string(translate('qvain.validationMessages.restrictionGrounds.string'))
  .url(translate('qvain.validationMessages.restrictionGrounds.url'))
  .required(translate('qvain.validationMessages.restrictionGrounds.required'))

// PARTICIPANT VALIDATION SCHEMAS

const participantType = yup
  .mixed()
  .oneOf(['person', 'organization'], translate('qvain.validationMessages.participants.type.oneOf'))
  .required(translate('qvain.validationMessages.participants.type.required'))

const participantRolesSchema = yup
  .array()
  .of(
    yup
      .mixed()
      .oneOf(
        ['creator', 'curator', 'publisher'],
        translate('qvain.validationMessages.participants.roles.oneOf')
      )
  )
  .required(translate('qvain.validationMessages.participants.roles.required'))

const participantNameSchema = yup
  .string(translate('qvain.validationMessages.participants.name.string'))
  .max(1000, translate('qvain.validationMessages.participants.name.max'))
  .required(translate('qvain.validationMessages.participants.name.required'))

const participantEmailSchema = yup
  .string(translate('qvain.validationMessages.participants.email.string'))
  .max(1000, translate('qvain.validationMessages.participants.email.max'))
  .email(translate('qvain.validationMessages.participants.email.email'))
  .nullable()

const participantIdentifierSchema = yup
  .string()
  .max(1000, translate('qvain.validationMessages.participants.identifier.max'))
  .nullable()

const participantOrganizationSchema = yup.object().shape({
  type: yup
    .mixed()
    .oneOf(
      ['person', 'organization'],
      translate('qvain.validationMessages.participants.type.oneOf')
    )
    .required(translate('qvain.validationMessages.participants.type.required')),
  organization: yup.mixed().when('type', {
    is: 'person',
    then: yup
      .object()
      .required(translate('qvain.validationMessages.participants.organization.required')),
    otherwise: yup
      .object(translate('qvain.validationMessages.participants.organization.object'))
      .shape({
        value: yup
          .string(translate('qvain.validationMessages.participants.organization.string'))
          .nullable(),
      }),
  }),
})

// DATA CATALOG
const dataCatalogSchema = yup
  .string()
  .required(translate('qvain.validationMessages.files.dataCatalog.required'))

// FILE AND DIRECTORY (IDA RESOURCES) VALIDATION

const fileUseCategorySchema = yup
  .string()
  .required(translate('qvain.validationMessages.files.file.useCategory.required'))

const fileTitleSchema = yup
  .string()
  .required(translate('qvain.validationMessages.files.file.title.required'))

const fileDescriptionSchema = yup
  .string()
  .required(translate('qvain.validationMessages.files.file.description.required'))

const fileSchema = yup.object().shape({
  title: fileTitleSchema,
  description: fileDescriptionSchema,
  useCategory: fileUseCategorySchema,
  fileType: yup.string().nullable(),
})

const filesSchema = yup.array().of(fileSchema)

const directoryTitleSchema = yup
  .string()
  .required(translate('qvain.validationMessages.files.directory.title.required'))

const directoryDescriptionSchema = yup.string()

const directoryUseCategorySchema = yup
  .string()
  .required(translate('qvain.validationMessages.files.directory.useCategory.required'))

const directorySchema = yup.object().shape({
  title: directoryTitleSchema,
  description: directoryDescriptionSchema,
  useCategory: directoryUseCategorySchema,
  fileType: yup.string().nullable(),
})

const directoriesSchema = yup.array().of(directorySchema)

// EXTERNAL RESOURCES VALIDATION

const externalResourceTitleSchema = yup
  .string()
  .required(translate('qvain.validationMessages.externalResources.title.required'))

// Use category is one of preset 7 options (all strings)
const externalResourceUseCategorySchema = yup
  .string()
  .required(translate('qvain.validationMessages.externalResources.useCategory.required'))

const externalResourceUrlSchema = yup
  .string()
  .url(translate('qvain.validationMessages.externalResources.url.url'))
  .required(translate('qvain.validationMessages.externalResources.url.required'))

const externalResourceSchema = yup.object().shape({
  title: externalResourceTitleSchema,
  useCategory: externalResourceUseCategorySchema,
  url: externalResourceUrlSchema,
})

// ENTIRE PARTICIPANT SCHEMAS

const participantSchema = yup.object().shape({
  type: participantType,
  role: participantRolesSchema,
  name: participantNameSchema,
  email: participantEmailSchema,
  identifier: participantIdentifierSchema,
  organization: yup.mixed().when('type', {
    is: 'person',
    then: yup
      .object()
      .required(translate('qvain.validationMessages.participants.organization.required')),
    otherwise: yup
      .object()
      .nullable(),
  }),
})

const participantsSchema = yup
  .array()
  .of(
    yup.object().shape({
      type: participantType,
      role: participantRolesSchema,
      name: participantNameSchema,
      email: participantEmailSchema,
      identifier: participantIdentifierSchema,
      organization: yup.mixed().when('type', {
        is: 'person',
        then: yup
          .object()
          .required(translate('qvain.validationMessages.participants.organization.required')),
        otherwise: yup
          .object()
          .nullable(),
      }),
    })
  )
  // Test: loop through the participant list and the roles of each participant
  // A Creator and a Publisher must be found in the participant list in order to allow the dataset to be posted to the database
  .test(
    'contains-creator-and-publisher',
    translate('qvain.validationMessages.participants.requiredParticipants.required'),
    (value) => {
      let foundCreator = false;
      let foundPublisher = false;
        for (let i = 0; i < value.length; i += 1) {
          for (let j = 0; j < value[i].role.length; j += 1) {
          if (value[i].role[j] === 'creator') {
            foundCreator = true;
          } else if (value[i].role[j] === 'publisher') {
            foundPublisher = true;
          }
        }
      }
      if (foundCreator && foundPublisher) {
        return true;
      }
      return false;
    })
  .required()

// ENTIRE FORM VALIDATION

const qvainFormSchema = yup.object().shape({
  title: titleSchema,
  description: descriptionSchema,
  fieldOfScience: yup.string(),
  keywords: keywordsSchema,
  otherIdentifiers: otherIdentifiersSchema,
  accessType: accessTypeSchema,
  license: yup
    .mixed()
    .when('dataCatalog', {
      is: 'urn:nbn:fi:att:data-catalog-ida',
      then: yup.object().shape({
        name: yup.object().nullable(),
        identifier: yup.string()
        }).required(translate('qvain.validationMessages.license.requiredIfIDA')),
      otherwise: yup.object().shape({
        name: yup.object().nullable(),
        identifier: yup.string()
        }),
    }),
  otherLicenseUrl: yup
    .mixed()
    .when('license.identifier', {
      is: 'other',
      then: yup
        .string(translate('qvain.validationMessages.license.otherUrl.string'))
        .url(translate('qvain.validationMessages.license.otherUrl.url'))
        .required(translate('qvain.validationMessages.license.otherUrl.required')),
      otherwise: yup
        .string()
        .url()
        .nullable(),
    })
    .nullable(),
  restrictionGrounds: yup.mixed().when('accessType.value', {
    is: 'Open',
    then: restrictionGroundsSchema,
  }),
  participants: participantsSchema,
  dataCatalog: dataCatalogSchema,
  files: filesSchema,
  directories: directoriesSchema,
})

export {
  qvainFormSchema,
  titleSchema,
  descriptionSchema,
  otherIdentifierSchema,
  otherIdentifiersSchema,
  keywordsSchema,
  accessTypeSchema,
  licenseSchema,
  embargoExpDateSchema,
  restrictionGroundsSchema,
  participantsSchema,
  participantSchema,
  participantType,
  participantNameSchema,
  participantRolesSchema,
  participantEmailSchema,
  participantIdentifierSchema,
  participantOrganizationSchema,
  dataCatalogSchema,
  fileTitleSchema,
  fileDescriptionSchema,
  fileUseCategorySchema,
  fileSchema,
  filesSchema,
  directoryTitleSchema,
  directoryDescriptionSchema,
  directoryUseCategorySchema,
  directorySchema,
  directoriesSchema,
  externalResourceSchema,
  externalResourceTitleSchema,
  externalResourceUrlSchema,
}
