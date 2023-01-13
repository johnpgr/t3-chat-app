import {useEffect, useRef, useState} from "react";

export function useIsIntersecting<TElement extends HTMLElement>(){
    const [isIntersecting, setIsIntersecting] = useState(false)
    const ref = useRef<TElement>(null);

    useEffect(()=>{
        if(!ref.current) return;

        const observer = new IntersectionObserver(([entry])=> {
            if(!entry) return;
            setIsIntersecting(entry.isIntersecting);
        });

        observer.observe(ref.current);

        return () => {
            observer.disconnect();
        }
    }, [])

    return [isIntersecting,ref] as const;
}