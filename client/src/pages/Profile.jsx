import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRef } from 'react'
import axios from 'axios'
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserFailure, signOutUserStart, signOutUserSuccess, updateProfile } from '../redux/user/userSlice'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

const Profile = () => {
  const fileRef = useRef(null)
  const dispatch = useDispatch()
  const { currentUser, error } = useSelector((state) => state.user)
  const [loading, setLoading] = useState(true)
  const [imageUrl, setImageUrl] = useState(currentUser?.avatar || '')
  const [username, setUsername] = useState(currentUser?.username || '')
  const [email, setEmail] = useState(currentUser?.email || '')
  const [password, setPassword] = useState('')
  const [imageUploaded, setImageUploaded] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState('')
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [showListingsError, setShowListingsError] = useState(false)
  const [userListings, setUserListings] = useState([])

  // Fetch the user's profile when the component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/user/profile', {
          withCredentials: true,
        })
        const { user } = response.data
        setUsername(user.username)
        setEmail(user.email)
        setImageUrl(user.avatar || '/default-avatar.png')
        setLoading(false)
      } catch (error) {
        console.error('Error fetching user data', error)
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])


  // Handle file change and upload to Cloudinary
  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) 
    return setLoading(true)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'my-upload-preset')
    formData.append('cloud_name', 'duzajaytb')

    try {
      // Upload the image to Cloudinary
      const response = await axios.post('https://api.cloudinary.com/v1_1/duzajaytb/image/upload', formData,
        {
          onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setUploadProgress(percentage)
          }
          }
        }
      )
      const uploadedImageUrl = response.data.secure_url

      // Update the state with the new image URL
      setImageUrl(uploadedImageUrl)

      // Set the image uploaded flag to true
      setImageUploaded(true)

      // Set the upload success message
      setUploadSuccessMessage('Image uploaded Successfully')

      // Dispatch Redux action to update the user Profile in the store
      dispatch(updateProfile({ avatar: uploadedImageUrl }))
    } catch (error) {
      console.log('Error uploading image', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle the profile update when the "Update" button is clicked
  const handleUpdateProfile = async (e) => {
    e.preventDefault()

    try {
      // Send a PUT request to the backend to update the user's profile
      const response = await axios.put('/api/user/update-profile', {
        username,
        email,
        password,
        avatar: imageUrl,  // include the updated avatar
      }, {
        withCredentials: true
      })

      if (response.data.success) {
        // Optionally, dispatch Redux action to update user data in the store
        dispatch(updateProfile({ username, email, avatar: imageUrl }))
        toast.success('Profile updated successfully')
        setUpdateSuccess(true)

        // Clear input fields after successful update
        setUsername('')
        setEmail('')
        setPassword('')
        setImageUrl('')
        setImageUploaded(false)  
        setUploadProgress(0)
        setUploadSuccessMessage('')

        // Refetch user data after update
        await fetchUserData()
      }
    } catch (error) {
      console.log('Error updating profile:', error)
      toast.error('Failed to update profile')
      setUpdateSuccess(false)
    }
  
  
  }
  // Refetch user data from the backend
  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/user/profile')
      const updatedUser = response.data.user
      setUsername(updatedUser.username)
      setEmail(updatedUser.email)
      setImageUrl(updatedUser.avatar || 'default-avatar.png')
    } catch (error) {
      console.log('Error fetching user data', error)
    }
  }
  
  // Fetch user data on component mount or when currentUser changes

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username)
      setEmail(currentUser.email)
      setImageUrl(currentUser.avatar || '/default-avatar.png')
    }
  }, [currentUser])

  if (loading) {
    return <div>Loading...</div>
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message))
        return
      }
      dispatch(deleteUserSuccess(data))
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }
  
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart())
      const res = await fetch('/api/auth/signout')
      const data = await res.json()
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message))
        return
      }
      dispatch(signOutUserSuccess(data))
    } catch (error) {
      dispatch(signOutUserFailure(data.message))
    }
  }

  const handleShowListings = async () => {
    try {
      setShowListingsError(false)
       const res = await fetch(`/api/user/listings/${currentUser._id}`)
       const data = await res.json()
       if (data.success === false) {
        setShowListingsError(true)
        return
       }
       setUserListings(data)
    } catch (error) {
      setShowListingsError(true)
    }
  }

  const handleListingDelete = async (listingId) => {
   try {
    const res = await fetch(`/api/listing/delete/${listingId}`, {
      method: 'DELETE',
    })
    const data = await res.json()
    if (data.success === false) {
      console.log(data.message)
      return
    }
    setUserListings((prev) => 
      prev.filter((listing) => listing._id !== listingId))
   } catch (error) {
    console.log(error.message)
   }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleUpdateProfile}>
        <input
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
          onChange={handleFileChange}
        />
        <img
          onClick={() => fileRef.current.click()}
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
          src={imageUrl || '/default-avatar.png'}
          alt='profile'
        />
        {/*--------Display message if image is uploaded */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className='mt-2'>
           <div className='h-2 w-full bg-gray-300'>
            <div className='h-full bg-green-600'
            style={{width: `${uploadProgress}%`}} > </div>
           </div>
           <p className='text-center text-sm'>{uploadProgress}%</p>
          </div>
        )}

        {/*------Success message when upload complete-----*/}
        {uploadProgress === 100 && uploadSuccessMessage && (
          <div className='mt-2 text-green-500 text-center'>
           {uploadSuccessMessage}
          </div>
        )}
        <input
          className='border p-3 rounded-lg'
          type='text'
          placeholder='username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className='border p-3 rounded-lg'
          type='email'
          placeholder='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className='border p-3 rounded-lg'
          type='password'
          placeholder='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'
        >
          update
        </button>
        <Link to={'/create-listing'} className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'>
        Create Listing
        </Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete account</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>{updateSuccess ? 'User is updated Successfully' : ''}</p>
      <button onClick={handleShowListings} className='text-green-700 w-full'>Show Listings</button>
      <p className='text-red-700 mt-5'>{showListingsError ? 'Error showing listings' : ''}</p>
       
       {userListings && userListings.length > 0 &&
       <div className='flex flex-col gap-4'>
        <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
       {userListings.map((listing) => (
       <div key={listing._id} className='border rounded-lg p-3 flex justify-between items-center gap-4'>
         <Link to={`/listing/${listing._id}`}>
         <img className='h-16 w-16 object-contain'
         src={listing.imageUrls[0]} alt='listing cover' />
         </Link>

         <Link className='text-slate-700 font-semibold flex-1 hover:underline truncate' to={`/listing/${listing._id}`}>
         <p>{listing.name}</p>
         </Link>

         <div className='flex flex-col items-center'>
         <button onClick={() => handleListingDelete(listing._id)} className='text-red-700 uppercase'>Delete</button>
         <Link to={`/update-listing/${listing._id}`}>
         <button className='text-green-700 uppercase'>Edit</button>
         </Link>
         
         </div>
       </div>
      ))}
      
       </div>}
       
    </div>
  )
}

export default Profile
