import React from 'react';
import CategoryContainer from "./style";

interface IProps {
    children:JSX.Element
}


const Index = (props:IProps) => {
    return (
        <CategoryContainer>
            {props.children}
        </CategoryContainer>
    );
};

export default Index;