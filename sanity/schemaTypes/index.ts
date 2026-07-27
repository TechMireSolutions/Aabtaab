import { post } from "./post";
import { category } from "./category";
import { author } from "./author";
import { page } from "./page";
import { course } from "./course";
import { service } from "./service";
import { event } from "./event";
import { seoObject } from "./seoObject";
import { siteSettings } from "./siteSettings";
import { navigation } from "./navigation";
import { homepageSettings } from "./homepageSettings";
import { testimonial } from "./testimonial";
import { contactSubmission } from "./contactSubmission";
import { courseLevel } from "./courseLevel";

import { quote } from "./quote";

export const schemaTypes = [
  // Object types first — document schemas can reference them
  seoObject,
  // Documents
  post,
  category,
  author,
  page,
  course,
  courseLevel,
  service,
  event,
  siteSettings,
  navigation,
  homepageSettings,
  testimonial,
  contactSubmission,
  quote,
];
