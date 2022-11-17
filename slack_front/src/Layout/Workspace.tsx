import axios from "axios";
import React, { useCallback } from "react";
import { Navigate } from "react-router-dom";
import useSWR from 'swr'
import fetcher from "../utils/fetcher";

interface Props {
  children: React.ReactNode;
}

const Workspace = ({ children }: Props) => {
  const { data, mutate } = useSWR('http://localhost:3095/api/users', fetcher)
  const onLogout = useCallback(() => {
    axios.post('http://localhost:3095/api/users/logout', null, {
      withCredentials: true
    })
    .then(() => {
      console.log('로그아웃 성공!')
      mutate();
    })
  }, [mutate])

  if(!data) {
    return <Navigate to='/login' />
  }

  return (
    <div>
      <button onClick={onLogout}>로그아웃</button>
      {children}
    </div>
    )
}

export default Workspace