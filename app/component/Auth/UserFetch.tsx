'use client';
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/features/AuthSlice";
import Loader from "../Loader/Loader";
import { axiosFetch } from "../Axios/axios";


export default function UserFetch({
  children,
}: {
  children: React.ReactNode,
}) {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch();
  useEffect(() => {
    axiosFetch.get('/api/users/get-user-session', {
      withCredentials: true
    })
      .then((res) => {
        const {username:user, isadmin, isbanned, strikes} = res.data.userData;
        // console.log(res.data.userData);
        // const strikes:number = res.data.userData.strikes;
        // console.log(user);
        dispatch(loginUser({username: user, isadmin, strikes, isbanned}))
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      })
  }, [])


  return (
    <>
      {loading ?
      <></>:
      <>{children}</>
      }
    </>
  )
}

// export default async function userFetch() {
//   try {
//   const res = await fetch('http://localhost:5000/api/users/get-user-session', 
//   { credentials: 'include'});
//   const userData = await res.json();
//   console.log(`running ${userData}`);
//   console.log(Object.keys(userData));
//   // const username ='jhe'
//   return userData;
//   } catch(err) {
//     return undefined;
//   }
// }