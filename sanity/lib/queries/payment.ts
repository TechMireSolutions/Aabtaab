import { groq } from "next-sanity";

export const paymentMethodsQuery = groq`
*[_type == "paymentMethod"] | order(order asc, _createdAt asc) {
  _id,
  title,
  icon,
  accountTitle,
  accountNumber,
  bankName
}`;