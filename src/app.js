// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// Import the functions you need from the SDKs you need

import {
    getFirestore,
    addDoc,
    collection,
    getDocs,
    doc,
    deleteDoc,
    onSnapshot,
    query,
    where,
    orderBy,
    serverTimestamp,
    setDoc,
    Timestamp,
} from "firebase/firestore";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBw3J6LSTRgaDUM8vyiE0vw1UHm-3NGj1c",
    authDomain: "blogapp-7cc2a.firebaseapp.com",
    projectId: "blogapp-7cc2a",
    storageBucket: "blogapp-7cc2a.appspot.com",
    messagingSenderId: "451207321182",
    appId: "1:451207321182:web:28b08465301fb09c2ac6cf",
    measurementId: "G-Z5T1JJMZTF"
};

// Initialize Firebase
initializeApp(firebaseConfig);


// Now you can use Firebase services like authentication and Firestore
const auth = getAuth();
const db = getFirestore();



// routes:

const routes=[
    {
        path:'index.html', 
        isProtected:true
    },

    {
        path:'login.html',
         isProtected:false
    },

    {
        path:'signup.html', 
        isProtected:false
    },
]
// authenticated user

function isUserAuth(){
    if(localStorage.token && localStorage.id){
        return true
    }
    else{
        return false
    }
}




// Function to handle protected route access
function handleProtectedRoute(route) {
    const currentRoute = routes.find((r) => r.path === route);
  
    if (currentRoute) {
      if (
        currentRoute.path === "register.html" ||
        currentRoute.path === "login.html"
      ) {
        if (isUserAuth()) {
          window.location.href = "/auth/dist/";
        }
      } else if (!isUserAuth()) {
        // If the route is protected and the user is not authenticated, redirect to the login page
        window.location.href = "/auth/dist/login.html";
        console.log('user is not authenticated')
      }

    //   if(currentRoute.path === "index.html"){
    //     if(isUserAuth()){
    //         window.location.href = "/auth/dist/index.html";
    //     }
    //     else{
    //         window.location.href = "/auth/dist/login.html";
    //     }
    //   }
    } else {
      // Handle unknown routes (e.g., 404)
      window.location.href = "/auth/dist/index.html"; // Redirect to a default route or an error page
    }
  }


  const handleRouteChange = () => {
    const currentPath = window.location.pathname.split("/").pop();
    console.log(currentPath)
    handleProtectedRoute(currentPath);
  };
  
  // Event listener for route changes
  window.addEventListener("DOMContentLoaded", handleRouteChange);


  handleRouteChange()
// ------------- Signup ----------

let signup = document.querySelector('.signup')
if (signup) {
    signup.addEventListener('submit', async (e) => {
        e.preventDefault()
        let name = e.target.fullname.value
        let email = e.target.email.value
        let password = e.target.password.value


        if (!name || !email || !password) {
            alert('Please fill the fields first')
        }
        else {
            await createUserWithEmailAndPassword(auth, email, password)
                .then(async (userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    console.log(user)
                    let userData = {
                        name,
                        email,
                        CreatedAt: Timestamp.fromDate(new Date())
                    }

                    await setDoc(doc(db, "users", user.uid), userData)

                    window.history.pushState({},"","/auth/dist/index.html")
                    handleRouteChange() 


                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;

                    if (errorCode) {
                        alert('Email already in use')
                    }

                });
        }
    })

}



// ---------- signup end ------------


// -------------Login Start------------


let loginform = document.querySelector('.login')
if (loginform) {
    loginform.addEventListener('submit', async (e) => {
        e.preventDefault()
        let email = e.target.email.value
        let password = e.target.password.value
        await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log('Logged in', user)
                localStorage.setItem('token', user.accessToken
                )
                localStorage.setItem('id', user.uid
                )

                window.history.pushState({},"","/auth/dist/index.html")
                handleRouteChange()
                window.location.reload()

                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert('Cant find an account')
            });
    })
}

// --------- login end--------------

// ------------ logout start ------------
let logoutS =document.querySelector('#logoutS')
if(logoutS){
logoutS.addEventListener('click',()=>{
    signOut(auth).then(() => {
        localStorage.clear()
        window.history.pushState({},"","/auth/dist/login.html")
        handleRouteChange()
        console.log('Logout success')
        window.location.reload()
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
      });
})
}
// ---------- Blog Form--------------

let blog = document.querySelector('.add-blog')
if (blog) {
    blog.addEventListener('submit', (e) => {
        e.preventDefault()
        let fullName = e.target.name.value
        let email = e.target.email.value
        let category = e.target.category.value
        let title = e.target.title.value

        console.log(fullName, email, category, title)
    })
}

// Fetching Data
const dataRef=collection(db,'users')
getDocs(dataRef).then((snapshot)=>{
    console.log(snapshot.docs)
})
