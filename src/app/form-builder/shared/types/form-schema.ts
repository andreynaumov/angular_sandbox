import { FormFieldConfig } from './form-config';

export type FormSchema = FormFieldSchema[];

export type FormFieldSchema =
  | PrimitiveFormFieldSchema<'string'>
  | PrimitiveFormFieldSchema<'number'>
  | PrimitiveFormFieldSchema<'date'>
  | PrimitiveFormFieldSchema<'select'>
  | PrimitiveFormFieldSchema<'checkbox'>
  | CompositeFormFieldSchema<'object'>
  | CompositeFormFieldSchema<'array'>;

type BaseFormFieldSchema<T extends string> = {
  readonly name: string;
  readonly type: T;
  readonly config?: FormFieldConfig;
};

type PrimitiveFormFieldSchema<T extends string> = BaseFormFieldSchema<T>;
type CompositeFormFieldSchema<T extends string> = BaseFormFieldSchema<T> & {
  readonly schema: FormSchema;
};

// export type FormFieldSchema = {
//   type: 'string' | 'number' | 'date' | 'checkbox' | 'select' | 'array' | 'object';
//   schema?: FormSchema;
//   config?: FormFieldConfig;
// };

// export type FormModel<T extends FormSchema> = {
//   [K in keyof T]?: T[K]['type'] extends 'object'
//     ? FormModel<Exclude<T[K]['schema'], undefined>>
//     : T[K]['type'] extends 'array'
//       ? Array<FormModel<Exclude<T[K]['schema'], undefined>>>
//       : FromString<T[K]['type']>;
// };

// type FromString<T extends 'string' | 'number' | 'date' | 'checkbox' | 'select' | 'object' | 'array'> = T extends 'string'
//   ? string
//   : T extends 'number'
//     ? number
//     : T extends 'date'
//       ? string
//       : T extends 'checkbox'
//         ? boolean
//         : T extends 'select'
//           ? string
//           : never;

// const schema = z.object({
//   subObject: z.object({
//     subField: z.string().optional().default('Sub Field'),
//     numberField: z.number().optional().default(1),

//     subSubObject: z
//       .object({
//         subSubField: z.string().default('Sub Sub Field'),
//       })
//       .describe('Sub Sub Object Description'),
//   }),
//   optionalSubObject: z
//     .object({
//       optionalSubField: z.string(),
//       otherOptionalSubField: z.string(),
//     })
//     .optional(),
//   guestListName: z.string(),
//   invitedGuests: z
//     .array(
//       z.object({
//         name: z.string(),
//         age: z.coerce.number(),
//       }),
//     )
//     .describe('Guests invited to the party'),
// });
