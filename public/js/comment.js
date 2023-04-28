const commentFormHandler = async (event) => {
    event.preventDefault();
  
    // Get the values from the form
    const commentText = document.querySelector('#comment').value.trim();
    const postId = event.target.querySelector('input[name="post_id"]').value;
    const userId = event.target.querySelector('input[name="user_id"]').value;
  
    // Send a POST request to the server to save the comment
    const response = await fetch('/api/comments', {
      method: 'POST',
      body: JSON.stringify({ Comment_text: commentText, post_id: postId, user_id: userId }),
      headers: { 'Content-Type': 'application/json' },
    });
  
    if (response.ok) {
      // Reload the page to display the new comment
      location.reload();
    } else {
      alert(response.statusText);
    }
  };
  
  document.querySelectorAll('.comment-form').forEach(form => {
    form.addEventListener('submit', commentFormHandler);
  });  