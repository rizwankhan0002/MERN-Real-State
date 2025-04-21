import React from 'react'

const Search = () => {
  return (
    <div className='flex flex-col md:flex-row'>
        {/*---------Left Side----------*/}
        <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
            <form className='flex flex-col gap-8'>
            <div className='flex items-center gap-2'>
                <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                <input className='border rounded-lg p-3 w-full'
                type='text'
                id='searchterm'
                placeholder='Search...'
                />
            </div>
            <div className='flex gap-2 flex-wrap items-center'>
                <label className='font-semibold'>Type:</label>
                <div className='flex gap-2'>
                <input className='w-5'
                type='checkbox'
                id='all' />
                <span>Rent & Sale</span>
                </div>
                <div className='flex gap-2'>
                <input className='w-5'
                type='checkbox'
                id='rent' />
                <span>Rent</span>
                </div>
                <div className='flex gap-2'>
                <input className='w-5'
                type='checkbox'
                id='sale'/>
                <span> Sale</span>
                </div>
                <div className='flex gap-2'>
                <input className='w-5'
                type='checkbox'
                id='offer' />
                <span>Offer</span>
                </div>
            </div>
            <div className='flex gap-2 flex-wrap items-center'>
                <label className='font-semibold'>Amenities</label>
                <div className='flex gap-2'>
                <input className='w-5'
                type='checkbox'
                id='parking' />
                <span>Parking</span>
                </div>
                <div className='flex gap-2'>
                <input className='w-5'
                type='checkbox'
                id='furnished' />
                <span>Furnished</span>
                </div>
            </div>
            <div className='flex items-center gap-2'>
                <label className='font-semibold'>Sort:</label>
                <select id='sort_order'className='border rounded-lg p-3'>
                    <option>Price high to low</option>
                    <option>Price low to high</option>
                    <option>Latest</option>
                    <option>Oldest</option>
                </select>
            </div>
            <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Search</button>
            </form>
        </div>
        {/*--------Right Side----------*/}
        <div>
            <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing results:</h1>
        </div>
    </div>
  )
}

export default Search