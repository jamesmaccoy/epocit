import type { CollectionConfig } from 'payload'

import { adminOrCreateRoleCustomer } from './access/adminOrCreateRoleCustomer'
import { isAdmin } from '@/access/isAdmin'
import { adminOrSelf } from '@/access/adminOrSelf'
import { validateRole } from './hooks/validateRole'
import { adminSelfOrAdded } from './access/adminSelfOrAdded'
import { fillAddedByField } from './hooks/fillAddedByField'
import { adminSelfOrBeneficiary } from './access/adminSelfOrBeneficiary'

export const Users: CollectionConfig = {
  slug: 'users',
  typescript: {
    interface: 'User',
  },
  access: {
    admin: ({ req: { user } }) => Boolean(user),
    create: adminOrCreateRoleCustomer,
    delete: isAdmin,
    unlock: isAdmin,
    read: adminSelfOrBeneficiary,
    update: adminOrSelf('id'),
  },
  admin: {
    defaultColumns: ['name', 'email', 'role'],
    useAsTitle: 'name',
  },

  hooks: {
    beforeValidate: [fillAddedByField],
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Life Assured', value: 'lifeassured' },
        { label: 'Beneficiary', value: 'beneficiary' },
      ],
      hasMany: true,
      defaultValue: ['beneficiary'],
    },
    {
      name: 'addedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        hidden: true,
      },
    },
  ],
  timestamps: true,
}
