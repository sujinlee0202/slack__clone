import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Header, Form, Label, Input, Button, LinkContainer, Error } from './styles';

const SignUp = () => {
  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [passwordCheck, setPasswordCheck] = useState('')
  const [mismatchError, setMismatchError] = useState(false)

  const onChangeEmail = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }, [])

  const onChangeNickname = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value)
  }, [])

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
    } else {
      console.log('비밀번호가 틀렸습니다!')
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