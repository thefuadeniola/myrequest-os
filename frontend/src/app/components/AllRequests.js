import React from 'react'

const AllRequests = ({ requests }) => {
  return (
    <>
        <style jsx>
            {
                `
                .bb{
                    border-bottom: 1px solid #d3d3d3
                }

                .bt{
                    border-top: 1px solid #d3d3d3
                }

                `
            }
        </style>
        {
            requests &&
            <div className='py-4'>
                <h1 className='font-inter text-md mb-2'>All requests in this room:</h1>
                <div className='bt flex flex-col'>
                    {
                        requests.map((request, index) => (
                            <div className='bb p-4' key={index}>
                                <p className='font-inter'><b>{request.song_title}</b>. {`${request.artistes.map(artist => artist.name).join(", ")}`}</p>
                            </div>
                        ))
                    }
                </div>
            </div>
        }
    </>
  )
}

export default AllRequests