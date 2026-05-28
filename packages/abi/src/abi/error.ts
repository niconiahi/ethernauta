import {
  array,
  literal,
  object,
  string,
  variant,
} from "valibot"
import { TupleSchema, TypeSchema } from "./shared"

// TODO: this is the real type in need, but I have to solve the self-recursion problem
//       for now, tuple are allowed to be only one-dimensional
// export const Error_tupleSchema = merge([
//   TupleSchema,
//   object({
//     components: array(Error_inputSchema),
//   }),
// ])
// // ```ts
// import type { BaseSchema, Output } from "valibot";
// import { array, merge, object, parse, recursive, string } from "valibot";

// const BaseCategorySchema = object({
//   name: string(),
// });

// type Category = Output<typeof BaseCategorySchema> & {
//   subcategories?: Category[];
// };

// const CategorySchema: BaseSchema<Category> = merge([
//   BaseCategorySchema,
//   object({ subcategories: recursive(() => array(CategorySchema)) }),
// ]);

// const result = parse(CategorySchema, {
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
export const Error_tupleSchema = object({
  ...TupleSchema.entries,
  components: array(
    object({
      name: string(),
      type: TypeSchema,
    }),
  ),
})
export const Error_inputSchema = variant("type", [
  object({
    name: string(),
    type: TypeSchema,
  }),
  Error_tupleSchema,
])
export const ErrorSchema = object({
  type: literal("error"),
  name: string(),
  inputs: array(Error_inputSchema),
})
