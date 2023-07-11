import Spinner from "@/components/Spinner";
import { useUser } from "@/context/UserContext";
import { Fragment, ReactNode } from "react";

type UserLoaderProps = {
  children: ReactNode;
};

export default function UserLoader({ children }: UserLoaderProps) {
    const { user } = useUser();
    
    return (
        <Fragment>
            {user ? 
                children : 
                <Spinner />
            }
            
        </Fragment>
    );
}