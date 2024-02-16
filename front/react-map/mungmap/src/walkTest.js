import React, { useState, useEffect } from 'react';

function WalkTest() {
  const [myFunction, setMyFunction] = useState(() => () => {});

  useEffect(() => {
    // 함수를 정의합니다.
    const functionInUseEffect = () => {
      console.log('버튼이 클릭되었습니다!');
    };

    // useState를 사용하여 함수를 저장합니다.
    setMyFunction(() => functionInUseEffect);
  }, []); // 빈 의존성 배열을 사용하여 이 useEffect가 마운트될 때 한 번만 실행되게 합니다.

  return (
    <button onClick={myFunction}>
      버튼
    </button>
  );
}

export default WalkTest;