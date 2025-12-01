import { SelectOption } from '@form-builder/shared/types/form-config';
import { FormSchema } from '@form-builder/shared/types/form-schema';

export const formSchema = ({ options }: { options: Record<string, SelectOption<unknown>[]> }): FormSchema => [
  {
    name: 'credit',
    type: 'object',
    config: {
      label: 'Заявка на кредит',
    },
    schema: [
      {
        name: 'amount',
        type: 'string',
        config: {
          label: 'Сумма кредита',
        },
      },
      {
        name: 'term',
        type: 'select',
        config: {
          label: 'Срок',
          options: options['term'],
        },
      },

      {
        name: 'city',
        type: 'select',
        config: {
          label: 'Город получения кредита',
          options: options['city'],
        },
      },
    ],
  },
  {
    name: 'contactData',
    type: 'object',
    config: {
      label: 'Контактные данные',
    },
    schema: [
      {
        name: 'firstName',
        type: 'string',
        config: {
          label: 'Имя',
        },
      },
      {
        name: 'lastName',
        type: 'string',
        config: {
          label: 'Фамилия',
        },
      },
      {
        name: 'middleName',
        type: 'string',
        config: {
          label: 'Отчество',
        },
      },
      {
        name: 'birthDate',
        type: 'date',
        config: {
          label: 'Дата рождения',
        },
      },
      {
        name: 'email',
        type: 'string',
        config: {
          label: 'E-mail',
        },
      },
      {
        name: 'phone',
        type: 'string',
        config: {
          label: 'Номер телефона',
        },
      },
    ],
  },
];
