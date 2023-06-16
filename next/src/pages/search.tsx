import type {GetServerSidePropsContext, InferGetServerSidePropsType} from "next";
import {useSession} from "next-auth/react";
import Navbar from "../components/navs/navbar";
import {prisma} from "../server/db";
import {getLikes} from "../utils/getLikes";
import {getComments} from "../utils/getComments";
import {getServerSession} from "next-auth/next";
import {authOptions} from "../server/auth";
import PostType from "../types/post";
import Post from "../components/feed/post";
import Link from "next/link";
import addFriend from "../utils/addFriend";

const Home = ({users, posts}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const {data: session, status} = useSession();

    console.log(users, posts)

    return <>
        <Navbar>
            <main className="mx-auto md:w-1/2 w-full">
                <div className="gap-3 h-fit md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 hidden md:grid mb-4">
                    {
                        users.map(user => {
                            return <>
                                <Link href={`/user/${user.username || ""}`} className="w-full h-full">
                                    <div className="base-color w-full rounded-lg flex place-items-center flex-col h-full p-2">
                                        <img className="w-24 h-24 rounded-full object-cover" alt="Profile picture"
                                             src={user.image || undefined} />
                                        <h1 className="my-2 font-bold text-lg break-words max-w-[80%]">{user.name}</h1>
                                    </div>
                                </Link>
                            </>;
                        })
                    }
                </div>
                <ul>
                    {
                        // eslint-disable-next-line react/jsx-key
                        posts.map((post: PostType) => <Post post={post}/>)
                    }
                </ul>
            </main>
        </Navbar>
    </>
};

export default Home;

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions);

    let query = ""

    if (context.query.q) {
        query = context.query.q.toString()
    } else {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        };
    }

    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            username: true,
            image: true
        },
        where: {
            OR: [
                {name: {contains: query}},
                {username: {contains: query}}
            ]
        },
        take: 20
    })

    const posts = await prisma.post.findMany({
        select: {
            likes: true,
            id: true,
            content: true,
            createdAt: true,
            author: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true
                }
            }
        },
        where: {
            content: {
                contains: query
            }
        },
        take: 20
    });

    const likedPosts = await getLikes(session?.user.id || "", posts);
    const comments = await getComments(posts);

    const formattedPosts: PostType[] = posts.map(post => {
        return {
            ...post,
            liked: likedPosts ? likedPosts.includes(post.id) : false,
            createdAt: post.createdAt.toString(),
            comments: comments.filter(comment => comment.postId === post.id)
        };
    });

    return {
        props: {
            posts: formattedPosts,
            users: users
        }
    }
}