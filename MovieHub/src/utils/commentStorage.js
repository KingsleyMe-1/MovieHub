const STORAGE_KEY = 'moviehub_comments';

export const getComments = (movieId) => {
    try {
        const allComments = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        return allComments[movieId] || [];
    } catch (error) {
        console.error('Error retrieving comments:', error);
        return [];
    }
};

const saveComments = (movieId, comments) => {
    try {
        const allComments = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

        if(!allComments[movieId]) {
            allComments[movieId] = [];
        }

        const newComment = {
            id: Date.now(),
            ...comments,
            timestamp: new Date().toISOString()
        };

        allComments[movieId].unshift(newComment);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allComments));
        return newComment;
    } catch (error) {
        console.error('Error saving comment:', error);
        throw error;
    }
};

export const deleteComment = (movieId, commentId) => {
    try {
        const allComments = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        if (allComments[movieId]) {
            allComments[movieId] = allComments[movieId].filter(comment => comment.id !== commentId);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(allComments));
            return true;
        }

        return false;
    } catch (error) {
        console.error('Error deleting comment:', error);
        return false;
    }
};