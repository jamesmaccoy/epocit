import { type Media as MediaType, User } from '@/payload-types'
import { formatDate } from 'date-fns'
import { CalendarIcon, UsersIcon } from 'lucide-react'
import Link from 'next/link'
import React, { FC } from 'react'
import { Media } from '../Media'

type Props = {
  policy: {
    fromDate: string
    toDate: string
    beneficiarys: (string | User)[] | null | undefined
    id: string
    slug?: string | null | undefined
    title: string
    meta?:
      | {
          title?: string | null | undefined
          image?: string | MediaType | null | undefined
          description?: string | null | undefined
        }
      | undefined
  }
}

const PolicyCard: FC<Props> = ({ policy }) => {
  return (
    <Link key={policy.id} href={`/admin/collections/policys/${policy.id}`}>
      <div className="flex flex-col gap-4 border border-border bg-card h-full">
        <div className="relative w-full">
          {!policy.meta?.image && <div>No Image</div>}
          {policy.meta?.image && typeof policy.meta?.image !== 'string' && (
            <Media resource={policy.meta.image} size="33vw" />
          )}
        </div>
        <div className="p-4">
          <h3 className="text-2xl font-medium">{policy.title}</h3>
          <p className="my-2">{policy.meta?.description}</p>
          <div
            className="flex items-center gap-2 font-medium
        "
          >
            <div>
              <CalendarIcon className="size-4" />
            </div>
            <div className="text-sm font-medium">
              {formatDate(new Date(policy.fromDate), 'PPP')} -{' '}
              {formatDate(new Date(policy.toDate), 'PPP')}
            </div>
          </div>
          {policy.beneficiarys && policy.beneficiarys?.length > 0 && (
            <div className="flex items-center gap-2">
              <div>
                <UsersIcon className="size-4" />
              </div>
              <div className="font-medium text-sm">{policy.beneficiarys?.length} beneficiarys</div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default PolicyCard
