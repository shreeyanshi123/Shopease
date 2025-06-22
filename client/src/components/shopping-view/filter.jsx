import { filterOptions } from '@/config'
import React, { Fragment } from 'react'
import { Checkbox } from '../ui/checkbox'
import { Separator } from '../ui/separator'
import { Label } from '../ui/label'

const ProductFilter = ({ filters, handleFilters }) => {
    return (
        <div className='bg-white rounded-lg shadow-sm border border-black w-full max-w-xs mx-auto md:mx-0'>
            <div className='p-4 border-b border-black bg-black rounded-t-lg'>
                <h2 className='text-lg font-bold text-white'>Filters</h2>
            </div>
            <div className='p-4 space-y-4'>
                {Object.keys(filterOptions).map((keyItem) => (
                    <Fragment key={keyItem}>
                        <div>
                            <h3 className='text-base font-bold text-black'>{keyItem}</h3>
                            <div className='grid gap-2 mt-2'>
                                {filterOptions[keyItem].map((option) => (
                                    <Label className="flex font-medium items-center gap-2 text-black hover:text-white hover:bg-black px-2 py-1 rounded transition-colors duration-150" key={option.id}>
                                        <Checkbox checked={filters && Object.keys(filters).length > 0 && filters[keyItem] && filters[keyItem].indexOf(option.id)>-1 }
                                            onCheckedChange={() => handleFilters(keyItem, option.id)} />{option.label}
                                    </Label>
                                ))}
                            </div>
                        </div>
                        <Separator className="bg-black" />
                    </Fragment>
                ))}
            </div>
        </div>
    )
}

export default ProductFilter