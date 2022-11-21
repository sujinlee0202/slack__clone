import axios from 'axios';
import React, { useCallback, useState } from 'react'
import { Link, Navigate } from 'react-router-dom';
import useInput from '../../hooks/useInput';
import { Header, Form, Label, Input, Button, LinkContainer, Error } from '../SignUp/styles';
import useSWR from 'swr';
import fetcher from '../../utils/fetcher';

const LogIn = () => {
  const { data, mutate } = useSWR('http://localhost:3095/api/users', fetcher, {
    dedupingInterval: 100000,
  })
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const [loginError, setLoginError] = useState(false)

  const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError(false)
    axios.post('/api/users/login', {
      email,
      password,
    }, {
      withCredentials: true,
    })
    .then((response) => {
      console.log('로그인 성공')
      mutate(response.data, false);
    })
    .catch((error) => {
      setLoginError(error.response?.data?.statusCode ===  401)
    })
  }, [email, password, mutate])



  if(data) {
    return <Navigate to='/workspace/channel' />
  }

  return (
    <div id='contaioner'>
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id='email-label'>
          <span>이메일 주소</span>
          <div>
            <Input type='email' id='email' name='email' value={email} onChange={onChangeEmail}></Input>
          </div>
        </Label>
        <Label id='password-label'>
          <span>비밀번호</span>
          <div>
            <Input type='password' id='password' name='password' value={password} onChange={onChangePassword}></Input>
          </div>
          {loginError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
        </Label>
        <Button type='submit'>로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요? 
        <Link to='/signup'>회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  )
}

export default LogIn