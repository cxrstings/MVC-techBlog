let isUpdate = false;
let currentPostId = null;

// Get the modal, button, and close elements
const newPostModal = document.getElementById("newPostModal");
const newPostBtn = document.getElementById("newPostBtn");
const closeModal = document.getElementsByClassName("close")[0];

// Show the modal when the button is clicked
newPostBtn.onclick = function () {
  document.getElementById("modal-title").innerText = "Create New Post";
  isUpdate = false;
  currentPostId = null;
  newPostModal.style.display = "block";
};

// Hide the modal when the close button is clicked
closeModal.onclick = function () {
  newPostModal.style.display = "none";
};

// Hide the modal when the user clicks outside of it
window.onclick = function (event) {
  if (event.target == newPostModal) {
    newPostModal.style.display = "none";
  }
};

document.querySelectorAll(".update-post-btn").forEach((btn) => {
  btn.addEventListener("click", (event) => {
    const postId = event.target.getAttribute("data-id");
    isUpdate = true;
    currentPostId = postId;
    const postTitle = event.target.getAttribute("data-title");
    const postText = event.target.getAttribute("data-text");

    document.getElementById("modal-title").innerText = "Update Post";
    document.getElementById("title").value = postTitle;
    document.getElementById("text").value = postText;

    newPostModal.style.display = "block";
  });
});

// Handle the form submission
document.getElementById("newPostForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const text = document.getElementById("text").value;

  try {
    let response;

    if (isUpdate && currentPostId) {
      response = await fetch(`/dashboard/api/posts/${currentPostId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, text }),
      });
    } else {
      response = await fetch("/dashboard/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, text }),
      });
    }

    if (response.ok) {
      location.reload();
    } else {
      alert(isUpdate ? "Failed to update the post" : "Failed to create a new post");
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

document.querySelectorAll('.delete-post-btn').forEach(btn => {
    btn.addEventListener('click', async event => {
        const postId = event.target.getAttribute('data-id');
        const response = await fetch(`/dashboard/api/posts/${postId}`, { method: 'DELETE' });

        if (response.ok) {
            location.reload();
        } else {
            alert(response.statusText);
        }
    });
});