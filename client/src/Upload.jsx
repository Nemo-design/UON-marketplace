import React from 'react';

const Upload = () => {
    return (
        <div>
            <h1>Upload Page</h1>
            <div className="form-group">
                <label htmlFor="Title">Listing Title</label>
                <input
                type="text"
                id="Title"
                name="title"
                required
                />
            </div>
            <div className="form-group">
                <label htmlFor="Description">Description</label>
                <input
                type="text"
                id="Description"
                name="description"
                required
                />
            </div>
            <div className="form-group">
                <label htmlFor="Price">Price</label>
                <input
                type="text"
                id="Price"
                name="price"
                required
                />
            </div>
            <div className="form-group">
                <label htmlFor="Image">Image</label>
                <input
                type="file"
                id="Image"
                name="image"
                required
                />
            </div>
        </div>
    );
}

export default Upload;