import { PricingTable } from '@clerk/nextjs'
import React from 'react'

function Billing() {

    return (
        <div className='flex items-center justify-between flex-col'>
            <h2 className='font-bold text-3xl my-5'>Billing</h2>
            <PricingTable />
        </div>
    )
}

export default Billing