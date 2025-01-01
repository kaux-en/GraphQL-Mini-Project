import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { USER_INFO, USER_POST, DELETE_POST, UPDATE_POST, GET_ALBUM_TODOS } from '../queries/Queries.tsx';


interface UpdatePostValue {
    title: string,
    body: string
}


const GetUserInfo: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { loading: userLoading, error: userError, data: userData } = useQuery(USER_INFO, { variables: {id}});
    const { loading: postLoading, error: postError, data: postData } = useQuery(USER_POST, { variables: {id}});
    const { loading: albumLoading, error: albumError, data: albumData } = useQuery(GET_ALBUM_TODOS, { variables: {id}});
    const [ deletePost, { loading: deleteLoading, error: deleteError }] = useMutation(DELETE_POST)
    const [ updatePost, { loading: updateLoading, error: updateError, data: updateData }] = useMutation(UPDATE_POST);
        const [formData, setFormData] = useState<UpdatePostValue>({
            title: '',
            body: ''
        })

    //const [buttonPressed, setButtonPressed] = useState(false);
    const [showForm, setShowForm] = useState(false);
    

    React.useEffect(() => {
        if (updateData) {
            setFormData({
                title: updateData.post.data.title,
                body: updateData.post.data.body,
                });
            }
          }, [updateData]);
        
    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
            try {
            updatePost({
                variables: { id, input: formData }
            })
        } catch (error) {
            console.log('Error:', error)
            }
        }


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target;
            setFormData({
              ...formData,
              [name]: value,
            });
          };

    const handleEditBtn = () => {
        //setButtonPressed(true)
        setShowForm(true)
    }


    if (userLoading || postLoading || deleteLoading || albumLoading) return <p>Loading...</p>;

    if (userError) return <p>Error: {userError.message}</p>;
    if (postError) return <p>Error: {postError.message}</p>;
    if (deleteError) return <p>Error: {deleteError.message}</p>;
    if (albumError) return <p>Error: {albumError.message}</p>;


    const handleDelete = async () => {
        try {
            await deletePost({
            variables: { id },
            });
        
            navigate('/');
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };



    return (
        <div>
            
            <h2>User profile</h2>
        {userData && userData.user ? (
        <div key={userData.user.id}>
        <p>Name: {userData.user.name}</p>
        <p>Email: {userData.user.email}</p>
        <p>Phone Number: {userData.user.phone}</p>  
        <p>Website: {userData.user.website}</p> 
        <p>Company: {userData.user.company.name}</p> 
        <p>Location: {userData.user.address ? `${userData.user.address.geo.lat}, ${userData.user.address.geo.lng}` : "No address"}</p>
            </div> 
      ) : (
        <p>No posts found.</p>
        )} 

        <h2>User Post</h2>
        {postData && postData.user && postData.user.posts && postData.user.posts.data && postData.user.posts.data.length > 0 ? (
                postData.user.posts.data.map((post: any) => (
                    <div key={post.id}>
                        <p><strong>Title:</strong> {post.title}</p>
                        <button onClick={handleDelete} disabled={deleteLoading}>
                        {deleteLoading ? 'Deleting Post...' : 'Delete Post'}
                        </button>
                        <button onClick={handleEditBtn}>
                            Edit
                        </button>

                        {post.comments && post.comments.data && post.comments.data.length > 0 ? (
                            post.comments.data.map((comment: any) => (
                                <div key={comment.id}>
                                    <p><strong>Comment by:</strong> {comment.name}</p>
                                    <p><strong>Comment:</strong> {comment.body}</p>
                                </div>
                            ))
                        ) : (
                            <p>No comments available.</p>
                        )}
                    </div>
                ))
            ) : (
                <p>No posts available.</p>
            )}
        
            {showForm && (
                <div>
                <h2>Update Post</h2>
                    <form onSubmit={handleUpdateSubmit}>
                    <div>
                        <label htmlFor="id">Id</label>
                        <input
                            type="number"
                            id="id"
                            name="id"
                            value={id}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="body">Body</label>
                        <textarea
                            id="body"
                            name="body"
                            value={formData.body}
                            onChange={handleChange}
                            required
                        />
                        <button type='submit'>
                            Save Changes
                        </button>
                    </div>
                </form>
                </div>    
               )}


            {albumData && albumData.users && albumData.users.length > 0 ? (
                albumData.users.map((user: any) => (
                    <div key={user.id}>
                        <h2>User Albums</h2>
            
                    {user.albums && user.albums.data.length > 0 ? (
                        user.albums.data.map((album: any) => (
                            <div key={album.id}>
                                <p><strong>Album Title:</strong> {album.title}</p>
                            </div>
                        ))
                ) : (
                <p>No albums available.</p>
                )}

                <h2>User Todos</h2>
            
                {user.todos && user.todos.data.length > 0 ? (
                    user.todos.data.map((todo: any) => (
                    <div key={todo.id}>
                        <p><strong>Todo Title:</strong> {todo.title}</p>
                        <p><strong>Completed:</strong> {todo.completed ? 'Yes' : 'No'}</p>
                    </div>
                    ))
                ) : (
                    <p>No todos available.</p>
                    )}
            </div>
            ))
        ) : (
                <p>No album or todo data available.</p>
            )}
        </div>
    )
};

export default GetUserInfo;