export type FormModel = {
  [K: string]: Primitive | FormModel | Array<FormModel>;
};

type Primitive = string | number | boolean | null | undefined;
