import React from 'react';
import HeaderCountainer from "./style";

const Index = () => {
    return (
        <HeaderCountainer>
            <div className="header-left">
                <a className="avatar" href="#"></a>
                <span>唐唯</span>
            </div>
            <div className="header-right">
                <ul>
                    <li>首页</li>
                    <li>文章</li>
                    <li>关于</li>
                </ul>
            </div>
        </HeaderCountainer>
    );
};

export default Index;