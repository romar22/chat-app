import { useUser } from "@/context/UserContext";
import { isRouteActive, routeActiveAddClass } from "@/shared/utils/helper";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChatCircle, ChatsCircle, MagnifyingGlass, SignOut } from "phosphor-react";
import { ReactNode } from "react";

type MainLayoutProps = {
  children: ReactNode;
};

const sideNavLinks = [
    { 
        name: 'Chat', 
        href: '/u/u' ,
        icon: ChatsCircle,
    },
    { 
        name: 'Search for users', 
        href: '/u' ,
        icon: MagnifyingGlass,
    },
]

export default function MainLayout({ children }: MainLayoutProps){
    const router = useRouter();
    const { logout } = useUser();

    return(
        <div className="flex">
            <aside className="side-nav">
                <div>
                    <div className="flex flex-col items-center justify-center pb-2 m-4 border-b-2 mb-20 border-gray-500">
                        <ChatCircle color="yellow" weight="fill" size={32} />
                    </div>

                    {sideNavLinks.map((link, i) => (
                        <Link 
                            key={i}
                            href={link.href}
                            className={`side-nav__link ${routeActiveAddClass(router, link.href, "active", 2)}`}>
                            <link.icon 
                                className="icon"
                                weight="fill"
                                size={30} />
                            <small className="link">
                                    {link.name}
                            </small>
                        </Link>
                    ))}
                </div>

                <a
                    onClick={logout}
                    className="side-nav__link cursor-pointer mb-20">
                    <SignOut
                        className="icon"
                        weight="fill"
                        size={26} />
                    <small className="link">
                        Sign Out
                    </small>
                </a>
            </aside>

            <main className="flex-grow bg-[#202329]">
                {children}
            </main>
        </div>
    )
}