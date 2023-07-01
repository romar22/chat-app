import { useUser } from "@/context/UserContext"

export default function Home(){
    const { user, logout } = useUser();

    return (
        <div>
            <div>
                {user?.username}
            </div>
            <button onClick={logout}>logout</button>
        </div>
    )
}