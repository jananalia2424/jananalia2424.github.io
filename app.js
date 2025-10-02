import React from 'react';
import AuthForm from './components/AuthForm';
import PostList from './components/PostList';
import CommentList from './components/CommentList';

const App = () => {
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h1>Social App</h1>

            {/* AuthForm */}
            <section>
                <h2>Register / Login</h2>
                <AuthForm />
            </section>

            {/* Posts */}
            <section>
                <h2>Posts</h2>
                <PostList />
            </section>

            {/* Comments example for postId = 1 */}
            <section>
                <h2>Comments for Post 1</h2>
                <CommentList postId="1" />
            </section>
        </div>
    );
};

export default App;
