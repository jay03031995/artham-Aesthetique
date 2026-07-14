import {objectTypes} from './objects'
import {siteSettingsType} from './siteSettingsType'
import {categoryType} from './categoryType'
import {treatmentType} from './treatmentType'
import {doctorType} from './doctorType'
import {beforeAfterType} from './beforeAfterType'
import {postType} from './postType'
import {offerType} from './offerType'
import {testimonialType} from './testimonialType'
import {faqType} from './faqType'
import {appointmentType} from './appointmentType'
import {
  homePageType,
  aboutPageType,
  contactPageType,
  footerSettingsType,
  seoSettingsType,
  navigationSettingsType,
} from './pageTypes'

export const schemaTypes = [
  // documents
  siteSettingsType,
  categoryType,
  treatmentType,
  doctorType,
  beforeAfterType,
  postType,
  offerType,
  testimonialType,
  faqType,
  appointmentType,
  homePageType,
  aboutPageType,
  contactPageType,
  footerSettingsType,
  seoSettingsType,
  navigationSettingsType,
  // shared objects
  ...objectTypes,
]
