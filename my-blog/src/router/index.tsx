import {lazy} from "react";

const lazyLoad = (moduleName:string) => {
    const Element = lazy(()=>import((`/src/views/${moduleName}`)))
    return <Element></Element>
}