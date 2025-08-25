import {
  array,
  literal,
  object,
  string,
  variant,
} from "valibot"
import { tupleSchema, typeSchema } from "./shared"

// TODO: this is the real type in need, but I have to solve the self-recursion problem
//       for now, tuple are allowed to be only one-dimensional
// export const error_tupleSchema = merge([
//   tupleSchema,
//   object({
//     components: array(error_inputSchema),
//   }),
// ])
// // ```ts
// import type { BaseSchema, Output } from "valibot";
// import { array, merge, object, parse, recursive, string } from "valibot";

// const baseCategorySchema = object({
//   name: string(),
// });

// type Category = Output<typeof baseCategorySchema> & {
//   subcategories?: Category[];
// };

// const categorySchema: BaseSchema<Category> = merge([
//   baseCategorySchema,
//   object({ subcategories: recursive(() => array(categorySchema)) }),
// ]);

// const result = parse(categorySchema, {
//   name: "People",
//   subcategories: [
//     {
//       name: "Politicians",
//       subcategories: [
//         {
//           name: "Presidents",
//           subcategories: [],
//         },
//       ],
//     },
//   ],
// });
// ```
export const error_tupleSchema = object({
  ...tupleSchema.entries,
  components: array(
    object({
      name: string(),
      type: typeSchema,
    }),
  ),
})
export const error_inputSchema = variant("type", [
  object({
    name: string(),
    type: typeSchema,
  }),
  error_tupleSchema,
])
export const errorSchema = object({
  type: literal("error"),
  name: string(),
  inputs: array(error_inputSchema),
})
