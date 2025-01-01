import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_POST } from '../queries/Queries.tsx';


interface createPostMutation {
    title: string,
    body: string
}

const CreatePost: React.FC = () => {
    const [formData, setFormData] = useState<createPostMutation>({
        title: '',
        body: ''
    })

    const [createPost, { loading, error, data }] = useMutation(CREATE_POST);
   
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await createPost({
              variables: {
                input: {
                  title: formData.title,
                  body: formData.body,
                },
              },
            });
            setFormData({ title: '', body: '' }); 
          } catch (error) {
            console.error("Error creating post:", error);
          }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
      };


      return (
        <div>
      <h2>Create a New Post</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="body">Body</label>
          <textarea
            id="body"
            name="body"
            value={formData.body}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating Post...' : 'Create Post'}
        </button>
      </form>

      {data && (
        <div>
          <h3>Post Created</h3>
          <p>Title: {data.createPost.title}</p>
          <p>Body: {data.createPost.body}</p>
        </div>
      )}

      </div>
    )
    
};

export default CreatePost;