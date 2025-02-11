import { getPayload, Where } from 'payload'
import config from '@payload-config'
import React from 'react'
import { Post, User } from '@/payload-types'
import { getMeUser } from '@/utilities/getMeUser'
import PageClient from './page.client'
import PolicyCard from '@/components/Policys/PolicyCard'
import { redirect } from 'next/navigation'

export default async function Policys() {
  const currentUser = await getMeUser()

  if (!currentUser) {
    redirect('/login')
  }

  const [upcomingPolicys, pastPolicys] = await Promise.all([
    getPolicys('upcoming', currentUser.user),
    getPolicys('past', currentUser.user),
  ])

  const formattedUpcomingPolicys = upcomingPolicys.docs.map((policy) => ({
    ...(policy.post as Pick<Post, 'meta' | 'slug' | 'title'>),
    fromDate: policy.fromDate,
    toDate: policy.toDate,
    guests: policy.guests,
    id: policy.id,
  }))

  const formattedPastPolicys = pastPolicys.docs.map((policy) => ({
    ...(policy.post as Pick<Post, 'meta' | 'slug' | 'title'>),
    fromDate: policy.fromDate,
    toDate: policy.toDate,
    guests: policy.guests,
    id: policy.id,
  }))

  console.log(upcomingPolicys, pastPolicys)

  return (
    <>
      <PageClient />
      <div className="my-10 container space-y-10">
        <div>
          {upcomingPolicys.docs.length > 0 && (
            <h2 className="text-4xl font-medium tracking-tighter my-6">Upcoming stays</h2>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {formattedUpcomingPolicys.map((policy) => (
              <PolicyCard key={policy.id} policy={policy} />
            ))}
          </div>
        </div>

        {pastPolicys.docs.length > 0 && (
          <h2 className="text-4xl font-medium tracking-tighter my-6">Past stays</h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {formattedPastPolicys.map((policy) => (
            <PolicyCard key={policy.id} policy={policy} />
          ))}
        </div>
      </div>
    </>
  )
}

const getPolicys = async (type: 'upcoming' | 'past', currentUser: User) => {
  const payload = await getPayload({ config })

  let whereQuery: Where

  if (type === 'upcoming') {
    whereQuery = {
      and: [
        {
          fromDate: {
            greater_than_equal: new Date(),
          },
        },
        {
          customer: {
            equals: currentUser.id,
          },
        },
      ],
    }
  } else {
    whereQuery = {
      and: [
        {
          fromDate: {
            less_than: new Date(),
          },
        },
        {
          customer: {
            equals: currentUser.id,
          },
        },
      ],
    }
  }

  const policys = await payload.find({
    collection: 'policys',
    limit: 100,
    where: whereQuery,
    depth: 2,
    sort: '-fromDate',
    select: {
      slug: true,
      post: true,
      guests: true,
      fromDate: true,
      toDate: true,
    },
  })

  return policys
}
