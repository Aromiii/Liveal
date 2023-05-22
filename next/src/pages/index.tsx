import type {GetServerSidePropsContext, InferGetServerSidePropsType} from "next";
import Navbar from "../components/navs/navbar";
import {useSession} from "next-auth/react";
import FriendsNav from "../components/navs/friendsNav";
import Link from "next/link";
import Post from "../components/feed/post";
import {getServerSession} from "next-auth/next";
import {authOptions} from "../server/auth";
import {getLikes} from "../utils/getLikes";
import {getComments} from "../utils/getComments";
import getFriends from "../utils/getFriends";
import {z} from "zod";
import {env} from "../env/server.mjs";

const Home = ({posts, friends}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const {data: session, status} = useSession();

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
                                    posts.map((post) => <Post postId={post.id} authorName={post.author.name}
                                                              liked={post.liked}
                                                              authorUsername={post.author.username}
                                                              authorImage={post.author.image} text={post.content}
                                                              createdAt={post.createdAt} comments={post.comments}
                                                              postLikes={post.likes}/>)
                                }
                            </ul>
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
                        <main className="w-[90vw] mx-auto md:w-1/2">
                            <ul>
                                {
                                    // eslint-disable-next-line react/jsx-key
                                    posts.map((post) => <Post authorName={post.author.name}
                                                              authorUsername={post.author.username}
                                                              authorImage={post.author.image} text={post.content}
                                                              createdAt={post.createdAt} comments={post.comments}
                                                              postLikes={post.likes}
                                                              liked={false} postId={post.id}/>)
                                }
                            </ul>
                        </main>
                    </div>
                </Navbar>
            </>
        );
    }
};

export default Home;

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions);

    let result: Response;
    try {
        result = await fetch(env.RECOMENDER_URL, {
            headers: {
                "cookie": `__Secure-next-auth.session-token=${context.req.cookies['next-auth.session-token'] || ""};`
            }
        })
    } catch (error) {
        console.error(error)
        return {
            redirect: {
                destination: "/404",
                permanent: false
            }
        };
    }

    const postsSchema = z.array(
        z.object({
            id: z.string(),
            likes: z.number(),
            content: z.string(),
            created_at: z.string(),
            username: z.string(),
            user_image: z.string().url(),
            name: z.string(),
            rating: z.number()
        })
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body = await result.json();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const posts = postsSchema.safeParse(body.data)

    if (!posts.success) {
        return {
            redirect: {
                destination: "/404",
                permanent: false
            }
        };
    }

    const friends = await getFriends(session?.user.id || "");
    const likedPosts = await getLikes(session?.user.id || "", posts.data);
    const comments = await getComments(posts.data);

    const formattedPosts = posts.data.map(post => {
        return {
            id: post.id,
            likes: post.likes,
            liked: likedPosts ? likedPosts.includes(post.id) : false,
            content: post.content,
            createdAt: post.created_at,
            author: {
                image: post.user_image,
                username: post.username,
                name: post.name
            },
            comments: comments.filter(comment => comment.postId === post.id)
        };
    });

    return {
        props: {
            friends: friends,
            posts: formattedPosts,
        }
    };
}