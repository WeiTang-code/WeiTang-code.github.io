import styled from "styled-components";

const HeaderCountainer = styled.div`
  height: 92px;
  width: 100%;
  padding: 0 16px;
  background-color: #f9fafb;
  display: flex;
  justify-content: space-between;
  border-bottom: 4px solid #e5e7eb;
  .header-left {
    width: 144px;
    height: 100%;
    //background-color: #bfa;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .avatar {
      background-image: url('https://img2.baidu.com/it/u=4058957213,578735419&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=711');
      height: 70px;
      width: 70px;
      min-width: 70px;
      min-height: 70px;
      border-radius: 50%;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: 0 50%;
    }
    span {
      font-size: 26px;
    }
  }

  .header-right {
    width: 270px;
    //border: 1px solid;
    ul {
      height: 100%;
      list-style: none;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      li {
        font-size: 20px;
        width: 80px;
        color: #7a7b7b;
        text-align: end;
      }
      li:hover {
        cursor: pointer;
        color: black;
      }
    }
  }
`

export default HeaderCountainer