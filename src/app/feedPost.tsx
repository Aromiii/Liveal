const getDogImage = async () => {
  const result = await fetch("https://dog.ceo/api/breeds/image/random")
  const data = await result.json()
  return data.message
}

export default async function FeedPost(props: { profileImage: string, postImage: string, postText: string }) {
  const dogImage = await getDogImage()

  return <section className="bg-white rounded-lg mb-2 p-2">
    <div className="flex place-items-center gap-2">
      <img className="rounded-full object-cover h-16 w-16" alt="Profile picture" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.naso.org%2Fwp-content%2Fuploads%2F2016%2F12%2Fperson-pointing.jpg&f=1&nofb=1&ipt=4ec920cdb2e204f2ef7432a17fe62fc3e0488579b2c41781e01150491edc3bda&ipo=images"/>
      <div>
        <h1 className="font-semibold text-lg">Kissa koira</h1>
        <h2 className="font-extralight">17.32 21.4.2022</h2>
      </div>
    </div>
    <img className="p-2 w-full rounded-2xl" src={dogImage}/>
    <p className="p-2">
      Exercitationem nobis velit natus minus. Beatae voluptatum modi quis. Possimus fugit dolorem et dolor autem quia unde cumque. Assumenda sit nihil vero totam dolorem est omnis iusto. Perspiciatis dolor magnam repudiandae eaque nostrum iure minus cupiditate.

      Ipsum totam qui blanditiis consequatur labore impedit. Eligendi animi accusantium voluptatem dicta sunt consequatur nihil sequi. Numquam voluptas fugiat vitae et aut est. Quam error inventore voluptatem odit. Accusantium recusandae ipsum aut quia. Et enim ad labore aut eum dolorem consequatur.
    </p>
  </section>;
}