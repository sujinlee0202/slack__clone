import React, { FC, useCallback, useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom';
import { useParams } from 'react-router-dom'
import useSWR from 'swr';
import { IUser, IUserWithOnline } from '../../typings/db';
import fetcher from '../../utils/fetcher';
import { CollapseButton, H2, CircleDiv, DMMember } from './styles';

const DMList: FC = () => {
  const { workspace } = useParams();
  const { data: userData } = useSWR<IUser>(`/api/users`, fetcher, {
    dedupingInterval: 2000,
  })
  const { data: memberData } = useSWR<IUserWithOnline[]>(userData ? `/api/workspaces/${workspace}/members` : null, fetcher)

  const [channelCollapse, setChannelCollapse] = useState(false);
  const [onlineList, setOnlineList] = useState<number[]>([]);
  
  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev)
  }, [])

  useEffect(() => {
    console.log('DMList: workspace 바꼈다', workspace);
    setOnlineList([]);
  }, [workspace]);

  return (
    <>
      <H2>
        <CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
        <i
            className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
            data-qa="channel-section-collapse"
            aria-hidden="true"
          />
        </CollapseButton>
        <span>Direct Messages</span>
      </H2>
      <div>
        {!channelCollapse &&
          memberData?.map((member) => {
            const isOnline = onlineList.includes(member.id);

            return (
              <NavLink key={member.id} to={`/workspace/${workspace}/dm/${member.id}`}>
                <DMMember key={member.id}>
                  <CircleDiv isOnline={isOnline}></CircleDiv>
                  <span>{member.nickname}</span>
                  {member.id === userData?.id && <span> (나)</span>}
                </DMMember>
              </NavLink>
            )
          })
        }
      </div>
    </>
  )
}

export default DMList