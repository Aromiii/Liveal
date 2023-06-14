import type {GetServerSidePropsContext, InferGetServerSidePropsType} from "next";
import Navbar from "../components/navs/navbar";
import {useSession} from "next-auth/react";
import FriendsNav from "../components/navs/friendsNav";
import Link from "next/link";
import Post from "../components/feed/post";
import {getServerSession} from "next-auth/next";
import {authOptions} from "../server/auth";
import getFriends from "../utils/getFriends";
import {z} from "zod";
import type PostType from "../types/post"
import {useInfiniteQuery} from "@tanstack/react-query";
import {useEffect, useRef, useState} from "react";
import {clientEnv, serverEnv} from "../env/schema.mjs";

const Home = ({ogPosts, friends}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const {data: session, status} = useSession();
    const [posts, setPosts] = useState<PostType[]>(ogPosts)
    let nextPage = 2

    console.log(posts)

    const {
        fetchNextPage,
        isFetching
    } = useInfiniteQuery({
        queryKey: ['posts'],
        getNextPageParam: () => {
            nextPage += 1
            return nextPage
        },
        queryFn: async ({pageParam = 1}: {pageParam?: number} = {}) => {
            try {
                const url = clientEnv.NEXT_PUBLIC_RECOMMENDER_URL || ""
                const result = await fetch(`${url}/?page=${pageParam}`, {
                    credentials: "include"
                })

                const schema = z.custom<{ data: PostType[] }>()
                const data = schema.parse(await result.json())

                setPosts(posts => [...posts, ...data.data])
            } catch (e) {
                console.log(e)
            }
        }
    })


    const observerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(handleIntersection, {
            root: null,
            rootMargin: '500px',
            threshold: 0
        });
        if (observerRef.current) observer.observe(observerRef.current);

    }, []);

    const handleIntersection: IntersectionObserverCallback = (entries) => {
        const [entry] = entries;
        console.log(entry)
        if (entry?.isIntersecting && entry.target === observerRef.current) {
            void fetchNextPage()
        }
    };

    if (status == "authenticated") {
        return (
            <>
                <Navbar>
                    <div className="flex gap-5">
                        <aside className="w-1/6 min-w-[150px] md:block hidden">
                            <Link href={`/user/${session.user.username || ""}`}>
                                <div className="base-color rounded-lg flex place-items-center flex-col">
                                    <img className="w-24 h-24 rounded-full object-cover m-2" alt="Profile picture"
                                         src={session.user.image || undefined}/>
                                    <h1 className="m-2 font-bold text-lg break-words max-w-[80%]">{session.user.name}</h1>
                                </div>
                            </Link>
                            <div className="hidden md:block mt-5">
                                <FriendsNav friends={friends}/>
                            </div>
                        </aside>
                        <main className="mx-auto md:w-1/2 w-full">
                            <ul>
                                {
                                    // eslint-disable-next-line react/jsx-key
                                    posts.map((post: PostType) => <Post post={post}/>)
                                }
                            </ul>
                            <div ref={observerRef}
                                 className="text-center dark:text-white text-black font-semibold m-2">
                                {isFetching ?
                                    <p>Loading more posts...</p>
                                    :
                                    <>
                                        <p>Error in fetching more posts</p>
                                        <button
                                            className="dark:bg-white bg-gray-500 dark:text-black text-white p-2 rounded-lg m-2"
                                            onClick={() => void fetchNextPage()}>Try to fetch more
                                        </button>
                                    </>
                                }
                            </div>
                            <Link href="/post/new">
                                <svg
                                    className="shadow shadow-gray-500 bg-red-500 rounded-full fill-white fixed bottom-[1rem] md:right-[28%] right-[10%]"
                                    xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48">
                                    <path d="M450 856V606H200v-60h250V296h60v250h250v60H510v250h-60Z"/>
                                </svg>
                            </Link>
                        </main>
                        <aside className="w-1/6 min-w-[150px] md:block hidden">
                        </aside>
                    </div>
                </Navbar>
            </>
        );
    }

    if (status == "unauthenticated") {
        return (
            <>
                <Navbar>
                    <div className="flex gap-5">
                        <main className="w-[90vw] mx-auto md:w-1/2 mb-20">
                            <ul>
                                {
                                    // eslint-disable-next-line react/jsx-key
                                    posts.map((post) => <Post post={post}/>)
                                }
                            </ul>
                            <div ref={observerRef}
                                 className="text-center dark:text-white text-black font-semibold m-2">
                                {isFetching ?
                                    <p>Loading more posts...</p>
                                    :
                                    <>
                                        <p>Error in fetching more posts</p>
                                        <button
                                            className="dark:bg-white bg-gray-500 dark:text-black text-white p-2 rounded-lg m-2"
                                            onClick={() => void fetchNextPage()}>Try to fetch more
                                        </button>
                                    </>
                                }
                            </div>
                        </main>
                    </div>
                </Navbar>
            </>
        );
    }
};

export default Home;

export async function getServerSideProps(context: GetServerSidePropsContext) {
    try {
        const session = await getServerSession(context.req, context.res, authOptions);

        const url = serverEnv.RECOMMENDER_URL || ""
        let result: Response
        if (context.req.cookies['next-auth.session-token']) {
            result = await fetch(`${url}/?page=0`, {
                headers: {
                    "cookie": `next-auth.session-token=${context.req.cookies['next-auth.session-token']};`
                },
            })
        } else {
            result = await fetch(`${url}/?page=0`)
        }


        const schema = z.custom<{ data: PostType[] }>()
        const data = schema.parse(await result.json())
        const friends = await getFriends(session?.user.id || "");

        return {
            props: {
                friends: friends,
                ogPosts: data.data,
            }
        };
    } catch (error) {
        console.error(error)
        return {
            redirect: {
                destination: "/404",
                permanent: false
            }
        };
    }
}