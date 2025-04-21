import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

const CreateListing = () => {
    const { currentUser } = useSelector(state => state.user)
    const navigate = useNavigate()
    const params = useParams()
    const [files, setFiles] = useState([])
    const [imageUrls, setImageUrls] = useState([]) 
    const [uploadProgress, setUploadProgress] = useState([])
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
    })
    
    useEffect(() => {
    const fetchListing = async () => {
    const listingId = params.listingId
    const res = await fetch(`/api/listing/get/${listingId}`)
    const data = await res.json()
    
    if (data.success === false) {
      console.log(data.message)
      return
    }
    setFormData(data)
    }
    fetchListing()
    },[])

    const handleImageSubmit = async (e) => {
        e.preventDefault()

        if (files.length < 1) {
            toast.error('Please select at least 1 image')
            return
          }
          // Prevent more than 6 total images
        const totalImages = formData.imageUrls.length + files.length
        if (totalImages > 6) {
           toast.error('You can only upload up to 6 images')
          return
  }

  setUploading(true)
    
        try {
          const uploadPromises = files.map((file, index) => storeImage(file, index))
          const newUrls = await Promise.all(uploadPromises)

          //  Append new URLs to the existing ones
       setImageUrls((prev) => [...prev, ...newUrls])
       setFormData((prevData) => ({
      ...prevData,
      imageUrls: [...prevData.imageUrls, ...newUrls],
    }))

    console.log('All uploaded image URLs:', [
      ...formData.imageUrls,
      ...newUrls,
    ])

        } catch (error) {
          console.error('One or more image uploads failed:', error)
          toast.error('Failed to upload one or more images')
        } finally {
            setUploading(false)
        }
      }
    const storeImage = async (file, index) => {
      return new Promise(async (resolve, reject) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', 'my-upload-preset')
        formData.append('cloud_name', 'duzajaytb')
        try {
            const response = await axios.post(
              'https://api.cloudinary.com/v1_1/duzajaytb/image/upload',
              formData,
              {
                onUploadProgress: (progressEvent) => {
                  if (progressEvent.total) {
                    const percent = Math.round(
                      (progressEvent.loaded * 100) / progressEvent.total
                    )
                    // track individual image upload progress
                    setUploadProgress((prev) => {
                      const updated = [...prev]
                      updated[index] = percent
                      return updated
                    })
                  }
                }
              }
            )
            resolve(response.data.secure_url)
          } catch (error) {
            reject(error)
          }
      })
    }
    const handleDeleteImage = (index) => {
       setFormData({
        ...formData,
        imageUrls: formData.imageUrls.filter((_, i) => i !==
    index)
       })
    }

    const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
        setFormData({
      ...formData,
      type: e.target.id
        })
    }
    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
        setFormData({
            ...formData,
            [e.target.id] : e.target.checked
        })
    }
    if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        })
    }
    }

    const handleSubmit = async (e) => {
    e.preventDefault()
    try {
        if (formData.imageUrls.length < 1) return toast.error('You must upload at least one image')
        if (+formData.regularPrice < +formData.discountPrice) return toast.error('Discount price must be lower than regular price')
        setLoading(true)
        setError(false)
        const res = await fetch(`/api/listing/update/${params.listingId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...formData,
                userRef: currentUser._id
            })
        })
        const data = await res.json()
        setLoading(false)
        if (data.success === false) {
            toast.error(error.message)
        }
        navigate(`/listing/${data._id}`)

    } catch (error) {
        setError(error.message)
        setLoading(false)
    }
    }


  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Update a Listing</h1>
        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
            {/*----------Left Hand Side----------*/}
         <div className='flex flex-col gap-4 flex-1'>
            <input className='border p-3 rounded-lg'
            type='text'
            placeholder='Name'
            id='name'
            maxLength='62'
            minLength='10'
            required
            onChange={handleChange}
            value={formData.name}
            />
            <textarea className='border p-3 rounded-lg'
            type='text'
            placeholder='Description'
            id='description'
            required
            onChange={handleChange}
            value={formData.description}
            />
            <input className='border p-3 rounded-lg'
            type='text'
            placeholder='Address'
            id='address'
            required
            onChange={handleChange}
            value={formData.address}
            />
            <div className='flex gap-6 flex-wrap'>
                <div className='flex gap-2'>
                    <input className='w-5'
                    type='checkbox'
                    id='sale'
                    onChange={handleChange}
                    checked={formData.type === 'sale'}
                    />
                    <span>Sell</span>
                </div>
                <div className='flex gap-2'>
                    <input className='w-5'
                    type='checkbox'
                    id='rent'
                    onChange={handleChange}
                    checked={formData.type === 'rent'}
                    />
                    <span>Rent</span>
                </div>
                <div className='flex gap-2'>
                    <input className='w-5'
                    type='checkbox'
                    id='parking'
                    onChange={handleChange}
                    checked={formData.parking}
                    />
                    <span>Parking spot</span>
                </div>
                <div className='flex gap-2'>
                    <input className='w-5'
                    type='checkbox'
                    id='furnished'
                    onChange={handleChange}
                    checked={formData.furnished}
                    />
                    <span>Furnished</span>
                </div>
                <div className='flex gap-2'>
                    <input className='w-5'
                    type='checkbox'
                    id='offer'
                    onChange={handleChange}
                    checked={formData.offer}
                    />
                    <span>Offer</span>
                </div>
            </div>
            <div className='flex flex-wrap gap-6'>
                <div className='flex items-center gap-2'>
                    <input className='p-3 border border-gray-300 rounded-lg'
                    type='number'
                    id='bedrooms'
                    min='1'
                    max='10'
                    required
                    onChange={handleChange}
                    value={formData.bedrooms}
                    />
                    <p>Beds</p>
                </div>
                <div className='flex items-center gap-2'>
                    <input className='p-3 border border-gray-300 rounded-lg'
                    type='number'
                    id='bathrooms'
                    min='1'
                    max='10'
                    required
                    onChange={handleChange}
                    value={formData.bathrooms}
                    />
                    <p>Baths</p>
                </div>
                <div className='flex items-center gap-2'>
                    <input className='p-3 border border-gray-300 rounded-lg'
                    type='number'
                    id='regularPrice'
                    min='50'
                    max='1000000'
                    required
                    onChange={handleChange}
                    value={formData.regularPrice}
                    />
                    <div className='flex flex-col items-center'>
                    <p>Regular Price</p>
                    <span className='text-xs'>($ / month)</span>
                    </div>
                    
                </div>
                {formData.offer && (
                <div className='flex items-center gap-2'>
                <input className='p-3 border border-gray-300 rounded-lg'
                type='number'
                id='discountPrice'
                min='0'
                max='1000000'
                required
                onChange={handleChange}
                value={formData.discountPrice}
                />
                <div className='flex flex-col items-center'>
                <p>Discounted Price</p>
                <span className='text-xs'>($ / month)</span>
                </div>
                
            </div>
                )}
                
            </div>
         </div>

         {/*------------Righ Hand Side----------*/}
         <div className='flex flex-col flex-1 gap-4'>
            <p className='font-semibold'>Images:
            <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
             </p>
            <div className='flex gap-4'>
                <input onChange={(e) => setFiles(Array.from(e.target.files)) } className='p-3 border border-gray-300 rounded-full w-full'
                type='file'
                id='images'
                accept='image/*'
                multiple
                disabled={formData.imageUrls.length >=6}
                />
                <button className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80 ' 
                 type='button'
                 disabled={uploading}
                 onClick={handleImageSubmit} >
                 {uploading ? 'Uploading...' : 'Upload'}
                 </button>
            </div>
            {
                formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                    <div key={index} className='flex justify-between p-3 border items-center'>
                        <img src={url} alt='listing image' className='w-20 h-20 object-contain rounded-lg' />
                        <button type='button' onClick={ () => handleDeleteImage(index)} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'>Delete</button>
                    </div>
                ))
            }
            <button disabled={loading || uploading } className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Updating...' : 'Update Listing'}</button>
            {error && <p className='text-red-700 text-sm'> {error}</p>}
         </div>

         
        </form>
    </main>
  )
}

export default CreateListing