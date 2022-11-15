import axios, { AxiosError } from 'axios';
import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useInput from '../../hooks/useInput';
import { Header, Form, Label, Input, Button, LinkContainer, Error, Success } from './styles';

const SignUp = () => {
  const [email, onChangeEmail] = useInput('')
  const [nickname, onChangeNickname] = useInput('')
  const [password, setPassword] = useState('')
  const [passwordCheck, setPasswordCheck] = useState('')
  const [mismatchError, setMismatchError] = useState(false)
  const [signUpError, setSignUpError] = useState('')
  const [signUpSuccess, setSignUpSuccess] = useState(false)

  const onChangePassword = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setMismatchError(e.target.value !== passwordCheck)
  }, [passwordCheck])
  
  const onChangePasswordCheck = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordCheck(e.target.value)
    setMismatchError(e.target.value !== password)
  }, [password])
  
  const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(email, nickname, password, passwordCheck)
    if(!mismatchError) { // false -> error, true -> pass
      console.log('서버 통과!!! 회원가입에 성공했습니다.')
      setSignUpError('') // 초기화
      setSignUpSuccess(false)
      axios.post('localhost:3095/api/users', {
        email,
        nickname,
        password
      })
      .then((response) => {
        console.log(response)
        setSignUpSuccess(true)
      }) // 성공
      .catch((error: Error | AxiosError) => {
        if(axios.isAxiosError(error)) {
          console.log(error.response)
          setSignUpError(error.response?.data)
        } else {
          // stock
        }
      }) // 실패
      .finally(() => {}) // 성공, 실패 여부와 상관없이 무조건 실행
    }
  }, [email, nickname, password, passwordCheck, mismatchError])

  return (
    <div id="container">
      <Header>SLACK_CLONE</Header>
      <Form onSubmit={onSubmit}>
        {/* 이메일 주소 */}
        <Label id='email-label'>
          <span>이메일 주소</span>
          <div>
            <Input type='email' id='email' name='email' value={email} onChange={onChangeEmail}></Input>
          </div>
        </Label>
        {/* 닉네임 */}
        <Label>
          <span>닉네임</span>
          <div>
            <Input type='text' id='nickname' name='nickname' value={nickname} onChange={onChangeNickname}></Input>
          </div>
        </Label>
        {/* 비밀번호 */}
        <Label>
          <span>비밀번호</span>
          <div>
            <Input type='password' id='password' name='password' value={password} onChange={onChangePassword}></Input>
          </div>
        </Label>
        {/* 비밀번호 확인 */}
        <Label>
          <span>비밀번호</span>
          <div>
            <Input type='password' id='password-check' name='password-check' value={passwordCheck} onChange={onChangePasswordCheck}></Input>
          </div>
          {mismatchError && <Error>비밀번호가 일치하지 않습니다.</Error>} {/* mismatchEr = false일 때 <Error> */}
          {!nickname && <Error>닉네임이 없습니다.</Error>} {/* nickname이 false일 때 (!nickname) <Error> */}
          {signUpError && <Error>{signUpError}</Error>}
          {signUpSuccess && <Success>회원가입되없습니다! 로그인해주세요</Success>}
        </Label>
        <Button type='submit'>
          회원가입
        </Button>
      </Form>
      <LinkContainer>
        <span>이미 회원이신가요? </span>
        <Link to='/login'>로그인 하러가기</Link>
      </LinkContainer>
    </div>
  );
}

export default SignUp