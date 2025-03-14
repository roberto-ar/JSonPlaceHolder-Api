let userDisplayed = 1;
let selectUsers = document.querySelector(".selectUsers");
let posts = [];

fetch("https://jsonplaceholder.typicode.com/users")
    .then(res => res.json())
    .then(users => {
        let userlist = users.map(user => {
            return `<option value="${user.id}">${user.username}</option>`
        });
        selectUsers.innerHTML = userlist;
        users.forEach(async user => {
            const usersList = document.querySelector(".users_container");
            usersList.innerHTML += `<div id="posts_user_${user.id}"></div>`;
            const postList = await PostsUsuario(user.id);
            postDiv = document.getElementById(`posts_user_${user.id}`)
            if(user.id != 1) postDiv.style.display = "none"
            postDiv.innerHTML = postList;
        });
    })
selectUsers.addEventListener("change", (e)=>{
        const id = e.target.value;
        document.getElementById(`posts_user_${userDisplayed}`).style.display = "none";
        document.getElementById(`posts_user_${id}`).style.display = "block";
        userDisplayed = id;
})

document.addEventListener("click", async (e) =>{
if(e.target.classList.contains("showComments")){
    const post = e.target.closest("article");
    const postId = post.dataset.id
    const divComments = post.querySelector(".comments");
    post.querySelector(".hideComments").style.display = "inline-block";
    post.querySelector(".showComments").style.display = "none";
    if(posts.includes(postId)){
        divComments.style.display = "block";
    }
    else{
        const postComments = await Comentarios(post);
        const html = postComments.map(comment =>{
            return `
                            <div class="comment">
                                <h5>${comment.name}</h5>
                                <p>${comment.email}</p>
                                <p>${comment.body}</p>
                            </div>
            `
        }).join("");
        divComments.innerHTML = html;
        divComments.style.display = "block";
        posts.push(postId);
    }

}

if(e.target.classList.contains("hideComments")){
    const post = e.target.closest("article");
    const comments = post.querySelector(".comments");
    comments.style.display = "none";
    post.querySelector(".hideComments").style.display = "none";
    post.querySelector(".showComments").style.display = "block";

}
if(e.target.classList.contains("deletePost")){
    const post = e.target.closest("article");
    const idPost = post.dataset.id;
    post.remove();
    fetch(`https://jsonplaceholder.typicode.com/posts/${idPost}`, {
        method : "DELETE"
    })
    .then(res =>{
        if(res.ok){
            //alert("post eliminado");
        }
        else{
            //alert("no se pudo eliminar el post");
        }
    })
    
}
});

document.getElementById("publish").addEventListener("submit", (e)=>{
    const title = document.getElementById("titlePost").value;
    const body = document.getElementById("bodyPost").value;
    e.preventDefault();
    fetch("https://jsonplaceholder.typicode.com/posts",{
        method : "POST",
        headers : {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userId : userDisplayed,
            title,
            body
        })
    })
    .then(res => res.json())
    .then(post => {
        console.log(post)
    })
    .catch(error =>{
        console.log(`error enviando el post ------> ${error}`)
    })
})
async function PostsUsuario(id){
    let postByUser = {};
    await fetch("https://jsonplaceholder.typicode.com/posts/")
        .then(res => res.json())
        .then(posts =>{
             postByUser = posts.filter(post => post.userId == id);
        });
        const html = postByUser.map(post =>{
            return `
                        <article data-id="${post.id}" class="post">
                            <button class="deletePost">Delete post<button>
                            <h4>${post.title}</h4>
                            <p>${post.body}</p>
                            <button class="showComments">Show comments</button>
                            <button class="hideComments">Hide comments</button>
                            <div class="comments"></div>
                            </article>
            `
        }).join("");
        return html;
        
}

async function Comentarios(post) {
    const postId = post.dataset.id;
    let commentsByUser = {};
    await fetch("https://jsonplaceholder.typicode.com/comments")
    .then(res => res.json())
    .then(comments => {
        commentsByUser = comments.filter(comment => comment.postId == postId);
    });
    return commentsByUser;
}