import React, { useState, useEffect, useRef, createRef } from 'react';
import styled from 'styled-components';
import Board from './Board';
import DrawControl from './DrawControl';
import { CompactPicker } from 'react-color';
import socket from 'areas/socket/services';
import { getOnlineUsersObj } from 'areas/user/selectors';
import { useSelector } from 'react-redux';
import { getUser } from 'areas/session/selectors';
import { getOnlineUsers } from '../services';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;
const Rapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const Avatar = styled.img`
  box-shadow: rgba(139, 139, 139, 0.32) 1px 1px 3px 0px;
  height: ${(props) => props.size};
  width: ${(props) => props.size};
  border-width: 0px;
  border-style: solid;
  border-color: rgb(255, 255, 255);
  border-image: initial;
  border-radius: 50%;
  position: absolute;
  transition: all 0.2s linear;
  opacity: 0;
  pointer-events: none;
`;
const DEFAULT_AVATAR =
  'http://www.gravatar.com/avatar/ae69fa0d674d490c99c4d8fdca23f1e2?s=100&r=x&d=retro';
export default function Canvas() {
  const onlineUsers = useSelector(getOnlineUsersObj);
  const currentUser = useSelector(getUser);
  const myBoard = useRef();
  const canvas = useRef();
  const [, forceUpdate] = React.useState(0);
  const [color, setColor] = useState('#000');
  const users = useRef({});
  const handleColor = (color) => {
    if (myBoard.current) {
      myBoard.current.changeColor(color.hex);
      setColor(color.hex);
    }
  };

  useEffect(() => {
    myBoard.current = new Board(canvas.current);
    const drawControl = new DrawControl();
    myBoard.current.onMouseMove77 = drawControl.onMouseMove;
    myBoard.current.onMouseDown77 = drawControl.onMouseDown;
    myBoard.current.onMouseUp77 = drawControl.onMouseUp;

    drawControl.onSend = (path) => {
      const color = myBoard.current.getColor();
      socket.emit('plugins.drawingBoard.drawPath', { path, color });
    };

    function getUserComponent(uid) {
      if (!users.current[uid]) {
        const OnlineUser = onlineUsers[uid];
        users.current[uid] = {
          timeoutId: null,
          component: createRef(),
          imgSrc: OnlineUser && OnlineUser.picture ? OnlineUser.picture : DEFAULT_AVATAR
        };
        console.log('onlineUsers', onlineUsers);

        if (OnlineUser && OnlineUser.picture) {
          getOnlineUsers().then((data) => {
            const user = data.find((u) => u.uid === uid);
            users.current[uid].imgSrc = user.picture || DEFAULT_AVATAR;
            forceUpdate((n) => !n);
          });
        }
        forceUpdate((n) => !n);
      }

      return users.current[uid];
    }

    socket.on('event:drawPath', (result) => {
      const { uid, path, color } = result;
      if (currentUser && currentUser.uid === uid) {
        return;
      }
      const user = getUserComponent(uid);
      myBoard.current.drawPatah(path, color);
      if (user && user.component.current) {
        const avatar = user.component.current;
        const lastCords = path[path.length - 1];
        clearInterval(user.timeoutId);
        avatar.style.opacity = '1';
        avatar.style.left = lastCords[0] + 'px';
        avatar.style.top = lastCords[1] + 'px';
        user.timeoutId = setTimeout(function () {
          if (avatar) {
            avatar.style.opacity = '0';
          }
        }, 500);
      }
    });

    socket.emit('plugins.drawingBoard.getBoard', null, (err, result) => {
      if (err) {
        console.log('error getBoard', err);
        return;
      }
      if (result.board.length) {
        result.board.forEach(({ path, color }) => {
          myBoard.current.drawPatah(path, color);
        });
      }
    });
  }, [canvas, myBoard]);
  console.log('users', users);

  return (
    <Rapper>
      <Container className='mb-3'>
        {Object.keys(users.current).map((uid) => {
          const user = users.current[uid];
          return (
            <Avatar
              key={user.imgSrc}
              ref={user.component}
              width='25px'
              height='25px'
              src={user.imgSrc}
            />
          );
        })}
        <canvas
          id='can'
          width='800'
          height='400'
          style={{ border: '1px solid' }}
          ref={canvas}
        ></canvas>
        <div className='mt-1'>
          <CompactPicker color={color} onChangeComplete={handleColor} />
        </div>
      </Container>
    </Rapper>
  );
}
