let user = undefined; //usuario mostrado actualmente
let users = []; //usuarios ya consultados
let posts = []; //comentarios de posts ya consultados

fetch("https://jsonplaceholder.typicode.com/users")
    .then(res => res.json())
    .then(users => {
        const html = users.map( user => {
            return `
            <div id="user_container_${user.id}">
                <h3 class="username" id="${user.id}">${user.username}</h3>
                <div class="posts" id="posts_user_${user.id}"></div>
            </div>
            `
        }).join("");
        document.querySelector(".users_container").innerHTML = html;
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
        posts += `${postId} `;
    }

}

if(e.target.classList.contains("hideComments")){
    const post = e.target.closest("article");
    const comments = post.querySelector(".comments");
    comments.style.display = "none";
    post.querySelector(".hideComments").style.display = "none";
    post.querySelector(".showComments").style.display = "block";

}



if(e.target.classList.contains("username")){
    const id = e.target.id;
    
    if(user == id){ //user mostrado es el mismo al solicitado
        const divPostsUser = document.getElementById(`posts_user_${id}`);
        divPostsUser.style.display = divPostsUser.style.display === "none" ? "block" : "none";
    }

    else if(users.includes(id)){ //user ya fue conslutado
        document.getElementById(`posts_user_${id}`).style.display = "block";
        document.getElementById(`posts_user_${user}`).style.display = "none";
        user = id;
    }

    else{
        const showDiv = document.getElementById(`posts_user_${id}`);
        const posts = await PostsUsuario(id);
        let html = posts.map(post =>{
            return `
                    <article data-id="${post.id}" class="post">
                        <h4>${post.title}</h4>
                        <p>${post.body}</p>
                        <button class="showComments">Show comments</button>
                        <button class="hideComments">Hide comments</button>
                        <div class="comments">
                        </div>
                        </article>
            `
        }).join("");
        showDiv.innerHTML = html;
        showDiv.style.display = "block"
        users += id;
        if(user){
            document.getElementById(`posts_user_${user}`).style.display = "none";
        }
        user = id
    }
}
});

async function PostsUsuario(id){
    let postByUser = {};
    await fetch("https://jsonplaceholder.typicode.com/posts/")
        .then(res => res.json())
        .then(posts =>{
             postByUser = posts.filter(post => post.userId == id);
        });
        return postByUser;
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
